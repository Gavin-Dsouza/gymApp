import type { Exercise } from '../types';
import { gymDB } from './database';

export const defaultExercises: Omit<Exercise, 'id'>[] = [
  // Chest Exercises
  {
    name: 'Bench Press',
    category: 'strength',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['shoulders', 'triceps'],
    equipment: ['barbell'],
    difficulty: 'intermediate',
    isCompound: true,
    instructions: [
      'Lie on bench with eyes under the bar',
      'Grip bar slightly wider than shoulder width',
      'Lower bar to chest with control',
      'Press bar up explosively',
      'Keep core tight throughout movement'
    ]
  },
  {
    name: 'Push-ups',
    category: 'strength',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['shoulders', 'triceps', 'core'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    isCompound: true,
  },
  {
    name: 'Dumbbell Flyes',
    category: 'strength',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['shoulders'],
    equipment: ['dumbbell'],
    difficulty: 'intermediate',
    isCompound: false,
  },

  // Back Exercises
  {
    name: 'Deadlifts',
    category: 'strength',
    primaryMuscles: ['back', 'glutes', 'hamstrings'],
    secondaryMuscles: ['core', 'traps', 'forearms'],
    equipment: ['barbell'],
    difficulty: 'advanced',
    isCompound: true,
  },
  {
    name: 'Pull-ups',
    category: 'strength',
    primaryMuscles: ['back', 'lats'],
    secondaryMuscles: ['biceps', 'shoulders'],
    equipment: ['bodyweight'],
    difficulty: 'intermediate',
    isCompound: true,
  },
  {
    name: 'Bent-over Rows',
    category: 'strength',
    primaryMuscles: ['back', 'lats'],
    secondaryMuscles: ['biceps', 'shoulders'],
    equipment: ['barbell'],
    difficulty: 'intermediate',
    isCompound: true,
  },

  // Leg Exercises
  {
    name: 'Squats',
    category: 'strength',
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves', 'core'],
    equipment: ['barbell'],
    difficulty: 'intermediate',
    isCompound: true,
  },
  {
    name: 'Lunges',
    category: 'strength',
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves'],
    equipment: ['bodyweight', 'dumbbell'],
    difficulty: 'beginner',
    isCompound: true,
  },
  {
    name: 'Leg Press',
    category: 'strength',
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings'],
    equipment: ['machine'],
    difficulty: 'beginner',
    isCompound: true,
  },

  // Shoulder Exercises
  {
    name: 'Overhead Press',
    category: 'strength',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: ['triceps', 'core'],
    equipment: ['barbell', 'dumbbell'],
    difficulty: 'intermediate',
    isCompound: true,
  },
  {
    name: 'Lateral Raises',
    category: 'strength',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: [],
    equipment: ['dumbbell'],
    difficulty: 'beginner',
    isCompound: false,
  },

  // Arm Exercises
  {
    name: 'Bicep Curls',
    category: 'strength',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    equipment: ['dumbbell', 'barbell'],
    difficulty: 'beginner',
    isCompound: false,
  },
  {
    name: 'Tricep Dips',
    category: 'strength',
    primaryMuscles: ['triceps'],
    secondaryMuscles: ['shoulders', 'chest'],
    equipment: ['bodyweight'],
    difficulty: 'intermediate',
    isCompound: false,
  },
  {
    name: 'Close-grip Bench Press',
    category: 'strength',
    primaryMuscles: ['triceps'],
    secondaryMuscles: ['chest', 'shoulders'],
    equipment: ['barbell'],
    difficulty: 'intermediate',
    isCompound: true,
  },

  // Core Exercises
  {
    name: 'Plank',
    category: 'strength',
    primaryMuscles: ['core'],
    secondaryMuscles: ['shoulders'],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    isCompound: false,
  },
  {
    name: 'Russian Twists',
    category: 'strength',
    primaryMuscles: ['core'],
    secondaryMuscles: [],
    equipment: ['bodyweight'],
    difficulty: 'beginner',
    isCompound: false,
  },

  // Cardio Exercises
  {
    name: 'Running',
    category: 'cardio',
    primaryMuscles: ['legs'],
    secondaryMuscles: ['core'],
    equipment: ['other'],
    difficulty: 'beginner',
    isCompound: true,
  },
  {
    name: 'Cycling',
    category: 'cardio',
    primaryMuscles: ['legs'],
    secondaryMuscles: ['core'],
    equipment: ['machine'],
    difficulty: 'beginner',
    isCompound: true,
  },
  {
    name: 'Jump Rope',
    category: 'cardio',
    primaryMuscles: ['legs', 'shoulders'],
    secondaryMuscles: ['core'],
    equipment: ['other'],
    difficulty: 'intermediate',
    isCompound: true,
  },
];

export class ExerciseLibraryService {
  static async initializeDefaultExercises(): Promise<void> {
    try {
      // Check if exercises already exist
      const existingExercises = await gymDB.getExercises();
      if (existingExercises.length > 0) {
        console.log('Exercises already initialized');
        return;
      }

      // Add default exercises
      for (const exerciseData of defaultExercises) {
        const exercise: Exercise = {
          ...exerciseData,
          id: crypto.randomUUID(),
        };
        await gymDB.addExercise(exercise);
      }

      console.log(`Initialized ${defaultExercises.length} default exercises`);
    } catch (error) {
      console.error('Failed to initialize default exercises:', error);
    }
  }

  static async getExercisesByMuscleGroup(muscleGroup: string): Promise<Exercise[]> {
    try {
      return await gymDB.getExercisesByMuscleGroup(muscleGroup);
    } catch (error) {
      console.error('Failed to get exercises by muscle group:', error);
      return [];
    }
  }

  static async searchExercises(query: string): Promise<Exercise[]> {
    try {
      const allExercises = await gymDB.getExercises();
      return allExercises.filter(exercise => 
        exercise.name.toLowerCase().includes(query.toLowerCase()) ||
        exercise.primaryMuscles.some(muscle => 
          muscle.toLowerCase().includes(query.toLowerCase())
        ) ||
        exercise.category.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Failed to search exercises:', error);
      return [];
    }
  }

  static getMuscleGroupEmoji(muscleGroup: string): string {
    const emojiMap: Record<string, string> = {
      chest: '🫁',
      back: '🔙',
      shoulders: '💪',
      biceps: '💪',
      triceps: '💪',
      legs: '🦵',
      quadriceps: '🦵',
      hamstrings: '🦵',
      glutes: '🍑',
      calves: '🦵',
      core: '🔥',
      lats: '🔙',
      traps: '🔙',
      forearms: '💪',
    };
    return emojiMap[muscleGroup.toLowerCase()] || '💪';
  }

  static getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'beginner': return 'text-strength-600 bg-strength-100';
      case 'intermediate': return 'text-cardio-600 bg-cardio-100';
      case 'advanced': return 'text-muscle-600 bg-muscle-100';
      default: return 'text-recovery-600 bg-recovery-100';
    }
  }
}