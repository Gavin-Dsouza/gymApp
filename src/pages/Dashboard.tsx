import React from 'react';
import WeightTracker from '../components/WeightTracker';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-display font-bold text-recovery-900 mb-2">
            Fitness Dashboard
          </h1>
          <p className="text-recovery-600 text-lg">Track your progress and achieve your goals</p>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card strength-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-strength-800">Current Weight</h3>
              <span className="text-2xl">⚖️</span>
            </div>
            <p className="text-2xl font-bold text-strength-700">-- kg</p>
            <p className="text-sm text-strength-600">No data yet</p>
          </div>

          <div className="card muscle-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-muscle-800">Workout Streak</h3>
              <span className="text-2xl">🔥</span>
            </div>
            <p className="text-2xl font-bold text-muscle-700">0 days</p>
            <p className="text-sm text-muscle-600">Start your journey</p>
          </div>

          <div className="card cardio-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-cardio-800">This Week</h3>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-2xl font-bold text-cardio-700">0 workouts</p>
            <p className="text-sm text-cardio-600">Time to get moving</p>
          </div>

          <div className="card bg-primary-50 border border-primary-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-primary-800">Personal Records</h3>
              <span className="text-2xl">🏆</span>
            </div>
            <p className="text-2xl font-bold text-primary-700">0 PRs</p>
            <p className="text-sm text-primary-600">Set your first PR</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <button className="card hover:shadow-xl transition-shadow duration-200 text-left group">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">💪</span>
              <h3 className="font-semibold text-xl text-recovery-900">Start Workout</h3>
            </div>
            <p className="text-recovery-600">Begin tracking your exercises and sets</p>
          </button>

          <button className="card hover:shadow-xl transition-shadow duration-200 text-left group">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">⚖️</span>
              <h3 className="font-semibold text-xl text-recovery-900">Log Weight</h3>
            </div>
            <p className="text-recovery-600">Record your current body weight</p>
          </button>

          <button className="card hover:shadow-xl transition-shadow duration-200 text-left group">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">🍎</span>
              <h3 className="font-semibold text-xl text-recovery-900">Track Nutrition</h3>
            </div>
            <p className="text-recovery-600">Log your meals and calories</p>
          </button>
        </div>

        {/* Weight Tracking and Body Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <WeightTracker />

          <div className="card">
            <h3 className="font-display font-semibold text-xl mb-4 text-recovery-900">
              Muscle Group Progress
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-recovery-50 rounded-lg text-center">
                <div className="text-2xl mb-2">💪</div>
                <p className="font-medium text-recovery-800">Arms</p>
                <p className="text-sm text-recovery-600">Not trained</p>
              </div>
              <div className="p-4 bg-recovery-50 rounded-lg text-center">
                <div className="text-2xl mb-2">🦵</div>
                <p className="font-medium text-recovery-800">Legs</p>
                <p className="text-sm text-recovery-600">Not trained</p>
              </div>
              <div className="p-4 bg-recovery-50 rounded-lg text-center">
                <div className="text-2xl mb-2">🫁</div>
                <p className="font-medium text-recovery-800">Chest</p>
                <p className="text-sm text-recovery-600">Not trained</p>
              </div>
              <div className="p-4 bg-recovery-50 rounded-lg text-center">
                <div className="text-2xl mb-2">🔙</div>
                <p className="font-medium text-recovery-800">Back</p>
                <p className="text-sm text-recovery-600">Not trained</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;