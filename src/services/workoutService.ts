import type { WorkoutSession, WorkoutSet, PersonalRecord } from '../types';
import { gymDB } from './database';

export class WorkoutService {
  private static userId = 'demo-user';

  static async startWorkout(name: string = 'Workout'): Promise<WorkoutSession> {
    const session: WorkoutSession = {
      id: crypto.randomUUID(),
      userId: this.userId,
      name,
      date: new Date(),
      startTime: new Date(),
      sets: [],
    };

    await gymDB.addWorkoutSession(session);
    return session;
  }

  static async addSetToWorkout(sessionId: string, set: Omit<WorkoutSet, 'id'>): Promise<WorkoutSet> {
    const newSet: WorkoutSet = {
      ...set,
      id: crypto.randomUUID(),
    };

    // Get current session
    const sessions = await gymDB.getWorkoutSessions(this.userId);
    const session = sessions.find(s => s.id === sessionId);
    
    if (!session) {
      throw new Error('Workout session not found');
    }

    // Add set to session
    session.sets.push(newSet);
    
    // Update session in database
    await gymDB.updateWorkoutSession(session);

    // Check for personal record
    if (set.weight && set.reps) {
      await this.checkAndUpdatePersonalRecord(set.exerciseId, set.weight, set.reps, sessionId);
    }

    return newSet;
  }

  static async finishWorkout(sessionId: string): Promise<WorkoutSession> {
    const sessions = await gymDB.getWorkoutSessions(this.userId);
    const session = sessions.find(s => s.id === sessionId);
    
    if (!session) {
      throw new Error('Workout session not found');
    }

    session.endTime = new Date();
    await gymDB.updateWorkoutSession(session);
    
    return session;
  }

  static async getActiveWorkout(): Promise<WorkoutSession | null> {
    const sessions = await gymDB.getWorkoutSessions(this.userId, 1);
    const latest = sessions[0];
    
    if (latest && !latest.endTime) {
      return latest;
    }
    
    return null;
  }

  static async getWorkoutHistory(limit?: number): Promise<WorkoutSession[]> {
    return await gymDB.getWorkoutSessions(this.userId, limit);
  }

  static async deleteSet(sessionId: string, setId: string): Promise<void> {
    const sessions = await gymDB.getWorkoutSessions(this.userId);
    const session = sessions.find(s => s.id === sessionId);
    
    if (!session) {
      throw new Error('Workout session not found');
    }

    session.sets = session.sets.filter(s => s.id !== setId);
    await gymDB.updateWorkoutSession(session);
  }

  static async updateSet(sessionId: string, setId: string, updates: Partial<WorkoutSet>): Promise<void> {
    const sessions = await gymDB.getWorkoutSessions(this.userId);
    const session = sessions.find(s => s.id === sessionId);
    
    if (!session) {
      throw new Error('Workout session not found');
    }

    const setIndex = session.sets.findIndex(s => s.id === setId);
    if (setIndex === -1) {
      throw new Error('Set not found');
    }

    session.sets[setIndex] = { ...session.sets[setIndex], ...updates };
    await gymDB.updateWorkoutSession(session);

    // Check for PR if weight/reps updated
    const updatedSet = session.sets[setIndex];
    if (updatedSet.weight && updatedSet.reps) {
      await this.checkAndUpdatePersonalRecord(
        updatedSet.exerciseId, 
        updatedSet.weight, 
        updatedSet.reps, 
        sessionId
      );
    }
  }

  private static async checkAndUpdatePersonalRecord(
    exerciseId: string, 
    weight: number, 
    reps: number, 
    sessionId: string
  ): Promise<void> {
    // Get current PRs for this exercise
    const existingPRs = await gymDB.getPersonalRecords(this.userId, exerciseId);
    
    // Calculate 1RM using Epley formula: weight * (1 + reps/30)
    const estimatedOneRM = weight * (1 + reps / 30);
    
    // Find best existing PR
    const bestPR = existingPRs.reduce((best, pr) => {
      const prOneRM = pr.weight * (1 + pr.reps / 30);
      const bestOneRM = best ? best.weight * (1 + best.reps / 30) : 0;
      return prOneRM > bestOneRM ? pr : best;
    }, null as PersonalRecord | null);

    // Check if this is a new PR
    const isNewPR = !bestPR || estimatedOneRM > (bestPR.weight * (1 + bestPR.reps / 30));
    
    if (isNewPR) {
      const pr: PersonalRecord = {
        id: crypto.randomUUID(),
        userId: this.userId,
        exerciseId,
        weight,
        reps,
        date: new Date(),
        workoutSessionId: sessionId,
      };
      
      await gymDB.addPersonalRecord(pr);
    }
  }

  static async getPersonalRecords(exerciseId?: string): Promise<PersonalRecord[]> {
    return await gymDB.getPersonalRecords(this.userId, exerciseId);
  }

  static async getWorkoutStats(): Promise<{
    totalWorkouts: number;
    totalSets: number;
    totalWeight: number;
    averageDuration: number;
    currentStreak: number;
  }> {
    const sessions = await gymDB.getWorkoutSessions(this.userId);
    const completedSessions = sessions.filter(s => s.endTime);

    const totalSets = completedSessions.reduce((sum, s) => sum + s.sets.length, 0);
    const totalWeight = completedSessions.reduce((sum, s) => 
      sum + s.sets.reduce((setSum, set) => 
        setSum + (set.weight || 0) * set.reps, 0
      ), 0
    );

    const avgDuration = completedSessions.reduce((sum, s) => {
      if (s.endTime && s.startTime) {
        return sum + (s.endTime.getTime() - s.startTime.getTime());
      }
      return sum;
    }, 0) / completedSessions.length / (1000 * 60); // Convert to minutes

    // Calculate current streak (consecutive days with workouts)
    const sortedSessions = completedSessions.sort((a, b) => b.date.getTime() - a.date.getTime());
    let currentStreak = 0;
    let lastWorkoutDate: Date | null = null;

    for (const session of sortedSessions) {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);

      if (!lastWorkoutDate) {
        lastWorkoutDate = sessionDate;
        currentStreak = 1;
      } else {
        const daysDiff = (lastWorkoutDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysDiff === 1) {
          currentStreak++;
          lastWorkoutDate = sessionDate;
        } else if (daysDiff > 1) {
          break;
        }
      }
    }

    return {
      totalWorkouts: completedSessions.length,
      totalSets,
      totalWeight: Math.round(totalWeight),
      averageDuration: Math.round(avgDuration),
      currentStreak,
    };
  }

  static async getVolumeByMuscleGroup(): Promise<Record<string, number>> {
    const sessions = await gymDB.getWorkoutSessions(this.userId);
    const exercises = await gymDB.getExercises();
    const muscleGroupVolume: Record<string, number> = {};

    // Get last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSessions = sessions.filter(s => s.date >= thirtyDaysAgo);

    for (const session of recentSessions) {
      for (const set of session.sets) {
        const exercise = exercises.find(e => e.id === set.exerciseId);
        if (exercise && set.weight) {
          const volume = set.weight * set.reps;
          
          for (const muscle of exercise.primaryMuscles) {
            muscleGroupVolume[muscle] = (muscleGroupVolume[muscle] || 0) + volume;
          }
          
          // Add secondary muscles with 50% weight
          for (const muscle of exercise.secondaryMuscles) {
            muscleGroupVolume[muscle] = (muscleGroupVolume[muscle] || 0) + volume * 0.5;
          }
        }
      }
    }

    return muscleGroupVolume;
  }
}