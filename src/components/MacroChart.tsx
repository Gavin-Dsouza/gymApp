import React from 'react';
import type { NutritionEntry, NutritionGoal } from '../types';

interface MacroChartProps {
  entry: NutritionEntry;
  goal: NutritionGoal | null;
}

const MacroChart: React.FC<MacroChartProps> = ({ entry, goal }) => {
  const totalMacros = entry.totalProtein + entry.totalCarbs + entry.totalFat;
  
  if (totalMacros === 0) {
    return null;
  }

  const proteinPercentage = (entry.totalProtein / totalMacros) * 100;
  const carbsPercentage = (entry.totalCarbs / totalMacros) * 100;
  const fatPercentage = (entry.totalFat / totalMacros) * 100;

  // Calculate calories from macros (4 cal/g for protein and carbs, 9 cal/g for fat)
  const proteinCalories = entry.totalProtein * 4;
  const carbCalories = entry.totalCarbs * 4;
  const fatCalories = entry.totalFat * 9;
  const totalCaloriesFromMacros = proteinCalories + carbCalories + fatCalories;

  const proteinCalPercentage = (proteinCalories / totalCaloriesFromMacros) * 100;
  const carbCalPercentage = (carbCalories / totalCaloriesFromMacros) * 100;
  const fatCalPercentage = (fatCalories / totalCaloriesFromMacros) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Macro Distribution by Weight */}
      <div className="card">
        <h3 className="font-semibold text-xl text-dark-900 mb-4">
          Macro Distribution (by weight)
        </h3>
        
        <div className="relative mb-6">
          {/* Circular Progress Ring */}
          <svg className="w-48 h-48 mx-auto" viewBox="0 0 42 42">
            <circle
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              stroke="#3f3f46"
              strokeWidth="1"
            />
            
            {/* Protein Arc */}
            <circle
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              stroke="#10b981"
              strokeWidth="3"
              strokeDasharray={`${proteinPercentage} ${100 - proteinPercentage}`}
              strokeDashoffset="25"
              transform="rotate(-90 21 21)"
              className="transition-all duration-500"
            />
            
            {/* Carbs Arc */}
            <circle
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              stroke="#f97316"
              strokeWidth="3"
              strokeDasharray={`${carbsPercentage} ${100 - carbsPercentage}`}
              strokeDashoffset={`${25 - proteinPercentage}`}
              transform="rotate(-90 21 21)"
              className="transition-all duration-500"
            />
            
            {/* Fat Arc */}
            <circle
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              stroke="#d563ff"
              strokeWidth="3"
              strokeDasharray={`${fatPercentage} ${100 - fatPercentage}`}
              strokeDashoffset={`${25 - proteinPercentage - carbsPercentage}`}
              transform="rotate(-90 21 21)"
              className="transition-all duration-500"
            />
            
            {/* Center Text */}
            <text x="21" y="21" textAnchor="middle" dy="0.3em" className="text-xs font-semibold fill-dark-900">
              {totalMacros.toFixed(0)}g
            </text>
          </svg>
          
          {/* Center Info */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-sm font-semibold text-dark-900">Total Macros</div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-strength-500 rounded-full"></div>
              <span className="text-sm text-dark-700">Protein</span>
            </div>
            <div className="text-sm font-medium text-dark-900">
              {entry.totalProtein}g ({proteinPercentage.toFixed(0)}%)
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-cardio-500 rounded-full"></div>
              <span className="text-sm text-dark-700">Carbs</span>
            </div>
            <div className="text-sm font-medium text-dark-900">
              {entry.totalCarbs}g ({carbsPercentage.toFixed(0)}%)
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent-500 rounded-full"></div>
              <span className="text-sm text-dark-700">Fat</span>
            </div>
            <div className="text-sm font-medium text-dark-900">
              {entry.totalFat}g ({fatPercentage.toFixed(0)}%)
            </div>
          </div>
        </div>
      </div>

      {/* Calorie Distribution */}
      <div className="card">
        <h3 className="font-semibold text-xl text-dark-900 mb-4">
          Calorie Distribution
        </h3>
        
        <div className="space-y-4">
          {/* Protein Calories */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-strength-500 rounded-full"></div>
                <span className="text-sm font-medium text-dark-800">Protein</span>
              </div>
              <div className="text-sm text-dark-700">
                {proteinCalories} cal ({proteinCalPercentage.toFixed(0)}%)
              </div>
            </div>
            <div className="w-full bg-dark-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-strength-500 rounded-full transition-all duration-500"
                style={{ width: `${proteinCalPercentage}%` }}
              />
            </div>
          </div>

          {/* Carbs Calories */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-cardio-500 rounded-full"></div>
                <span className="text-sm font-medium text-dark-800">Carbs</span>
              </div>
              <div className="text-sm text-dark-700">
                {carbCalories} cal ({carbCalPercentage.toFixed(0)}%)
              </div>
            </div>
            <div className="w-full bg-dark-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-cardio-500 rounded-full transition-all duration-500"
                style={{ width: `${carbCalPercentage}%` }}
              />
            </div>
          </div>

          {/* Fat Calories */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-accent-500 rounded-full"></div>
                <span className="text-sm font-medium text-dark-800">Fat</span>
              </div>
              <div className="text-sm text-dark-700">
                {fatCalories} cal ({fatCalPercentage.toFixed(0)}%)
              </div>
            </div>
            <div className="w-full bg-dark-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-accent-500 rounded-full transition-all duration-500"
                style={{ width: `${fatCalPercentage}%` }}
              />
            </div>
          </div>

          {/* Total */}
          <div className="pt-3 border-t border-dark-300">
            <div className="flex items-center justify-between">
              <span className="font-medium text-dark-800">Total from Macros</span>
              <span className="font-semibold text-dark-900">
                {totalCaloriesFromMacros} cal
              </span>
            </div>
            {entry.totalCalories !== totalCaloriesFromMacros && (
              <div className="text-xs text-dark-600 mt-1">
                Logged: {entry.totalCalories} cal (±{Math.abs(entry.totalCalories - totalCaloriesFromMacros)} difference)
              </div>
            )}
          </div>
        </div>

        {/* Goal Comparison */}
        {goal && (
          <div className="mt-6 pt-4 border-t border-dark-300">
            <h4 className="font-medium text-dark-800 mb-3">vs. Daily Goals</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className={`text-lg font-bold ${
                  entry.totalProtein >= goal.proteinGoal * 0.9 ? 'text-strength-500' : 'text-dark-600'
                }`}>
                  {((entry.totalProtein / goal.proteinGoal) * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-dark-600">Protein Goal</div>
              </div>
              <div>
                <div className={`text-lg font-bold ${
                  entry.totalCarbs >= goal.carbGoal * 0.9 ? 'text-cardio-500' : 'text-dark-600'
                }`}>
                  {((entry.totalCarbs / goal.carbGoal) * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-dark-600">Carb Goal</div>
              </div>
              <div>
                <div className={`text-lg font-bold ${
                  entry.totalFat >= goal.fatGoal * 0.9 ? 'text-accent-500' : 'text-dark-600'
                }`}>
                  {((entry.totalFat / goal.fatGoal) * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-dark-600">Fat Goal</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MacroChart;