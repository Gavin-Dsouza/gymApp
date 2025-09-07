import React, { useState, useEffect } from 'react';
import { WorkoutService } from '../services/workoutService';
import WeightTracker from '../components/WeightTracker';
import BodyMap from '../components/BodyMap';

const Dashboard: React.FC = () => {
  const [workoutStats, setWorkoutStats] = useState<any>(null);
  const [activeWorkout, setActiveWorkout] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [stats, workout] = await Promise.all([
        WorkoutService.getWorkoutStats(),
        WorkoutService.getActiveWorkout(),
      ]);
      setWorkoutStats(stats);
      setActiveWorkout(workout);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-display font-bold text-dark-900 mb-2">
            Fitness Dashboard
          </h1>
          <p className="text-dark-600 text-lg">Track your progress and achieve your goals</p>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card strength-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-strength-800">Total Workouts</h3>
              <span className="text-2xl">💪</span>
            </div>
            <p className="text-2xl font-bold text-strength-700">
              {workoutStats?.totalWorkouts || 0}
            </p>
            <p className="text-sm text-strength-600">Completed sessions</p>
          </div>

          <div className="card muscle-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-muscle-800">Workout Streak</h3>
              <span className="text-2xl">🔥</span>
            </div>
            <p className="text-2xl font-bold text-muscle-700">
              {workoutStats?.currentStreak || 0} days
            </p>
            <p className="text-sm text-muscle-600">
              {workoutStats?.currentStreak > 0 ? 'Keep it up!' : 'Start your journey'}
            </p>
          </div>

          <div className="card cardio-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-cardio-800">Total Volume</h3>
              <span className="text-2xl">⚖️</span>
            </div>
            <p className="text-2xl font-bold text-cardio-700">
              {workoutStats?.totalWeight?.toLocaleString() || 0} kg
            </p>
            <p className="text-sm text-cardio-600">Weight moved all time</p>
          </div>

          <div className="card bg-primary-50 border border-primary-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-primary-800">Total Sets</h3>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-2xl font-bold text-primary-700">
              {workoutStats?.totalSets || 0}
            </p>
            <p className="text-sm text-primary-600">Sets completed</p>
          </div>
        </div>

        {/* Active Workout Alert */}
        {activeWorkout && (
          <div className="card bg-cardio-50 border border-cardio-200 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-cardio-800 mb-1">Active Workout in Progress</h3>
                <p className="text-sm text-cardio-600">
                  {activeWorkout.name} • {activeWorkout.sets.length} sets completed • 
                  {Math.round((new Date().getTime() - new Date(activeWorkout.startTime).getTime()) / (1000 * 60))} minutes
                </p>
              </div>
              <a href="/workouts" className="btn-primary bg-cardio-600 hover:bg-cardio-700">
                Continue Workout
              </a>
            </div>
          </div>
        )}

        {/* Interactive Body Map */}
        <div className="mb-8">
          <BodyMap />
        </div>

        {/* Weight Tracking and Nutrition */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <WeightTracker />
          
          {/* Quick Nutrition Overview */}
          <div className="card">
            <h3 className="font-display font-semibold text-xl mb-4 text-dark-900">
              Today's Nutrition
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-dark-700">Calories</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-dark-200 rounded-full overflow-hidden">
                    <div className="w-0 h-full bg-primary-500 rounded-full transition-all duration-300"></div>
                  </div>
                  <span className="text-sm text-dark-600">0 / 2000</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-dark-700">Protein</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-dark-200 rounded-full overflow-hidden">
                    <div className="w-0 h-full bg-strength-500 rounded-full transition-all duration-300"></div>
                  </div>
                  <span className="text-sm text-dark-600">0g / 150g</span>
                </div>
              </div>
              <div className="text-center pt-4 border-t border-dark-300">
                <a href="/nutrition" className="btn-secondary text-sm">
                  Log Food
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;