export interface User {
  id: string;
  name: string;
  email: string;
  dateOfBirth?: Date;
  height?: number; // in cm
  gender?: 'male' | 'female' | 'other';
  fitnessLevel?: 'beginner' | 'intermediate' | 'advanced';
  goals?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BodyWeight {
  id: string;
  userId: string;
  weight: number; // in kg
  bodyFat?: number; // percentage
  muscleMass?: number; // in kg
  date: Date;
  notes?: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: Equipment[];
  instructions?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isCompound: boolean;
}

export type ExerciseCategory = 
  | 'strength'
  | 'cardio'
  | 'flexibility'
  | 'sports'
  | 'functional';

export type Equipment = 
  | 'barbell'
  | 'dumbbell'
  | 'machine'
  | 'cable'
  | 'bodyweight'
  | 'kettlebell'
  | 'resistance_band'
  | 'other';

export interface WorkoutSet {
  id: string;
  exerciseId: string;
  weight?: number; // in kg
  reps: number;
  duration?: number; // in seconds for time-based exercises
  distance?: number; // in meters for cardio
  restTime?: number; // in seconds
  rpe?: number; // Rate of Perceived Exertion (1-10)
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  name: string;
  date: Date;
  startTime: Date;
  endTime?: Date;
  sets: WorkoutSet[];
  notes?: string;
  bodyWeight?: number;
  mood?: 'great' | 'good' | 'okay' | 'tired' | 'poor';
  energy?: 'high' | 'medium' | 'low';
}

export interface PersonalRecord {
  id: string;
  userId: string;
  exerciseId: string;
  weight: number;
  reps: number;
  date: Date;
  workoutSessionId: string;
}

export interface Measurement {
  id: string;
  userId: string;
  chest?: number; // in cm
  waist?: number;
  hips?: number;
  bicepLeft?: number;
  bicepRight?: number;
  thighLeft?: number;
  thighRight?: number;
  calfLeft?: number;
  calfRight?: number;
  neck?: number;
  forearmLeft?: number;
  forearmRight?: number;
  date: Date;
}

export interface CalorieEntry {
  id: string;
  userId: string;
  date: Date;
  calories: number;
  protein?: number; // in grams
  carbs?: number; // in grams
  fat?: number; // in grams
  fiber?: number; // in grams
  sugar?: number; // in grams
  sodium?: number; // in mg
  meal?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods?: FoodItem[];
}

export interface FoodItem {
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export interface NutritionGoal {
  id: string;
  userId: string;
  dailyCalories: number;
  proteinGoal: number; // in grams
  carbGoal: number; // in grams
  fatGoal: number; // in grams
  waterGoal?: number; // in liters
  createdAt: Date;
  updatedAt: Date;
}

export interface NutritionEntry {
  id: string;
  userId: string;
  date: Date;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  waterIntake?: number;
  meals: Meal[];
  notes?: string;
}

export interface Meal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  foods: FoodEntry[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  timestamp: Date;
}

export interface FoodEntry {
  id: string;
  foodId: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export interface FoodDatabase {
  id: string;
  name: string;
  brand?: string;
  servingSize: number;
  servingUnit: string;
  caloriesPerServing: number;
  proteinPerServing: number;
  carbsPerServing: number;
  fatPerServing: number;
  fiberPerServing?: number;
  category: 'protein' | 'carbs' | 'fats' | 'vegetables' | 'fruits' | 'dairy' | 'grains' | 'other';
  barcode?: string;
}

export interface WaterEntry {
  id: string;
  userId: string;
  date: Date;
  amount: number; // in ml
  timestamp: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'strength' | 'consistency' | 'milestone' | 'special';
  requirements: {
    type: 'workout_count' | 'pr' | 'streak' | 'weight_loss' | 'custom';
    target: number;
    exercise?: string;
  };
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: Date;
  progress: number; // 0-100
}

export interface MuscleGroup {
  name: string;
  exercises: string[]; // exercise IDs
  lastWorked?: Date;
  totalVolume?: number; // total weight moved in last 30 days
  frequency?: number; // times worked in last 30 days
}

export interface ProgressMetrics {
  totalWorkouts: number;
  currentStreak: number;
  longestStreak: number;
  totalWeight: number; // total weight lifted all time
  averageWorkoutDuration: number; // in minutes
  favoriteExercises: Array<{exerciseId: string; count: number}>;
  strengthScore: number; // calculated metric
  consistencyScore: number; // calculated metric
}

export interface WorkoutTemplate {
  id: string;
  userId: string;
  name: string;
  description?: string;
  exercises: Array<{
    exerciseId: string;
    sets: number;
    targetReps: number;
    targetWeight?: number;
  }>;
  estimatedDuration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}