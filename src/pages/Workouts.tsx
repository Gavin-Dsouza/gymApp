import React from 'react';
import WorkoutLogger from '../components/WorkoutLogger';

const Workouts: React.FC = () => {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-display font-bold text-recovery-900 mb-2">
            Workout Tracker
          </h1>
          <p className="text-recovery-600 text-lg">Log your exercises and track your progress</p>
        </header>

        <WorkoutLogger />
      </div>
    </div>
  );
};

export default Workouts;