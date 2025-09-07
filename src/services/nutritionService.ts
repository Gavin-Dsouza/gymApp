import type { 
  NutritionEntry, NutritionGoal, Meal, FoodEntry, FoodDatabase, WaterEntry 
} from '../types';
import { gymDB } from './database';

export const defaultFoods: Omit<FoodDatabase, 'id'>[] = [
  // Proteins
  { name: 'Chicken Breast', servingSize: 100, servingUnit: 'g', caloriesPerServing: 165, proteinPerServing: 31, carbsPerServing: 0, fatPerServing: 3.6, fiberPerServing: 0, category: 'protein' },
  { name: 'Salmon', servingSize: 100, servingUnit: 'g', caloriesPerServing: 208, proteinPerServing: 25, carbsPerServing: 0, fatPerServing: 12, fiberPerServing: 0, category: 'protein' },
  { name: 'Eggs', servingSize: 50, servingUnit: 'g', caloriesPerServing: 78, proteinPerServing: 6, carbsPerServing: 0.6, fatPerServing: 5, fiberPerServing: 0, category: 'protein' },
  { name: 'Greek Yogurt', servingSize: 100, servingUnit: 'g', caloriesPerServing: 97, proteinPerServing: 9, carbsPerServing: 6, fatPerServing: 5, fiberPerServing: 0, category: 'protein' },
  { name: 'Whey Protein Powder', servingSize: 30, servingUnit: 'g', caloriesPerServing: 120, proteinPerServing: 25, carbsPerServing: 2, fatPerServing: 1, fiberPerServing: 0, category: 'protein' },
  
  // Carbs
  { name: 'White Rice', servingSize: 100, servingUnit: 'g', caloriesPerServing: 130, proteinPerServing: 2.7, carbsPerServing: 28, fatPerServing: 0.3, fiberPerServing: 0.4, category: 'carbs' },
  { name: 'Brown Rice', servingSize: 100, servingUnit: 'g', caloriesPerServing: 111, proteinPerServing: 2.6, carbsPerServing: 22, fatPerServing: 0.9, fiberPerServing: 1.8, category: 'carbs' },
  { name: 'Oats', servingSize: 100, servingUnit: 'g', caloriesPerServing: 389, proteinPerServing: 17, carbsPerServing: 66, fatPerServing: 7, fiberPerServing: 11, category: 'carbs' },
  { name: 'Sweet Potato', servingSize: 100, servingUnit: 'g', caloriesPerServing: 86, proteinPerServing: 1.6, carbsPerServing: 20, fatPerServing: 0.1, fiberPerServing: 3, category: 'carbs' },
  { name: 'Banana', servingSize: 100, servingUnit: 'g', caloriesPerServing: 89, proteinPerServing: 1.1, carbsPerServing: 23, fatPerServing: 0.3, fiberPerServing: 2.6, category: 'fruits' },
  
  // Fats
  { name: 'Almonds', servingSize: 28, servingUnit: 'g', caloriesPerServing: 161, proteinPerServing: 6, carbsPerServing: 6, fatPerServing: 14, fiberPerServing: 3.5, category: 'fats' },
  { name: 'Avocado', servingSize: 100, servingUnit: 'g', caloriesPerServing: 160, proteinPerServing: 2, carbsPerServing: 9, fatPerServing: 15, fiberPerServing: 7, category: 'fats' },
  { name: 'Olive Oil', servingSize: 15, servingUnit: 'ml', caloriesPerServing: 119, proteinPerServing: 0, carbsPerServing: 0, fatPerServing: 13.5, fiberPerServing: 0, category: 'fats' },
  { name: 'Peanut Butter', servingSize: 32, servingUnit: 'g', caloriesPerServing: 190, proteinPerServing: 8, carbsPerServing: 8, fatPerServing: 16, fiberPerServing: 3, category: 'fats' },
  
  // Vegetables
  { name: 'Broccoli', servingSize: 100, servingUnit: 'g', caloriesPerServing: 34, proteinPerServing: 2.8, carbsPerServing: 7, fatPerServing: 0.4, fiberPerServing: 2.6, category: 'vegetables' },
  { name: 'Spinach', servingSize: 100, servingUnit: 'g', caloriesPerServing: 23, proteinPerServing: 2.9, carbsPerServing: 3.6, fatPerServing: 0.4, fiberPerServing: 2.2, category: 'vegetables' },
  { name: 'Carrots', servingSize: 100, servingUnit: 'g', caloriesPerServing: 41, proteinPerServing: 0.9, carbsPerServing: 10, fatPerServing: 0.2, fiberPerServing: 2.8, category: 'vegetables' },
  
  // Dairy
  { name: 'Whole Milk', servingSize: 240, servingUnit: 'ml', caloriesPerServing: 146, proteinPerServing: 8, carbsPerServing: 11, fatPerServing: 8, fiberPerServing: 0, category: 'dairy' },
  { name: 'Cottage Cheese', servingSize: 100, servingUnit: 'g', caloriesPerServing: 98, proteinPerServing: 11, carbsPerServing: 3.4, fatPerServing: 4.3, fiberPerServing: 0, category: 'dairy' },
  
  // Grains
  { name: 'Whole Wheat Bread', servingSize: 28, servingUnit: 'g', caloriesPerServing: 69, proteinPerServing: 3.6, carbsPerServing: 12, fatPerServing: 1.2, fiberPerServing: 1.9, category: 'grains' },
  { name: 'Pasta', servingSize: 100, servingUnit: 'g', caloriesPerServing: 131, proteinPerServing: 5, carbsPerServing: 25, fatPerServing: 1.1, fiberPerServing: 1.8, category: 'grains' },
];

export class NutritionService {
  private static userId = 'demo-user';

  static async initializeDefaultFoods(): Promise<void> {
    try {
      const existingFoods = await gymDB.getFoodDatabase();
      if (existingFoods.length > 0) {
        console.log('Food database already initialized');
        return;
      }

      for (const foodData of defaultFoods) {
        const food: FoodDatabase = {
          ...foodData,
          id: crypto.randomUUID(),
        };
        await gymDB.addFood(food);
      }

      console.log(`Initialized ${defaultFoods.length} default foods`);
    } catch (error) {
      console.error('Failed to initialize food database:', error);
    }
  }

  static async createNutritionGoal(goal: Omit<NutritionGoal, 'id' | 'createdAt' | 'updatedAt'>): Promise<NutritionGoal> {
    const nutritionGoal: NutritionGoal = {
      ...goal,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await gymDB.addNutritionGoal(nutritionGoal);
    return nutritionGoal;
  }

  static async getNutritionGoal(): Promise<NutritionGoal | null> {
    return await gymDB.getNutritionGoal(this.userId);
  }

  static async updateNutritionGoal(updates: Partial<NutritionGoal>): Promise<NutritionGoal | null> {
    const existing = await this.getNutritionGoal();
    if (!existing) return null;

    const updated: NutritionGoal = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };

    await gymDB.updateNutritionGoal(updated);
    return updated;
  }

  static async logFood(meal: Omit<Meal, 'id'>, date: Date = new Date()): Promise<NutritionEntry> {
    // Get or create nutrition entry for the day
    let entry = await gymDB.getNutritionEntry(this.userId, date);
    
    if (!entry) {
      entry = {
        id: crypto.randomUUID(),
        userId: this.userId,
        date,
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        totalFiber: 0,
        meals: [],
      };
    }

    // Add meal with ID
    const mealWithId: Meal = {
      ...meal,
      id: crypto.randomUUID(),
    };

    entry.meals.push(mealWithId);

    // Recalculate totals
    this.recalculateNutritionTotals(entry);

    // Save entry
    await gymDB.addNutritionEntry(entry);
    return entry;
  }

  static async addFoodToMeal(
    foodId: string, 
    quantity: number, 
    mealType: Meal['type'],
    date: Date = new Date()
  ): Promise<NutritionEntry> {
    const food = await gymDB.getFood(foodId);
    if (!food) {
      throw new Error('Food not found');
    }

    // Calculate nutrition for quantity
    const multiplier = quantity / food.servingSize;
    const foodEntry: FoodEntry = {
      id: crypto.randomUUID(),
      foodId: food.id,
      name: food.name,
      quantity,
      unit: food.servingUnit,
      calories: Math.round(food.caloriesPerServing * multiplier),
      protein: Math.round(food.proteinPerServing * multiplier * 10) / 10,
      carbs: Math.round(food.carbsPerServing * multiplier * 10) / 10,
      fat: Math.round(food.fatPerServing * multiplier * 10) / 10,
      fiber: food.fiberPerServing ? Math.round(food.fiberPerServing * multiplier * 10) / 10 : undefined,
    };

    // Get or create entry for the day
    let entry = await gymDB.getNutritionEntry(this.userId, date);
    
    if (!entry) {
      entry = {
        id: crypto.randomUUID(),
        userId: this.userId,
        date,
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        totalFiber: 0,
        meals: [],
      };
    }

    // Find or create meal
    let meal = entry.meals.find(m => m.type === mealType);
    if (!meal) {
      meal = {
        id: crypto.randomUUID(),
        type: mealType,
        name: this.getMealName(mealType),
        foods: [],
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        timestamp: new Date(),
      };
      entry.meals.push(meal);
    }

    // Add food to meal
    meal.foods.push(foodEntry);

    // Recalculate meal totals
    this.recalculateMealTotals(meal);

    // Recalculate entry totals
    this.recalculateNutritionTotals(entry);

    // Save entry
    await gymDB.addNutritionEntry(entry);
    return entry;
  }

  static async getNutritionEntry(date: Date): Promise<NutritionEntry | null> {
    return await gymDB.getNutritionEntry(this.userId, date);
  }

  static async getNutritionEntries(startDate: Date, endDate: Date): Promise<NutritionEntry[]> {
    return await gymDB.getNutritionEntries(this.userId, startDate, endDate);
  }

  static async logWater(amount: number, date: Date = new Date()): Promise<WaterEntry> {
    const waterEntry: WaterEntry = {
      id: crypto.randomUUID(),
      userId: this.userId,
      date,
      amount,
      timestamp: new Date(),
    };

    await gymDB.addWaterEntry(waterEntry);
    return waterEntry;
  }

  static async getWaterEntries(date: Date): Promise<WaterEntry[]> {
    return await gymDB.getWaterEntries(this.userId, date);
  }

  static async searchFoods(query: string): Promise<FoodDatabase[]> {
    return await gymDB.searchFoods(query);
  }

  static async getFoodsByCategory(category: FoodDatabase['category']): Promise<FoodDatabase[]> {
    return await gymDB.getFoodsByCategory(category);
  }

  static async getNutritionStats(days: number = 7): Promise<{
    avgCalories: number;
    avgProtein: number;
    avgCarbs: number;
    avgFat: number;
    consistency: number;
    goalAdherence: number;
  }> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const entries = await this.getNutritionEntries(startDate, endDate);
    const goal = await this.getNutritionGoal();

    if (entries.length === 0) {
      return {
        avgCalories: 0,
        avgProtein: 0,
        avgCarbs: 0,
        avgFat: 0,
        consistency: 0,
        goalAdherence: 0,
      };
    }

    const avgCalories = entries.reduce((sum, e) => sum + e.totalCalories, 0) / entries.length;
    const avgProtein = entries.reduce((sum, e) => sum + e.totalProtein, 0) / entries.length;
    const avgCarbs = entries.reduce((sum, e) => sum + e.totalCarbs, 0) / entries.length;
    const avgFat = entries.reduce((sum, e) => sum + e.totalFat, 0) / entries.length;

    const consistency = (entries.length / days) * 100;

    let goalAdherence = 0;
    if (goal) {
      const calorieAccuracy = Math.max(0, 100 - Math.abs(avgCalories - goal.dailyCalories) / goal.dailyCalories * 100);
      const proteinAccuracy = Math.max(0, 100 - Math.abs(avgProtein - goal.proteinGoal) / goal.proteinGoal * 100);
      goalAdherence = (calorieAccuracy + proteinAccuracy) / 2;
    }

    return {
      avgCalories: Math.round(avgCalories),
      avgProtein: Math.round(avgProtein * 10) / 10,
      avgCarbs: Math.round(avgCarbs * 10) / 10,
      avgFat: Math.round(avgFat * 10) / 10,
      consistency: Math.round(consistency),
      goalAdherence: Math.round(goalAdherence),
    };
  }

  private static getMealName(type: Meal['type']): string {
    const names = {
      breakfast: 'Breakfast',
      lunch: 'Lunch', 
      dinner: 'Dinner',
      snack: 'Snack',
    };
    return names[type];
  }

  private static recalculateMealTotals(meal: Meal): void {
    meal.totalCalories = meal.foods.reduce((sum, f) => sum + f.calories, 0);
    meal.totalProtein = Math.round(meal.foods.reduce((sum, f) => sum + f.protein, 0) * 10) / 10;
    meal.totalCarbs = Math.round(meal.foods.reduce((sum, f) => sum + f.carbs, 0) * 10) / 10;
    meal.totalFat = Math.round(meal.foods.reduce((sum, f) => sum + f.fat, 0) * 10) / 10;
  }

  private static recalculateNutritionTotals(entry: NutritionEntry): void {
    entry.totalCalories = entry.meals.reduce((sum, m) => sum + m.totalCalories, 0);
    entry.totalProtein = Math.round(entry.meals.reduce((sum, m) => sum + m.totalProtein, 0) * 10) / 10;
    entry.totalCarbs = Math.round(entry.meals.reduce((sum, m) => sum + m.totalCarbs, 0) * 10) / 10;
    entry.totalFat = Math.round(entry.meals.reduce((sum, m) => sum + m.totalFat, 0) * 10) / 10;
    entry.totalFiber = Math.round(entry.meals.reduce((sum, m) => 
      sum + m.foods.reduce((foodSum, f) => foodSum + (f.fiber || 0), 0), 0
    ) * 10) / 10;
  }
}