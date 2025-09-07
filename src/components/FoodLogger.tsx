import React, { useState, useEffect } from 'react';
import type { FoodDatabase } from '../types';
import { NutritionService } from '../services/nutritionService';

interface FoodLoggerProps {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: Date;
  onFoodLogged: () => void;
  onClose: () => void;
}

const FoodLogger: React.FC<FoodLoggerProps> = ({
  mealType,
  date,
  onFoodLogged,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [foods, setFoods] = useState<FoodDatabase[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodDatabase | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [isLogging, setIsLogging] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'categories'>('search');

  const categories = [
    { id: 'protein', name: 'Protein', emoji: '🥩', color: 'strength' },
    { id: 'carbs', name: 'Carbs', emoji: '🍞', color: 'cardio' },
    { id: 'fats', name: 'Healthy Fats', emoji: '🥑', color: 'accent' },
    { id: 'vegetables', name: 'Vegetables', emoji: '🥬', color: 'strength' },
    { id: 'fruits', name: 'Fruits', emoji: '🍎', color: 'cardio' },
    { id: 'dairy', name: 'Dairy', emoji: '🥛', color: 'primary' },
    { id: 'grains', name: 'Grains', emoji: '🌾', color: 'cardio' },
    { id: 'other', name: 'Other', emoji: '🍽️', color: 'dark' },
  ];

  useEffect(() => {
    if (searchTerm.trim()) {
      searchFoods();
    } else {
      setFoods([]);
    }
  }, [searchTerm]);

  const searchFoods = async () => {
    try {
      const results = await NutritionService.searchFoods(searchTerm);
      setFoods(results);
    } catch (error) {
      console.error('Failed to search foods:', error);
    }
  };

  const loadFoodsByCategory = async (category: FoodDatabase['category']) => {
    try {
      const results = await NutritionService.getFoodsByCategory(category);
      setFoods(results);
      setActiveTab('search');
    } catch (error) {
      console.error('Failed to load foods by category:', error);
    }
  };

  const handleFoodSelect = (food: FoodDatabase) => {
    setSelectedFood(food);
    setQuantity(food.servingSize);
  };

  const calculateNutrition = () => {
    if (!selectedFood) return null;
    
    const multiplier = quantity / selectedFood.servingSize;
    return {
      calories: Math.round(selectedFood.caloriesPerServing * multiplier),
      protein: Math.round(selectedFood.proteinPerServing * multiplier * 10) / 10,
      carbs: Math.round(selectedFood.carbsPerServing * multiplier * 10) / 10,
      fat: Math.round(selectedFood.fatPerServing * multiplier * 10) / 10,
      fiber: selectedFood.fiberPerServing ? Math.round(selectedFood.fiberPerServing * multiplier * 10) / 10 : 0,
    };
  };

  const handleLogFood = async () => {
    if (!selectedFood || quantity <= 0) return;

    setIsLogging(true);
    try {
      await NutritionService.addFoodToMeal(selectedFood.id, quantity, mealType, date);
      onFoodLogged();
    } catch (error) {
      console.error('Failed to log food:', error);
    } finally {
      setIsLogging(false);
    }
  };

  const nutrition = calculateNutrition();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-dark-100 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-dark-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-dark-900">
                Add Food to {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
              </h2>
              <p className="text-dark-600 text-sm">Search for foods or browse by category</p>
            </div>
            <button
              onClick={onClose}
              className="text-dark-500 hover:text-dark-700 p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row h-[calc(90vh-140px)]">
          {/* Left Panel - Food Selection */}
          <div className="flex-1 p-6 overflow-y-auto border-r border-dark-200">
            {/* Tab Navigation */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveTab('search')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'search'
                    ? 'bg-primary-600 text-white'
                    : 'bg-dark-200 text-dark-700 hover:bg-dark-300'
                }`}
              >
                🔍 Search
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'categories'
                    ? 'bg-primary-600 text-white'
                    : 'bg-dark-200 text-dark-700 hover:bg-dark-300'
                }`}
              >
                📂 Categories
              </button>
            </div>

            {/* Search Tab */}
            {activeTab === 'search' && (
              <div>
                <div className="relative mb-6">
                  <input
                    type="text"
                    placeholder="Search for foods..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-10 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-dark-200 text-dark-900"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <svg className="h-5 w-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Search Results */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {foods.map((food) => (
                    <button
                      key={food.id}
                      onClick={() => handleFoodSelect(food)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        selectedFood?.id === food.id
                          ? 'border-primary-400 bg-primary-900/10'
                          : 'border-dark-300 bg-dark-200/50 hover:border-dark-400 hover:bg-dark-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-dark-900">{food.name}</div>
                          {food.brand && (
                            <div className="text-sm text-dark-600">{food.brand}</div>
                          )}
                          <div className="text-sm text-dark-600 mt-1">
                            Per {food.servingSize}{food.servingUnit}: {food.caloriesPerServing} cal
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          food.category === 'protein' ? 'bg-strength-100 text-strength-700' :
                          food.category === 'carbs' ? 'bg-cardio-100 text-cardio-700' :
                          food.category === 'fats' ? 'bg-accent-100 text-accent-700' :
                          'bg-dark-300 text-dark-700'
                        }`}>
                          {food.category}
                        </div>
                      </div>
                    </button>
                  ))}

                  {searchTerm && foods.length === 0 && (
                    <div className="text-center py-8 text-dark-500">
                      <div className="text-4xl mb-2">🔍</div>
                      <p>No foods found for "{searchTerm}"</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => loadFoodsByCategory(category.id as FoodDatabase['category'])}
                    className={`p-4 rounded-lg border border-dark-300 hover:border-${category.color}-400 hover:bg-${category.color}-900/10 transition-all text-left`}
                  >
                    <div className="text-2xl mb-1">{category.emoji}</div>
                    <div className="font-medium text-dark-900">{category.name}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Panel - Food Details and Quantity */}
          <div className="w-full lg:w-80 p-6 bg-dark-50">
            {selectedFood ? (
              <div className="space-y-6">
                {/* Selected Food Info */}
                <div>
                  <h3 className="font-semibold text-dark-900 text-lg mb-2">
                    {selectedFood.name}
                  </h3>
                  {selectedFood.brand && (
                    <p className="text-dark-600 text-sm mb-2">{selectedFood.brand}</p>
                  )}
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    selectedFood.category === 'protein' ? 'bg-strength-100 text-strength-700' :
                    selectedFood.category === 'carbs' ? 'bg-cardio-100 text-cardio-700' :
                    selectedFood.category === 'fats' ? 'bg-accent-100 text-accent-700' :
                    'bg-dark-300 text-dark-700'
                  }`}>
                    {selectedFood.category}
                  </div>
                </div>

                {/* Quantity Input */}
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-2">
                    Quantity ({selectedFood.servingUnit})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={quantity || ''}
                    onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-dark-900"
                    placeholder={`e.g., ${selectedFood.servingSize}`}
                  />
                  <p className="text-xs text-dark-600 mt-1">
                    Standard serving: {selectedFood.servingSize}{selectedFood.servingUnit}
                  </p>
                </div>

                {/* Nutrition Preview */}
                {nutrition && quantity > 0 && (
                  <div>
                    <h4 className="font-medium text-dark-800 mb-3">Nutrition Info</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-primary-900/10 rounded-lg">
                        <span className="text-dark-700">Calories</span>
                        <span className="font-semibold text-primary-600">{nutrition.calories}</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="bg-strength-900/10 p-2 rounded text-center">
                          <div className="font-semibold text-strength-600">{nutrition.protein}g</div>
                          <div className="text-dark-600">Protein</div>
                        </div>
                        <div className="bg-cardio-900/10 p-2 rounded text-center">
                          <div className="font-semibold text-cardio-600">{nutrition.carbs}g</div>
                          <div className="text-dark-600">Carbs</div>
                        </div>
                        <div className="bg-accent-900/10 p-2 rounded text-center">
                          <div className="font-semibold text-accent-600">{nutrition.fat}g</div>
                          <div className="text-dark-600">Fat</div>
                        </div>
                      </div>

                      {nutrition.fiber > 0 && (
                        <div className="flex justify-between items-center text-sm text-dark-600">
                          <span>Fiber</span>
                          <span>{nutrition.fiber}g</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Add Food Button */}
                <button
                  onClick={handleLogFood}
                  disabled={!selectedFood || quantity <= 0 || isLogging}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLogging ? 'Adding...' : `Add to ${mealType}`}
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🍽️</div>
                <p className="text-dark-600">Select a food item to see details and add to your meal</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodLogger;