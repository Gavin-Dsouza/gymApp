import React, { useState } from 'react';
import type { Exercise } from '../types';

interface ExerciseSelectorProps {
  exercises: Exercise[];
  onExerciseSelected: (exercise: Exercise) => void;
}

const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  exercises,
  onExerciseSelected,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'strength', label: 'Strength' },
    { value: 'cardio', label: 'Cardio' },
    { value: 'flexibility', label: 'Flexibility' },
  ];

  const muscleGroups = [
    { value: '', label: 'All Muscles' },
    { value: 'chest', label: 'Chest' },
    { value: 'back', label: 'Back' },
    { value: 'legs', label: 'Legs' },
    { value: 'shoulders', label: 'Shoulders' },
    { value: 'biceps', label: 'Biceps' },
    { value: 'triceps', label: 'Triceps' },
    { value: 'core', label: 'Core' },
  ];

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.primaryMuscles.some(muscle => 
                           muscle.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    const matchesCategory = !selectedCategory || exercise.category === selectedCategory;
    
    const matchesMuscleGroup = !selectedMuscleGroup || 
                              exercise.primaryMuscles.includes(selectedMuscleGroup) ||
                              exercise.secondaryMuscles.includes(selectedMuscleGroup);

    return matchesSearch && matchesCategory && matchesMuscleGroup;
  });

  const getMuscleEmoji = (muscle: string): string => {
    const emojiMap: Record<string, string> = {
      chest: '🫁',
      back: '🔙', 
      legs: '🦵',
      quadriceps: '🦵',
      hamstrings: '🦵',
      glutes: '🍑',
      calves: '🦵',
      shoulders: '💪',
      biceps: '💪',
      triceps: '💪',
      core: '🔥',
      lats: '🔙',
      traps: '🔙',
      forearms: '💪',
    };
    return emojiMap[muscle] || '💪';
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-recovery-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <svg className="h-5 w-5 text-recovery-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex space-x-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-recovery-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          <select
            value={selectedMuscleGroup}
            onChange={(e) => setSelectedMuscleGroup(e.target.value)}
            className="px-3 py-2 border border-recovery-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {muscleGroups.map(muscle => (
              <option key={muscle.value} value={muscle.value}>{muscle.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
        {filteredExercises.map((exercise) => (
          <button
            key={exercise.id}
            onClick={() => onExerciseSelected(exercise)}
            className="card text-left hover:shadow-md hover:border-primary-300 transition-all duration-200 p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xl">
                    {getMuscleEmoji(exercise.primaryMuscles[0])}
                  </span>
                  <h4 className="font-semibold text-recovery-900">{exercise.name}</h4>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-2">
                  {exercise.primaryMuscles.slice(0, 2).map((muscle) => (
                    <span key={muscle} className="px-2 py-1 bg-strength-100 text-strength-700 rounded text-xs">
                      {muscle}
                    </span>
                  ))}
                  {exercise.primaryMuscles.length > 2 && (
                    <span className="px-2 py-1 bg-recovery-100 text-recovery-600 rounded text-xs">
                      +{exercise.primaryMuscles.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex space-x-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  exercise.difficulty === 'beginner' ? 'bg-strength-100 text-strength-700' :
                  exercise.difficulty === 'intermediate' ? 'bg-cardio-100 text-cardio-700' :
                  'bg-muscle-100 text-muscle-700'
                }`}>
                  {exercise.difficulty}
                </span>
                {exercise.isCompound && (
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                    Compound
                  </span>
                )}
              </div>
              
              <svg className="w-4 h-4 text-recovery-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {exercise.equipment.length > 0 && (
              <div className="mt-2 pt-2 border-t border-recovery-100">
                <div className="flex flex-wrap gap-1">
                  {exercise.equipment.slice(0, 3).map((eq) => (
                    <span key={eq} className="px-2 py-1 bg-recovery-100 text-recovery-600 rounded text-xs">
                      {eq.replace('_', ' ')}
                    </span>
                  ))}
                  {exercise.equipment.length > 3 && (
                    <span className="px-2 py-1 bg-recovery-100 text-recovery-600 rounded text-xs">
                      +{exercise.equipment.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🔍</div>
          <p className="text-recovery-500">No exercises found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default ExerciseSelector;