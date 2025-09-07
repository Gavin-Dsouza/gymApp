import React, { useState, useEffect } from 'react';
import type { Exercise, WorkoutSet } from '../types';
import { WorkoutService } from '../services/workoutService';

interface SetTrackerProps {
  exercise: Exercise;
  previousSets: WorkoutSet[];
  onSetAdded: (set: Omit<WorkoutSet, 'id' | 'exerciseId'>) => void;
  sessionId: string;
}

const SetTracker: React.FC<SetTrackerProps> = ({
  exercise,
  previousSets,
  onSetAdded,
  sessionId,
}) => {
  const [weight, setWeight] = useState<number>(0);
  const [reps, setReps] = useState<number>(0);
  const [rpe, setRpe] = useState<number>(5);
  const [duration, setDuration] = useState<number>(0);
  const [restTimer, setRestTimer] = useState<number>(0);
  const [isResting, setIsResting] = useState(false);
  const [restStartTime, setRestStartTime] = useState<Date | null>(null);

  // Auto-fill from previous set
  useEffect(() => {
    if (previousSets.length > 0) {
      const lastSet = previousSets[previousSets.length - 1];
      setWeight(lastSet.weight || 0);
      setReps(lastSet.reps || 0);
      setRpe(lastSet.rpe || 5);
    }
  }, [previousSets]);

  // Rest timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isResting && restStartTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((new Date().getTime() - restStartTime.getTime()) / 1000);
        setRestTimer(elapsed);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isResting, restStartTime]);

  const handleAddSet = async () => {
    if (exercise.category === 'cardio' && duration === 0) return;
    if (exercise.category !== 'cardio' && (weight === 0 || reps === 0)) return;

    const setData: Omit<WorkoutSet, 'id' | 'exerciseId'> = {
      weight: exercise.category === 'cardio' ? undefined : weight,
      reps: exercise.category === 'cardio' ? 1 : reps,
      duration: exercise.category === 'cardio' ? duration * 60 : undefined, // Convert to seconds
      rpe,
      restTime: isResting ? restTimer : undefined,
    };

    onSetAdded(setData);
    
    // Start rest timer
    setIsResting(true);
    setRestStartTime(new Date());
    setRestTimer(0);
    
    // Suggest next set (progressive overload)
    if (exercise.category !== 'cardio') {
      if (reps >= 12) {
        setWeight(prev => prev + 2.5); // Increase weight
        setReps(Math.max(6, reps - 3)); // Reduce reps
      } else {
        setReps(prev => prev + 1); // Add one rep
      }
    }
  };

  const stopRest = () => {
    setIsResting(false);
    setRestStartTime(null);
    setRestTimer(0);
  };

  const deleteSet = async (setId: string) => {
    try {
      await WorkoutService.deleteSet(sessionId, setId);
      // The parent component will refresh the data
      window.location.reload(); // Simple refresh for now
    } catch (error) {
      console.error('Failed to delete set:', error);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isCardio = exercise.category === 'cardio';

  return (
    <div className="card space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-recovery-900">Track Sets</h3>
        {isResting && (
          <div className="flex items-center space-x-2 bg-cardio-100 px-3 py-2 rounded-lg">
            <span className="text-cardio-700 font-medium">Rest: {formatTime(restTimer)}</span>
            <button
              onClick={stopRest}
              className="text-xs bg-cardio-600 text-white px-2 py-1 rounded hover:bg-cardio-700"
            >
              Stop
            </button>
          </div>
        )}
      </div>

      {/* Add New Set */}
      <div className="bg-recovery-50 rounded-lg p-4">
        <h4 className="font-medium text-recovery-800 mb-3">Add Set</h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {!isCardio && (
            <div>
              <label className="block text-sm font-medium text-recovery-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={weight || ''}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-recovery-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="0"
              />
            </div>
          )}
          
          {!isCardio && (
            <div>
              <label className="block text-sm font-medium text-recovery-700 mb-1">Reps</label>
              <input
                type="number"
                min="0"
                value={reps || ''}
                onChange={(e) => setReps(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-recovery-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="0"
              />
            </div>
          )}

          {isCardio && (
            <div className="col-span-2">
              <label className="block text-sm font-medium text-recovery-700 mb-1">Duration (minutes)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={duration || ''}
                onChange={(e) => setDuration(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-recovery-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="0"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-recovery-700 mb-1">RPE (1-10)</label>
            <select
              value={rpe}
              onChange={(e) => setRpe(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-recovery-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {[1,2,3,4,5,6,7,8,9,10].map(num => (
                <option key={num} value={num}>{num} - {
                  num <= 3 ? 'Very Easy' :
                  num <= 5 ? 'Easy' :
                  num <= 7 ? 'Moderate' :
                  num <= 8 ? 'Hard' : 'Max Effort'
                }</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={handleAddSet}
              disabled={isCardio ? duration === 0 : (weight === 0 || reps === 0)}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Set
            </button>
          </div>
        </div>

        {/* Quick suggestions */}
        {previousSets.length > 0 && (
          <div className="text-sm text-recovery-600">
            💡 Last set: {previousSets[previousSets.length - 1].weight}kg × {previousSets[previousSets.length - 1].reps} 
            (RPE {previousSets[previousSets.length - 1].rpe})
          </div>
        )}
      </div>

      {/* Previous Sets */}
      {previousSets.length > 0 && (
        <div>
          <h4 className="font-medium text-recovery-800 mb-3">
            Today's Sets ({previousSets.length})
          </h4>
          
          <div className="space-y-2">
            {previousSets.map((set, index) => (
              <div key={set.id} className="flex items-center justify-between bg-white rounded-lg p-3 border border-recovery-200">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm">
                    {set.weight && (
                      <span className="font-medium text-recovery-900">
                        {set.weight} kg
                      </span>
                    )}
                    
                    {set.duration ? (
                      <span className="text-recovery-700">
                        {Math.round(set.duration / 60)} min
                      </span>
                    ) : (
                      <span className="text-recovery-700">
                        {set.reps} reps
                      </span>
                    )}
                    
                    <span className="text-recovery-600">
                      RPE {set.rpe}
                    </span>
                    
                    {set.restTime && (
                      <span className="text-recovery-500">
                        Rest {formatTime(set.restTime)}
                      </span>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => deleteSet(set.id)}
                  className="text-recovery-400 hover:text-muscle-600 p-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Set Statistics */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center bg-recovery-50 rounded-lg p-4">
            <div>
              <div className="text-lg font-bold text-strength-600">
                {previousSets.reduce((sum, set) => sum + (set.weight || 0) * set.reps, 0)} kg
              </div>
              <div className="text-xs text-recovery-600">Volume</div>
            </div>
            <div>
              <div className="text-lg font-bold text-cardio-600">
                {Math.max(...previousSets.map(set => set.weight || 0))} kg
              </div>
              <div className="text-xs text-recovery-600">Max Weight</div>
            </div>
            <div>
              <div className="text-lg font-bold text-muscle-600">
                {previousSets.reduce((sum, set) => sum + set.reps, 0)}
              </div>
              <div className="text-xs text-recovery-600">Total Reps</div>
            </div>
            <div>
              <div className="text-lg font-bold text-primary-600">
                {(previousSets.reduce((sum, set) => sum + (set.rpe || 0), 0) / previousSets.length).toFixed(1)}
              </div>
              <div className="text-xs text-recovery-600">Avg RPE</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetTracker;