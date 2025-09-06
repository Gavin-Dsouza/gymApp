import React, { useState } from 'react';
import ExerciseList from '../components/ExerciseList';

const Exercises: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('');

  const categories = [
    { id: 'strength', name: 'Strength Training', emoji: '💪', color: 'strength' },
    { id: 'cardio', name: 'Cardio', emoji: '🏃', color: 'cardio' },
    { id: 'flexibility', name: 'Flexibility', emoji: '🧘', color: 'muscle' },
  ];

  const muscleGroups = [
    { id: 'chest', name: 'Chest', emoji: '🫁' },
    { id: 'back', name: 'Back', emoji: '🔙' },
    { id: 'legs', name: 'Legs', emoji: '🦵' },
    { id: 'shoulders', name: 'Shoulders', emoji: '💪' },
    { id: 'biceps', name: 'Biceps', emoji: '💪' },
    { id: 'triceps', name: 'Triceps', emoji: '💪' },
    { id: 'core', name: 'Core', emoji: '🔥' },
  ];
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-display font-bold text-recovery-900 mb-2">
            Exercise Library
          </h1>
          <p className="text-recovery-600 text-lg">Browse and track your exercises</p>
        </header>

        {/* Filter Section */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-recovery-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-recovery-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.emoji} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-recovery-700 mb-2">Muscle Group</label>
              <select
                value={selectedMuscleGroup}
                onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                className="px-4 py-2 border border-recovery-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Muscle Groups</option>
                {muscleGroups.map((muscle) => (
                  <option key={muscle.id} value={muscle.id}>
                    {muscle.emoji} {muscle.name}
                  </option>
                ))}
              </select>
            </div>

            {(selectedCategory || selectedMuscleGroup) && (
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setSelectedMuscleGroup('');
                  }}
                  className="btn-secondary text-sm px-4 py-2"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Quick Category Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`card ${category.color}-card cursor-pointer hover:shadow-lg transition-shadow text-left ${
                  selectedCategory === category.id ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{category.emoji}</div>
                  <h3 className={`font-semibold text-xl text-${category.color}-800 mb-1`}>
                    {category.name}
                  </h3>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Exercise List */}
        <ExerciseList 
          category={selectedCategory || undefined} 
          muscleGroup={selectedMuscleGroup || undefined}
        />
      </div>
    </div>
  );
};

export default Exercises;