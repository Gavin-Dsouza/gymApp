import React from 'react';
import type { NutritionEntry, NutritionGoal } from '../types';

interface NutritionOverviewProps {
  entry: NutritionEntry | null;
  goal: NutritionGoal;
  date: Date;
}

const NutritionOverview: React.FC<NutritionOverviewProps> = ({ entry, goal }) => {
  const getProgressPercentage = (current: number, target: number): number => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 90) return 'bg-strength-500';
    if (percentage >= 70) return 'bg-primary-500';
    if (percentage >= 50) return 'bg-cardio-500';
    return 'bg-dark-400';
  };

  const current = {
    calories: entry?.totalCalories || 0,
    protein: entry?.totalProtein || 0,
    carbs: entry?.totalCarbs || 0,
    fat: entry?.totalFat || 0,
  };

  // const isToday = date.toDateString() === new Date().toDateString();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Calories */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🔥</span>
            <h3 className="font-semibold text-dark-900">Calories</h3>
          </div>
          <div className="text-xs text-dark-600">
            {Math.round(getProgressPercentage(current.calories, goal.dailyCalories))}%
          </div>
        </div>
        
        <div className="mb-3">
          <div className="text-2xl font-bold text-primary-600">
            {current.calories}
          </div>
          <div className="text-sm text-dark-600">
            of {goal.dailyCalories} cal
          </div>
        </div>

        <div className="w-full bg-dark-200 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
              getProgressPercentage(current.calories, goal.dailyCalories)
            )}`}
            style={{ width: `${getProgressPercentage(current.calories, goal.dailyCalories)}%` }}
          />
        </div>

        <div className="mt-2 text-xs text-dark-600">
          {goal.dailyCalories - current.calories > 0 ? (
            <span>{goal.dailyCalories - current.calories} cal remaining</span>
          ) : (
            <span className="text-cardio-600">+{current.calories - goal.dailyCalories} cal over</span>
          )}
        </div>
      </div>

      {/* Protein */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🥩</span>
            <h3 className="font-semibold text-dark-900">Protein</h3>
          </div>
          <div className="text-xs text-dark-600">
            {Math.round(getProgressPercentage(current.protein, goal.proteinGoal))}%
          </div>
        </div>
        
        <div className="mb-3">
          <div className="text-2xl font-bold text-strength-600">
            {current.protein}g
          </div>
          <div className="text-sm text-dark-600">
            of {goal.proteinGoal}g
          </div>
        </div>

        <div className="w-full bg-dark-200 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full bg-strength-500 rounded-full transition-all duration-500`}
            style={{ width: `${getProgressPercentage(current.protein, goal.proteinGoal)}%` }}
          />
        </div>

        <div className="mt-2 text-xs text-dark-600">
          {goal.proteinGoal - current.protein > 0 ? (
            <span>{Math.round((goal.proteinGoal - current.protein) * 10) / 10}g remaining</span>
          ) : (
            <span className="text-strength-600">Target reached!</span>
          )}
        </div>
      </div>

      {/* Carbs */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🍞</span>
            <h3 className="font-semibold text-dark-900">Carbs</h3>
          </div>
          <div className="text-xs text-dark-600">
            {Math.round(getProgressPercentage(current.carbs, goal.carbGoal))}%
          </div>
        </div>
        
        <div className="mb-3">
          <div className="text-2xl font-bold text-cardio-600">
            {current.carbs}g
          </div>
          <div className="text-sm text-dark-600">
            of {goal.carbGoal}g
          </div>
        </div>

        <div className="w-full bg-dark-200 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full bg-cardio-500 rounded-full transition-all duration-500`}
            style={{ width: `${getProgressPercentage(current.carbs, goal.carbGoal)}%` }}
          />
        </div>

        <div className="mt-2 text-xs text-dark-600">
          {goal.carbGoal - current.carbs > 0 ? (
            <span>{Math.round((goal.carbGoal - current.carbs) * 10) / 10}g remaining</span>
          ) : (
            <span className="text-cardio-600">Target reached!</span>
          )}
        </div>
      </div>

      {/* Fat */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🥑</span>
            <h3 className="font-semibold text-dark-900">Fat</h3>
          </div>
          <div className="text-xs text-dark-600">
            {Math.round(getProgressPercentage(current.fat, goal.fatGoal))}%
          </div>
        </div>
        
        <div className="mb-3">
          <div className="text-2xl font-bold text-accent-600">
            {current.fat}g
          </div>
          <div className="text-sm text-dark-600">
            of {goal.fatGoal}g
          </div>
        </div>

        <div className="w-full bg-dark-200 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full bg-accent-500 rounded-full transition-all duration-500`}
            style={{ width: `${getProgressPercentage(current.fat, goal.fatGoal)}%` }}
          />
        </div>

        <div className="mt-2 text-xs text-dark-600">
          {goal.fatGoal - current.fat > 0 ? (
            <span>{Math.round((goal.fatGoal - current.fat) * 10) / 10}g remaining</span>
          ) : (
            <span className="text-accent-600">Target reached!</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default NutritionOverview;