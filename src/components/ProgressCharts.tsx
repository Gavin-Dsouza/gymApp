import React, { useMemo } from 'react';
import type { WorkoutSession, BodyWeight } from '../types';

interface ProgressChartsProps {
  workouts: WorkoutSession[];
  bodyWeights: BodyWeight[];
  muscleVolume: Record<string, number>;
}

const ProgressCharts: React.FC<ProgressChartsProps> = ({
  workouts,
  bodyWeights,
  muscleVolume,
}) => {
  const workoutTrendData = useMemo(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();

    return last30Days.map(date => {
      const dateStr = date.toDateString();
      const dayWorkouts = workouts.filter(w => 
        w.date.toDateString() === dateStr && w.endTime
      );
      
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        workouts: dayWorkouts.length,
        volume: dayWorkouts.reduce((sum, w) => 
          sum + w.sets.reduce((setSum, s) => setSum + (s.weight || 0) * s.reps, 0), 0
        ),
      };
    });
  }, [workouts]);

  const bodyWeightTrendData = useMemo(() => {
    return bodyWeights
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30)
      .map(bw => ({
        date: new Date(bw.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weight: bw.weight,
      }));
  }, [bodyWeights]);

  const muscleVolumeData = useMemo(() => {
    return Object.entries(muscleVolume)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([muscle, volume]) => ({
        muscle: muscle.charAt(0).toUpperCase() + muscle.slice(1),
        volume: Math.round(volume),
        percentage: volume / Math.max(...Object.values(muscleVolume)) * 100,
      }));
  }, [muscleVolume]);

  const weeklyStatsData = useMemo(() => {
    const weeks = Array.from({ length: 12 }, (_, i) => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      return {
        week: `Week ${12 - i}`,
        weekStart,
        weekEnd,
      };
    });

    return weeks.map(({ week, weekStart, weekEnd }) => {
      const weekWorkouts = workouts.filter(w => 
        w.date >= weekStart && w.date <= weekEnd && w.endTime
      );
      
      const totalVolume = weekWorkouts.reduce((sum, w) => 
        sum + w.sets.reduce((setSum, s) => setSum + (s.weight || 0) * s.reps, 0), 0
      );
      
      const avgDuration = weekWorkouts.length > 0 ? 
        weekWorkouts.reduce((sum, w) => {
          if (w.endTime && w.startTime) {
            return sum + (w.endTime.getTime() - w.startTime.getTime());
          }
          return sum;
        }, 0) / weekWorkouts.length / (1000 * 60) : 0;

      return {
        week,
        workouts: weekWorkouts.length,
        volume: Math.round(totalVolume),
        avgDuration: Math.round(avgDuration),
      };
    });
  }, [workouts]);

  return (
    <div className="space-y-8">
      {/* Workout Frequency Chart */}
      <div className="card">
        <h3 className="font-semibold text-recovery-900 mb-4">Workout Frequency (Last 30 Days)</h3>
        <div className="space-y-2">
          {workoutTrendData.filter(day => day.workouts > 0).slice(-10).map((day, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-recovery-600 w-16">{day.date}</span>
              <div className="flex-1 mx-4">
                <div className="bg-recovery-200 rounded-full h-4 relative overflow-hidden">
                  <div 
                    className="bg-primary-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(day.workouts * 50, 100)}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-recovery-700">
                    {day.workouts > 0 ? `${day.workouts} workout${day.workouts > 1 ? 's' : ''}` : ''}
                  </div>
                </div>
              </div>
              <span className="text-sm font-medium text-recovery-800 w-20 text-right">
                {day.volume.toLocaleString()} kg
              </span>
            </div>
          ))}
        </div>
        
        {workoutTrendData.filter(day => day.workouts > 0).length === 0 && (
          <div className="text-center py-8 text-recovery-500">
            No workout data for the last 30 days
          </div>
        )}
      </div>

      {/* Body Weight Trend */}
      {bodyWeightTrendData.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-recovery-900 mb-4">Body Weight Trend</h3>
          <div className="space-y-2">
            {bodyWeightTrendData.slice(-10).map((point, index) => {
              const prevWeight = index > 0 ? bodyWeightTrendData[bodyWeightTrendData.length - 10 + index - 1]?.weight : point.weight;
              const change = point.weight - prevWeight;
              const changePercent = prevWeight > 0 ? (change / prevWeight) * 100 : 0;
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-recovery-600 w-16">{point.date}</span>
                  <div className="flex-1 mx-4">
                    <div className="bg-recovery-200 rounded-full h-4 relative overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          change > 0 ? 'bg-muscle-400' : change < 0 ? 'bg-strength-400' : 'bg-primary-400'
                        }`}
                        style={{ 
                          width: `${Math.min(Math.abs(changePercent) * 20 + 20, 100)}%`,
                          marginLeft: change < 0 ? 'auto' : '0'
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-recovery-700">
                        {point.weight} kg
                      </div>
                    </div>
                  </div>
                  <span className={`text-sm font-medium w-20 text-right ${
                    change > 0 ? 'text-muscle-600' : change < 0 ? 'text-strength-600' : 'text-recovery-600'
                  }`}>
                    {change !== 0 && (change > 0 ? '+' : '')}{change.toFixed(1)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Muscle Group Volume */}
      {muscleVolumeData.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-recovery-900 mb-4">Muscle Group Volume (Last 30 Days)</h3>
          <div className="space-y-3">
            {muscleVolumeData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-recovery-800 w-24">{data.muscle}</span>
                <div className="flex-1 mx-4">
                  <div className="bg-recovery-200 rounded-full h-6 relative overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-strength-400 to-strength-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${data.percentage}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-recovery-700">
                      {data.volume.toLocaleString()} kg
                    </div>
                  </div>
                </div>
                <span className="text-sm text-recovery-600 w-12 text-right">
                  {data.percentage.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Summary */}
      <div className="card">
        <h3 className="font-semibold text-recovery-900 mb-4">Weekly Summary (Last 12 Weeks)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-recovery-200">
                <th className="text-left py-2 text-recovery-700">Week</th>
                <th className="text-center py-2 text-recovery-700">Workouts</th>
                <th className="text-center py-2 text-recovery-700">Total Volume</th>
                <th className="text-center py-2 text-recovery-700">Avg Duration</th>
              </tr>
            </thead>
            <tbody>
              {weeklyStatsData.filter(week => week.workouts > 0).slice(-8).map((week, index) => (
                <tr key={index} className="border-b border-recovery-100">
                  <td className="py-3 font-medium text-recovery-800">{week.week}</td>
                  <td className="py-3 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                      {week.workouts}
                    </span>
                  </td>
                  <td className="py-3 text-center font-medium text-recovery-800">
                    {week.volume.toLocaleString()} kg
                  </td>
                  <td className="py-3 text-center text-recovery-700">
                    {week.avgDuration} min
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {weeklyStatsData.filter(week => week.workouts > 0).length === 0 && (
          <div className="text-center py-8 text-recovery-500">
            No weekly data available yet
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-2xl font-bold text-primary-600 mb-1">
            {workouts.filter(w => w.endTime).length}
          </div>
          <div className="text-sm text-recovery-600">Total Completed Workouts</div>
        </div>

        <div className="card text-center">
          <div className="text-3xl mb-2">⚖️</div>
          <div className="text-2xl font-bold text-strength-600 mb-1">
            {workouts.reduce((sum, w) => 
              sum + w.sets.reduce((setSum, s) => setSum + (s.weight || 0) * s.reps, 0), 0
            ).toLocaleString()} kg
          </div>
          <div className="text-sm text-recovery-600">Total Volume Lifted</div>
        </div>

        <div className="card text-center">
          <div className="text-3xl mb-2">⏱️</div>
          <div className="text-2xl font-bold text-cardio-600 mb-1">
            {Math.round(
              workouts.filter(w => w.endTime).reduce((sum, w) => {
                if (w.endTime && w.startTime) {
                  return sum + (w.endTime.getTime() - w.startTime.getTime());
                }
                return sum;
              }, 0) / (1000 * 60)
            )} min
          </div>
          <div className="text-sm text-recovery-600">Total Time Exercising</div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCharts;