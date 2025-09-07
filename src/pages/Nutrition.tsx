import React, { useState, useEffect } from 'react';
import type { NutritionEntry, NutritionGoal } from '../types';
import { NutritionService } from '../services/nutritionService';
import FoodLogger from '../components/FoodLogger';
import NutritionOverview from '../components/NutritionOverview';
import MacroChart from '../components/MacroChart';

const Nutrition: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [nutritionEntry, setNutritionEntry] = useState<NutritionEntry | null>(null);
  const [nutritionGoal, setNutritionGoal] = useState<NutritionGoal | null>(null);
  const [showFoodLogger, setShowFoodLogger] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNutritionData();
  }, [selectedDate]);

  const loadNutritionData = async () => {
    setIsLoading(true);
    try {
      const [entry, goal] = await Promise.all([
        NutritionService.getNutritionEntry(selectedDate),
        NutritionService.getNutritionGoal(),
      ]);
      
      setNutritionEntry(entry);
      setNutritionGoal(goal);
    } catch (error) {
      console.error('Failed to load nutrition data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFoodLogged = async () => {
    setShowFoodLogger(false);
    await loadNutritionData();
  };

  const handleSetupGoals = async () => {
    // For now, create a simple default goal
    try {
      const goal = await NutritionService.createNutritionGoal({
        userId: 'demo-user',
        dailyCalories: 2200,
        proteinGoal: 150,
        carbGoal: 200,
        fatGoal: 80,
        waterGoal: 2.5,
      });
      setNutritionGoal(goal);
    } catch (error) {
      console.error('Failed to create nutrition goal:', error);
    }
  };

  const getMealIcon = (mealType: string): string => {
    const icons = {
      breakfast: '🌅',
      lunch: '☀️',
      dinner: '🌙',
      snack: '🍎',
    };
    return icons[mealType as keyof typeof icons] || '🍽️';
  };

  const formatDate = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  if (isLoading) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse-slow text-primary-600">Loading nutrition data...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-display font-bold text-dark-900 mb-2">
                Nutrition Tracker
              </h1>
              <p className="text-dark-600 text-lg">Track your meals, calories, and macros</p>
            </div>
            
            {/* Date Selector */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setDate(newDate.getDate() - 1);
                  setSelectedDate(newDate);
                }}
                className="p-2 rounded-lg bg-dark-200 hover:bg-dark-300 text-dark-700"
              >
                ←
              </button>
              <div className="text-center">
                <div className="font-semibold text-dark-900">{formatDate(selectedDate)}</div>
                <div className="text-xs text-dark-600">{selectedDate.toLocaleDateString()}</div>
              </div>
              <button
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setDate(newDate.getDate() + 1);
                  if (newDate <= new Date()) {
                    setSelectedDate(newDate);
                  }
                }}
                className="p-2 rounded-lg bg-dark-200 hover:bg-dark-300 text-dark-700 disabled:opacity-50"
                disabled={selectedDate.toDateString() === new Date().toDateString()}
              >
                →
              </button>
            </div>
          </div>
        </header>

        {/* Setup Goals if none exist */}
        {!nutritionGoal && (
          <div className="card bg-primary-900/10 border border-primary-400/30 mb-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-primary-400 mb-2">
                Set Your Nutrition Goals
              </h3>
              <p className="text-dark-700 mb-4">
                Define your daily calorie and macro targets to track your progress effectively
              </p>
              <button onClick={handleSetupGoals} className="btn-primary">
                Create Default Goals
              </button>
            </div>
          </div>
        )}

        {/* Nutrition Overview */}
        {nutritionGoal && (
          <NutritionOverview 
            entry={nutritionEntry}
            goal={nutritionGoal}
            date={selectedDate}
          />
        )}

        {/* Macro Chart */}
        {nutritionEntry && (
          <div className="mb-8">
            <MacroChart entry={nutritionEntry} goal={nutritionGoal} />
          </div>
        )}

        {/* Meals Section */}
        <div className="space-y-6">
          {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => {
            const meal = nutritionEntry?.meals.find(m => m.type === mealType);
            
            return (
              <div key={mealType} className="card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getMealIcon(mealType)}</span>
                    <h3 className="font-semibold text-xl text-dark-900 capitalize">
                      {mealType}
                    </h3>
                    {meal && (
                      <div className="text-sm text-dark-600">
                        {meal.totalCalories} cal • {meal.totalProtein}g protein
                      </div>
                    )}
                  </div>
                  
                  {isToday && (
                    <button
                      onClick={() => {
                        setSelectedMealType(mealType as any);
                        setShowFoodLogger(true);
                      }}
                      className="btn-secondary text-sm"
                    >
                      Add Food
                    </button>
                  )}
                </div>

                {meal && meal.foods.length > 0 ? (
                  <div className="space-y-2">
                    {meal.foods.map((food) => (
                      <div key={food.id} className="flex items-center justify-between p-3 bg-dark-200/50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-dark-900">{food.name}</div>
                          <div className="text-sm text-dark-600">
                            {food.quantity} {food.unit}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-medium text-dark-900">{food.calories} cal</div>
                          <div className="text-xs text-dark-600">
                            P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Meal Summary */}
                    <div className="pt-3 border-t border-dark-300">
                      <div className="grid grid-cols-4 gap-4 text-center text-sm">
                        <div>
                          <div className="font-semibold text-primary-400">{meal.totalCalories}</div>
                          <div className="text-dark-600">Calories</div>
                        </div>
                        <div>
                          <div className="font-semibold text-strength-400">{meal.totalProtein}g</div>
                          <div className="text-dark-600">Protein</div>
                        </div>
                        <div>
                          <div className="font-semibold text-cardio-400">{meal.totalCarbs}g</div>
                          <div className="text-dark-600">Carbs</div>
                        </div>
                        <div>
                          <div className="font-semibold text-accent-400">{meal.totalFat}g</div>
                          <div className="text-dark-600">Fat</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-dark-500">
                    <div className="text-3xl mb-2">🍽️</div>
                    <p>No foods logged for {mealType}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Food Logger Modal */}
        {showFoodLogger && (
          <FoodLogger
            mealType={selectedMealType}
            date={selectedDate}
            onFoodLogged={handleFoodLogged}
            onClose={() => setShowFoodLogger(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Nutrition;