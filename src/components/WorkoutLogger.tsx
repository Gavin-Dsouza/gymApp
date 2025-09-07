import React, { useState, useEffect } from 'react';
import type { WorkoutSession, WorkoutSet, Exercise } from '../types';
import { WorkoutService } from '../services/workoutService';
import { gymDB } from '../services/database';
import ExerciseSelector from './ExerciseSelector';
import SetTracker from './SetTracker';

const WorkoutLogger: React.FC = () => {
  const [activeWorkout, setActiveWorkout] = useState<WorkoutSession | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [workout, exerciseList] = await Promise.all([
        WorkoutService.getActiveWorkout(),
        gymDB.getExercises()
      ]);
      
      setActiveWorkout(workout);
      setExercises(exerciseList);
    } catch (error) {
      console.error('Failed to load workout data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startWorkout = async () => {
    try {
      const workout = await WorkoutService.startWorkout();
      setActiveWorkout(workout);
    } catch (error) {
      console.error('Failed to start workout:', error);
    }
  };

  const finishWorkout = async () => {
    if (!activeWorkout) return;
    
    try {
      await WorkoutService.finishWorkout(activeWorkout.id);
      setActiveWorkout(null);
      setSelectedExercise(null);
    } catch (error) {
      console.error('Failed to finish workout:', error);
    }
  };

  const handleExerciseSelected = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowExerciseSelector(false);
  };

  const handleSetAdded = async (setData: Omit<WorkoutSet, 'id' | 'exerciseId'>) => {
    if (!activeWorkout || !selectedExercise) return;

    try {
      await WorkoutService.addSetToWorkout(activeWorkout.id, {
        ...setData,
        exerciseId: selectedExercise.id,
      });
      
      // Reload active workout to get updated sets
      const updatedWorkout = await WorkoutService.getActiveWorkout();
      setActiveWorkout(updatedWorkout);
    } catch (error) {
      console.error('Failed to add set:', error);
    }
  };

  const workoutDuration = activeWorkout ? 
    Math.round((new Date().getTime() - activeWorkout.startTime.getTime()) / (1000 * 60)) : 0;

  const exerciseSets = activeWorkout && selectedExercise ? 
    activeWorkout.sets.filter(set => set.exerciseId === selectedExercise.id) : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse-slow text-primary-600">Loading workout...</div>
      </div>
    );
  }

  if (!activeWorkout) {
    return (
      <div className="card text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">🏋️</div>
          <h2 className="text-2xl font-display font-bold text-recovery-900 mb-2">
            Ready to Work Out?
          </h2>
          <p className="text-recovery-600">
            Start a new workout session to track your exercises and progress
          </p>
        </div>
        
        <button
          onClick={startWorkout}
          className="btn-primary text-lg px-8 py-4"
        >
          Start Workout
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Workout Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-display font-bold text-recovery-900">
              {activeWorkout.name}
            </h2>
            <div className="flex items-center space-x-4 text-sm text-recovery-600 mt-1">
              <span>⏱️ {workoutDuration} minutes</span>
              <span>💪 {activeWorkout.sets.length} sets</span>
              <span>🏋️ {new Set(activeWorkout.sets.map(s => s.exerciseId)).size} exercises</span>
            </div>
          </div>
          
          <button
            onClick={finishWorkout}
            className="btn-primary bg-muscle-600 hover:bg-muscle-700"
          >
            Finish Workout
          </button>
        </div>

        {/* Quick Stats */}
        {activeWorkout.sets.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-recovery-200">
            <div className="text-center">
              <div className="text-lg font-bold text-strength-600">
                {activeWorkout.sets.reduce((sum, set) => sum + (set.weight || 0) * set.reps, 0)} kg
              </div>
              <div className="text-xs text-recovery-600">Total Volume</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-cardio-600">
                {Math.max(...activeWorkout.sets.map(set => set.weight || 0))} kg
              </div>
              <div className="text-xs text-recovery-600">Heaviest Set</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-muscle-600">
                {activeWorkout.sets.reduce((sum, set) => sum + set.reps, 0)}
              </div>
              <div className="text-xs text-recovery-600">Total Reps</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary-600">
                {activeWorkout.sets.reduce((sum, set) => sum + (set.restTime || 0), 0) / 60 || 0}
              </div>
              <div className="text-xs text-recovery-600">Avg Rest (min)</div>
            </div>
          </div>
        )}
      </div>

      {/* Exercise Selection */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-recovery-900">
            {selectedExercise ? selectedExercise.name : 'Select Exercise'}
          </h3>
          
          <button
            onClick={() => setShowExerciseSelector(true)}
            className="btn-secondary text-sm"
          >
            {selectedExercise ? 'Change Exercise' : 'Choose Exercise'}
          </button>
        </div>

        {selectedExercise ? (
          <div className="bg-recovery-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">
                  {selectedExercise.primaryMuscles[0] === 'chest' ? '🫁' :
                   selectedExercise.primaryMuscles[0] === 'back' ? '🔙' :
                   selectedExercise.primaryMuscles[0] === 'legs' ? '🦵' : '💪'}
                </span>
                <div>
                  <div className="font-medium text-recovery-900">{selectedExercise.name}</div>
                  <div className="text-sm text-recovery-600">
                    {selectedExercise.primaryMuscles.join(', ')}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedExercise.difficulty === 'beginner' ? 'bg-strength-100 text-strength-700' :
                  selectedExercise.difficulty === 'intermediate' ? 'bg-cardio-100 text-cardio-700' :
                  'bg-muscle-100 text-muscle-700'
                }`}>
                  {selectedExercise.difficulty}
                </span>
                {selectedExercise.isCompound && (
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                    Compound
                  </span>
                )}
              </div>
            </div>
            
            {exerciseSets.length > 0 && (
              <div className="text-sm text-recovery-600">
                Previous sets: {exerciseSets.length} • 
                Last: {exerciseSets[exerciseSets.length - 1]?.weight}kg × {exerciseSets[exerciseSets.length - 1]?.reps}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-recovery-500">
            Choose an exercise to start tracking sets
          </div>
        )}
      </div>

      {/* Set Tracking */}
      {selectedExercise && (
        <SetTracker
          exercise={selectedExercise}
          previousSets={exerciseSets}
          onSetAdded={handleSetAdded}
          sessionId={activeWorkout.id}
        />
      )}

      {/* Exercise Selector Modal */}
      {showExerciseSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-recovery-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-recovery-900">Select Exercise</h3>
                <button
                  onClick={() => setShowExerciseSelector(false)}
                  className="text-recovery-500 hover:text-recovery-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <ExerciseSelector
                exercises={exercises}
                onExerciseSelected={handleExerciseSelected}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutLogger;