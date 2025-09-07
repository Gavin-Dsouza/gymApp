import React, { useState, useEffect } from 'react';
import type { PersonalRecord, Exercise } from '../types';
import { gymDB } from '../services/database';
import { ExerciseLibraryService } from '../services/exerciseLibrary';

interface PersonalRecordsProps {
  records: PersonalRecord[];
  onRefresh: () => void;
}

const PersonalRecords: React.FC<PersonalRecordsProps> = ({ records, onRefresh }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'weight' | 'oneRM'>('date');

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      const exerciseList = await gymDB.getExercises();
      setExercises(exerciseList);
    } catch (error) {
      console.error('Failed to load exercises:', error);
    }
  };

  const getExercise = (exerciseId: string): Exercise | undefined => {
    return exercises.find(e => e.id === exerciseId);
  };

  const calculateOneRM = (weight: number, reps: number): number => {
    // Epley formula: 1RM = weight * (1 + reps/30)
    return weight * (1 + reps / 30);
  };

  const getStrengthLevel = (oneRM: number, bodyWeight: number = 70): string => {
    const ratio = oneRM / bodyWeight;
    
    if (ratio >= 2.5) return 'Elite';
    if (ratio >= 2.0) return 'Advanced';
    if (ratio >= 1.5) return 'Intermediate';
    if (ratio >= 1.0) return 'Novice';
    return 'Beginner';
  };

  // Group records by exercise and get the best for each
  const groupedRecords = records.reduce((acc, record) => {
    const exercise = getExercise(record.exerciseId);
    if (!exercise) return acc;

    const key = record.exerciseId;
    const oneRM = calculateOneRM(record.weight, record.reps);
    
    if (!acc[key] || calculateOneRM(acc[key].weight, acc[key].reps) < oneRM) {
      acc[key] = { ...record, exercise, oneRM };
    }
    
    return acc;
  }, {} as Record<string, PersonalRecord & { exercise: Exercise; oneRM: number }>);

  // Filter by category
  const filteredRecords = Object.values(groupedRecords).filter(record => {
    if (!selectedCategory) return true;
    return record.exercise.category === selectedCategory;
  });

  // Sort records
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'weight':
        return b.weight - a.weight;
      case 'oneRM':
        return b.oneRM - a.oneRM;
      default:
        return 0;
    }
  });

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'strength', label: 'Strength' },
    { value: 'cardio', label: 'Cardio' },
    { value: 'flexibility', label: 'Flexibility' },
  ];

  if (records.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-6xl mb-4">🏆</div>
        <h3 className="text-xl font-semibold text-recovery-700 mb-2">No Personal Records</h3>
        <p className="text-recovery-500 mb-6">
          Complete workouts with weights to start setting personal records!
        </p>
        <button
          onClick={onRefresh}
          className="btn-primary"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-recovery-700 mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-recovery-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-recovery-700 mb-1">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-2 border border-recovery-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="date">Recent First</option>
                <option value="weight">Heaviest Weight</option>
                <option value="oneRM">Estimated 1RM</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-recovery-600">
            {filteredRecords.length} personal records
          </div>
        </div>
      </div>

      {/* Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedRecords.map((record) => (
          <div key={record.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">
                  {ExerciseLibraryService.getMuscleGroupEmoji(record.exercise.primaryMuscles[0])}
                </span>
                <div>
                  <h3 className="font-semibold text-recovery-900">{record.exercise.name}</h3>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className={`px-2 py-1 rounded-full font-medium ${
                      record.exercise.difficulty === 'beginner' ? 'bg-strength-100 text-strength-700' :
                      record.exercise.difficulty === 'intermediate' ? 'bg-cardio-100 text-cardio-700' :
                      'bg-muscle-100 text-muscle-700'
                    }`}>
                      {record.exercise.difficulty}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-2xl">🏆</div>
            </div>

            {/* PR Stats */}
            <div className="bg-strength-50 rounded-lg p-4 mb-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-strength-700 mb-1">
                  {record.weight} kg × {record.reps}
                </div>
                <div className="text-sm text-strength-600">Personal Record</div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-primary-600">
                  {record.oneRM.toFixed(1)} kg
                </div>
                <div className="text-recovery-600">Est. 1RM</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-cardio-600">
                  {getStrengthLevel(record.oneRM)}
                </div>
                <div className="text-recovery-600">Level</div>
              </div>
            </div>

            {/* Date */}
            <div className="mt-4 pt-4 border-t border-recovery-200 text-center">
              <div className="text-sm text-recovery-600">
                Set on {new Date(record.date).toLocaleDateString()}
              </div>
            </div>

            {/* Progress indicator */}
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-recovery-500">
                <span>Volume: {(record.weight * record.reps).toLocaleString()} kg</span>
                <span>
                  {Math.round((new Date().getTime() - new Date(record.date).getTime()) / (1000 * 60 * 60 * 24))} days ago
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedRecords.length === 0 && (
        <div className="card text-center py-8">
          <div className="text-4xl mb-2">🔍</div>
          <p className="text-recovery-500">No records found for the selected category</p>
        </div>
      )}

      {/* Summary Stats */}
      {sortedRecords.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-recovery-900 mb-4">Personal Records Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-strength-600">
                {sortedRecords.length}
              </div>
              <div className="text-sm text-recovery-600">Total PRs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cardio-600">
                {Math.max(...sortedRecords.map(r => r.weight)).toFixed(1)} kg
              </div>
              <div className="text-sm text-recovery-600">Heaviest Lift</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-muscle-600">
                {Math.max(...sortedRecords.map(r => r.oneRM)).toFixed(1)} kg
              </div>
              <div className="text-sm text-recovery-600">Best 1RM</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-600">
                {Math.round(
                  (new Date().getTime() - Math.max(...sortedRecords.map(r => new Date(r.date).getTime()))) 
                  / (1000 * 60 * 60 * 24)
                )}
              </div>
              <div className="text-sm text-recovery-600">Days Since Last PR</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalRecords;