import React, { useState } from 'react';
import type { WorkoutSession, Exercise } from '../types';
import { gymDB } from '../services/database';

interface WorkoutHistoryProps {
  workouts: WorkoutSession[];
  onRefresh: () => void;
}

const WorkoutHistory: React.FC<WorkoutHistoryProps> = ({ workouts, onRefresh }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);

  // Load exercises when component mounts
  React.useEffect(() => {
    const loadExercises = async () => {
      try {
        const exerciseList = await gymDB.getExercises();
        setExercises(exerciseList);
      } catch (error) {
        console.error('Failed to load exercises:', error);
      }
    };
    loadExercises();
  }, []);

  const getExerciseName = (exerciseId: string): string => {
    const exercise = exercises.find(e => e.id === exerciseId);
    return exercise?.name || 'Unknown Exercise';
  };

  const formatDuration = (start: Date, end?: Date): string => {
    if (!end) return 'In progress';
    const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
    return `${duration} minutes`;
  };

  const calculateWorkoutVolume = (workout: WorkoutSession): number => {
    return workout.sets.reduce((total, set) => 
      total + (set.weight || 0) * set.reps, 0
    );
  };

  const toggleWorkoutExpansion = (workoutId: string) => {
    setExpandedWorkout(expandedWorkout === workoutId ? null : workoutId);
  };

  if (workouts.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-recovery-700 mb-2">No Workout History</h3>
        <p className="text-recovery-500 mb-6">
          Your completed workouts will appear here once you finish your first session.
        </p>
        <button
          onClick={onRefresh}
          className="btn-primary"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {workouts.map((workout) => {
        const isExpanded = expandedWorkout === workout.id;
        const workoutVolume = calculateWorkoutVolume(workout);
        const uniqueExercises = new Set(workout.sets.map(s => s.exerciseId)).size;

        return (
          <div key={workout.id} className="card">
            <div
              className="cursor-pointer"
              onClick={() => toggleWorkoutExpansion(workout.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    workout.endTime ? 'bg-strength-500' : 'bg-cardio-500'
                  }`} />
                  <h3 className="text-lg font-semibold text-recovery-900">
                    {workout.name}
                  </h3>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-recovery-600">
                    {workout.date.toLocaleDateString()}
                  </div>
                  <svg 
                    className={`w-5 h-5 text-recovery-400 transition-transform ${
                      isExpanded ? 'transform rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-recovery-600">Duration: </span>
                  <span className="font-medium text-recovery-900">
                    {formatDuration(workout.startTime, workout.endTime)}
                  </span>
                </div>
                
                <div>
                  <span className="text-recovery-600">Sets: </span>
                  <span className="font-medium text-recovery-900">
                    {workout.sets.length}
                  </span>
                </div>
                
                <div>
                  <span className="text-recovery-600">Exercises: </span>
                  <span className="font-medium text-recovery-900">
                    {uniqueExercises}
                  </span>
                </div>
                
                <div>
                  <span className="text-recovery-600">Volume: </span>
                  <span className="font-medium text-recovery-900">
                    {workoutVolume.toLocaleString()} kg
                  </span>
                </div>
              </div>
            </div>

            {isExpanded && (
              <div className="mt-6 pt-6 border-t border-recovery-200">
                <h4 className="font-semibold text-recovery-800 mb-4">Workout Details</h4>
                
                {/* Group sets by exercise */}
                {Object.entries(
                  workout.sets.reduce((acc, set) => {
                    if (!acc[set.exerciseId]) acc[set.exerciseId] = [];
                    acc[set.exerciseId].push(set);
                    return acc;
                  }, {} as Record<string, typeof workout.sets>)
                ).map(([exerciseId, sets]) => (
                  <div key={exerciseId} className="mb-6">
                    <h5 className="font-medium text-recovery-900 mb-2">
                      {getExerciseName(exerciseId)}
                    </h5>
                    
                    <div className="bg-recovery-50 rounded-lg p-4">
                      <div className="grid gap-2">
                        {sets.map((set, index) => (
                          <div key={set.id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-4">
                              <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-medium">
                                {index + 1}
                              </span>
                              
                              {set.weight ? (
                                <span className="font-medium">
                                  {set.weight} kg × {set.reps}
                                </span>
                              ) : (
                                <span className="font-medium">
                                  {set.duration ? `${Math.round(set.duration / 60)} minutes` : `${set.reps} reps`}
                                </span>
                              )}
                              
                              <span className="text-recovery-600">
                                RPE {set.rpe}
                              </span>
                            </div>
                            
                            {set.restTime && (
                              <span className="text-recovery-500">
                                Rest: {Math.round(set.restTime / 60)}:{(set.restTime % 60).toString().padStart(2, '0')}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Exercise summary */}
                      <div className="mt-3 pt-3 border-t border-recovery-200 grid grid-cols-3 gap-4 text-xs text-center">
                        <div>
                          <div className="font-medium text-recovery-800">
                            {sets.reduce((sum, set) => sum + (set.weight || 0) * set.reps, 0)} kg
                          </div>
                          <div className="text-recovery-600">Volume</div>
                        </div>
                        <div>
                          <div className="font-medium text-recovery-800">
                            {Math.max(...sets.map(set => set.weight || 0))} kg
                          </div>
                          <div className="text-recovery-600">Max Weight</div>
                        </div>
                        <div>
                          <div className="font-medium text-recovery-800">
                            {sets.length}
                          </div>
                          <div className="text-recovery-600">Sets</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Workout notes */}
                {workout.notes && (
                  <div className="mt-4 p-3 bg-primary-50 rounded-lg">
                    <div className="text-sm text-primary-800">
                      <strong>Notes:</strong> {workout.notes}
                    </div>
                  </div>
                )}

                {/* Mood and energy */}
                {(workout.mood || workout.energy) && (
                  <div className="mt-4 flex items-center space-x-6 text-sm">
                    {workout.mood && (
                      <div className="flex items-center space-x-2">
                        <span className="text-recovery-600">Mood:</span>
                        <span className="capitalize font-medium text-recovery-900">
                          {workout.mood}
                        </span>
                      </div>
                    )}
                    
                    {workout.energy && (
                      <div className="flex items-center space-x-2">
                        <span className="text-recovery-600">Energy:</span>
                        <span className="capitalize font-medium text-recovery-900">
                          {workout.energy}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Load More Button */}
      {workouts.length >= 10 && (
        <div className="text-center">
          <button
            onClick={onRefresh}
            className="btn-secondary"
          >
            Load More Workouts
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkoutHistory;