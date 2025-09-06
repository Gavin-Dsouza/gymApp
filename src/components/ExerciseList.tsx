import React, { useState, useEffect } from 'react';
import type { Exercise } from '../types';
import { gymDB } from '../services/database';
import { ExerciseLibraryService } from '../services/exerciseLibrary';

interface ExerciseListProps {
  muscleGroup?: string;
  category?: string;
}

const ExerciseList: React.FC<ExerciseListProps> = ({ muscleGroup, category }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadExercises();
  }, [muscleGroup, category]);

  const loadExercises = async () => {
    setLoading(true);
    try {
      let exerciseList: Exercise[];
      
      if (muscleGroup) {
        exerciseList = await ExerciseLibraryService.getExercisesByMuscleGroup(muscleGroup);
      } else {
        exerciseList = await gymDB.getExercises();
      }

      if (category) {
        exerciseList = exerciseList.filter(ex => ex.category === category);
      }

      setExercises(exerciseList);
    } catch (error) {
      console.error('Failed to load exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      loadExercises();
      return;
    }

    try {
      const searchResults = await ExerciseLibraryService.searchExercises(term);
      setExercises(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const filteredExercises = exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.primaryMuscles.some(muscle => 
      muscle.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse-slow text-primary-600">Loading exercises...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-recovery-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <svg className="h-5 w-5 text-recovery-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Exercise Grid */}
      {filteredExercises.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExercises.map((exercise) => (
            <div key={exercise.id} className="card hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-recovery-900 mb-1">{exercise.name}</h4>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ExerciseLibraryService.getDifficultyColor(exercise.difficulty)
                    }`}>
                      {exercise.difficulty}
                    </span>
                    {exercise.isCompound && (
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                        Compound
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-2xl">
                  {ExerciseLibraryService.getMuscleGroupEmoji(exercise.primaryMuscles[0])}
                </div>
              </div>

              <div className="mb-3">
                <p className="text-sm text-recovery-600 mb-1">Primary muscles:</p>
                <div className="flex flex-wrap gap-1">
                  {exercise.primaryMuscles.map((muscle) => (
                    <span key={muscle} className="px-2 py-1 bg-strength-100 text-strength-700 rounded text-xs">
                      {muscle}
                    </span>
                  ))}
                </div>
              </div>

              {exercise.equipment.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm text-recovery-600 mb-1">Equipment:</p>
                  <div className="flex flex-wrap gap-1">
                    {exercise.equipment.map((eq) => (
                      <span key={eq} className="px-2 py-1 bg-recovery-100 text-recovery-700 rounded text-xs">
                        {eq.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-recovery-500">
                <span>Tap to view details</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-recovery-700 mb-2">No exercises found</h3>
          <p className="text-recovery-500">
            {searchTerm ? `No exercises match "${searchTerm}"` : 'No exercises available'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ExerciseList;