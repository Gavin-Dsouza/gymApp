import React, { useState, useEffect } from 'react';
import type { WorkoutSession, PersonalRecord, BodyWeight } from '../types';
import { WorkoutService } from '../services/workoutService';
import { gymDB } from '../services/database';
import WorkoutHistory from '../components/WorkoutHistory';
import PersonalRecords from '../components/PersonalRecords';
import ProgressCharts from '../components/ProgressCharts';

const Progress: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'records' | 'charts'>('overview');
  const [workoutStats, setWorkoutStats] = useState<any>(null);
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutSession[]>([]);
  const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>([]);
  const [bodyWeights, setBodyWeights] = useState<BodyWeight[]>([]);
  const [muscleVolume, setMuscleVolume] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    setIsLoading(true);
    try {
      const [stats, workouts, prs, weights, volume] = await Promise.all([
        WorkoutService.getWorkoutStats(),
        WorkoutService.getWorkoutHistory(10),
        WorkoutService.getPersonalRecords(),
        gymDB.getBodyWeights('demo-user', 30),
        WorkoutService.getVolumeByMuscleGroup(),
      ]);

      setWorkoutStats(stats);
      setRecentWorkouts(workouts);
      setPersonalRecords(prs);
      setBodyWeights(weights);
      setMuscleVolume(volume);
    } catch (error) {
      console.error('Failed to load progress data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'history', label: 'History', icon: '📝' },
    { id: 'records', label: 'Records', icon: '🏆' },
    { id: 'charts', label: 'Charts', icon: '📈' },
  ] as const;

  if (isLoading) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse-slow text-primary-600">Loading progress data...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-display font-bold text-recovery-900 mb-2">
            Your Progress
          </h1>
          <p className="text-recovery-600 text-lg">Track your fitness journey and achievements</p>
        </header>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-recovery-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-recovery-500 hover:text-recovery-700 hover:border-recovery-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card strength-card">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-strength-800">Total Workouts</h3>
                  <span className="text-2xl">💪</span>
                </div>
                <p className="text-3xl font-bold text-strength-700">{workoutStats?.totalWorkouts || 0}</p>
                <p className="text-sm text-strength-600">All time</p>
              </div>

              <div className="card cardio-card">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-cardio-800">Current Streak</h3>
                  <span className="text-2xl">🔥</span>
                </div>
                <p className="text-3xl font-bold text-cardio-700">{workoutStats?.currentStreak || 0}</p>
                <p className="text-sm text-cardio-600">Days in a row</p>
              </div>

              <div className="card muscle-card">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-muscle-800">Total Volume</h3>
                  <span className="text-2xl">⚖️</span>
                </div>
                <p className="text-3xl font-bold text-muscle-700">
                  {workoutStats?.totalWeight?.toLocaleString() || 0} kg
                </p>
                <p className="text-sm text-muscle-600">Weight moved</p>
              </div>

              <div className="card bg-primary-50 border border-primary-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-primary-800">Personal Records</h3>
                  <span className="text-2xl">🏆</span>
                </div>
                <p className="text-3xl font-bold text-primary-700">{personalRecords.length}</p>
                <p className="text-sm text-primary-600">PRs achieved</p>
              </div>
            </div>

            {/* Quick Overview Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <div className="card">
                <h3 className="font-display font-semibold text-xl mb-4 text-recovery-900">
                  Recent Activity
                </h3>
                {recentWorkouts.length > 0 ? (
                  <div className="space-y-3">
                    {recentWorkouts.slice(0, 5).map((workout) => (
                      <div key={workout.id} className="flex items-center justify-between p-3 bg-recovery-50 rounded-lg">
                        <div>
                          <div className="font-medium text-recovery-900">{workout.name}</div>
                          <div className="text-sm text-recovery-600">
                            {workout.sets.length} sets • {new Set(workout.sets.map(s => s.exerciseId)).size} exercises
                          </div>
                        </div>
                        <div className="text-sm text-recovery-500">
                          {workout.date.toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-recovery-500">
                    No workouts yet. Start your first session!
                  </div>
                )}
              </div>

              {/* Muscle Group Volume */}
              <div className="card">
                <h3 className="font-display font-semibold text-xl mb-4 text-recovery-900">
                  Muscle Group Volume (30 days)
                </h3>
                {Object.keys(muscleVolume).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(muscleVolume)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 6)
                      .map(([muscle, volume]) => (
                        <div key={muscle} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="capitalize font-medium text-recovery-900">{muscle}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-recovery-800">
                              {Math.round(volume).toLocaleString()} kg
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-recovery-500">
                    Complete workouts to see muscle volume data
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <WorkoutHistory workouts={recentWorkouts} onRefresh={loadProgressData} />
        )}

        {activeTab === 'records' && (
          <PersonalRecords records={personalRecords} onRefresh={loadProgressData} />
        )}

        {activeTab === 'charts' && (
          <ProgressCharts 
            workouts={recentWorkouts}
            bodyWeights={bodyWeights}
            muscleVolume={muscleVolume}
          />
        )}
      </div>
    </div>
  );
};

export default Progress;