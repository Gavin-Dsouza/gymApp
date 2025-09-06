import React, { useState, useEffect } from 'react';
import type { BodyWeight } from '../types';
import { gymDB } from '../services/database';

const WeightTracker: React.FC = () => {
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [isLogging, setIsLogging] = useState(false);
  const [recentWeights, setRecentWeights] = useState<BodyWeight[]>([]);
  const [showForm, setShowForm] = useState(false);

  const userId = 'demo-user'; // In a real app, this would come from authentication

  useEffect(() => {
    loadRecentWeights();
  }, []);

  const loadRecentWeights = async () => {
    try {
      const weights = await gymDB.getBodyWeights(userId, 7);
      setRecentWeights(weights);
    } catch (error) {
      console.error('Failed to load weights:', error);
    }
  };

  const handleWeightSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentWeight <= 0) return;

    setIsLogging(true);
    try {
      const weightEntry: BodyWeight = {
        id: crypto.randomUUID(),
        userId,
        weight: currentWeight,
        date: new Date(),
      };

      await gymDB.addBodyWeight(weightEntry);
      await loadRecentWeights();
      setCurrentWeight(0);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to save weight:', error);
    } finally {
      setIsLogging(false);
    }
  };

  const latestWeight = recentWeights[0];
  const weightTrend = recentWeights.length > 1 
    ? recentWeights[0].weight - recentWeights[1].weight 
    : 0;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-xl text-recovery-900">
          Body Weight
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary text-sm px-4 py-2"
        >
          {showForm ? 'Cancel' : 'Log Weight'}
        </button>
      </div>

      {/* Current Weight Display */}
      <div className="mb-6">
        {latestWeight ? (
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-strength-600">
                {latestWeight.weight} kg
              </span>
              {weightTrend !== 0 && (
                <span className={`text-sm flex items-center ${
                  weightTrend > 0 ? 'text-muscle-600' : 'text-cardio-600'
                }`}>
                  {weightTrend > 0 ? '↗️' : '↙️'} 
                  {Math.abs(weightTrend).toFixed(1)} kg
                </span>
              )}
            </div>
            <p className="text-sm text-recovery-600 mt-1">
              Last logged: {latestWeight.date.toLocaleDateString()}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-2xl font-bold text-recovery-400">-- kg</p>
            <p className="text-sm text-recovery-600">No weight data yet</p>
          </div>
        )}
      </div>

      {/* Weight Logging Form */}
      {showForm && (
        <form onSubmit={handleWeightSubmit} className="mb-6">
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <label htmlFor="weight" className="block text-sm font-medium text-recovery-700 mb-1">
                Current Weight (kg)
              </label>
              <input
                type="number"
                id="weight"
                step="0.1"
                min="0"
                value={currentWeight || ''}
                onChange={(e) => setCurrentWeight(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-recovery-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="75.5"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLogging || currentWeight <= 0}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLogging ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      )}

      {/* Recent Weight History */}
      {recentWeights.length > 0 && (
        <div>
          <h4 className="font-semibold text-recovery-800 mb-3">Recent Entries</h4>
          <div className="space-y-2">
            {recentWeights.slice(0, 5).map((weight, index) => (
              <div key={weight.id} className="flex justify-between items-center text-sm">
                <span className="text-recovery-600">
                  {weight.date.toLocaleDateString()}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-recovery-800">
                    {weight.weight} kg
                  </span>
                  {index === 0 && (
                    <span className="px-2 py-1 bg-strength-100 text-strength-700 rounded-full text-xs">
                      Latest
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mini Chart Placeholder */}
      {recentWeights.length > 1 && (
        <div className="mt-6 pt-6 border-t border-recovery-200">
          <div className="h-20 bg-recovery-50 rounded-lg flex items-center justify-center">
            <p className="text-recovery-500 text-sm">Weight trend chart coming soon</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeightTracker;