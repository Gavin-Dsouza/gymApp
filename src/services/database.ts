import type { 
  User, BodyWeight, Exercise, WorkoutSession, PersonalRecord, CalorieEntry
} from '../types';

class GymDatabase {
  private dbName = 'GymApp';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Users store
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' });
          userStore.createIndex('email', 'email', { unique: true });
        }

        // Body weight store
        if (!db.objectStoreNames.contains('bodyWeights')) {
          const weightStore = db.createObjectStore('bodyWeights', { keyPath: 'id' });
          weightStore.createIndex('userId', 'userId');
          weightStore.createIndex('date', 'date');
          weightStore.createIndex('userDate', ['userId', 'date']);
        }

        // Exercises store
        if (!db.objectStoreNames.contains('exercises')) {
          const exerciseStore = db.createObjectStore('exercises', { keyPath: 'id' });
          exerciseStore.createIndex('category', 'category');
          exerciseStore.createIndex('name', 'name');
          exerciseStore.createIndex('primaryMuscles', 'primaryMuscles', { multiEntry: true });
        }

        // Workout sessions store
        if (!db.objectStoreNames.contains('workoutSessions')) {
          const sessionStore = db.createObjectStore('workoutSessions', { keyPath: 'id' });
          sessionStore.createIndex('userId', 'userId');
          sessionStore.createIndex('date', 'date');
          sessionStore.createIndex('userDate', ['userId', 'date']);
        }

        // Personal records store
        if (!db.objectStoreNames.contains('personalRecords')) {
          const prStore = db.createObjectStore('personalRecords', { keyPath: 'id' });
          prStore.createIndex('userId', 'userId');
          prStore.createIndex('exerciseId', 'exerciseId');
          prStore.createIndex('userExercise', ['userId', 'exerciseId']);
        }

        // Measurements store
        if (!db.objectStoreNames.contains('measurements')) {
          const measureStore = db.createObjectStore('measurements', { keyPath: 'id' });
          measureStore.createIndex('userId', 'userId');
          measureStore.createIndex('date', 'date');
          measureStore.createIndex('userDate', ['userId', 'date']);
        }

        // Calorie entries store
        if (!db.objectStoreNames.contains('calorieEntries')) {
          const calorieStore = db.createObjectStore('calorieEntries', { keyPath: 'id' });
          calorieStore.createIndex('userId', 'userId');
          calorieStore.createIndex('date', 'date');
          calorieStore.createIndex('userDate', ['userId', 'date']);
        }

        // User achievements store
        if (!db.objectStoreNames.contains('userAchievements')) {
          const achieveStore = db.createObjectStore('userAchievements', { keyPath: 'id' });
          achieveStore.createIndex('userId', 'userId');
        }

        // Workout templates store
        if (!db.objectStoreNames.contains('workoutTemplates')) {
          const templateStore = db.createObjectStore('workoutTemplates', { keyPath: 'id' });
          templateStore.createIndex('userId', 'userId');
        }
      };
    });
  }

  private async performTransaction<T>(
    storeName: string,
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => IDBRequest<T>
  ): Promise<T> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], mode);
      const store = transaction.objectStore(storeName);
      const request = operation(store);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  // User operations
  async createUser(user: User): Promise<User> {
    await this.performTransaction('users', 'readwrite', store => store.add(user));
    return user;
  }

  async getUser(id: string): Promise<User | null> {
    return await this.performTransaction('users', 'readonly', store => store.get(id));
  }

  async updateUser(user: User): Promise<User> {
    await this.performTransaction('users', 'readwrite', store => store.put(user));
    return user;
  }

  // Body weight operations
  async addBodyWeight(bodyWeight: BodyWeight): Promise<BodyWeight> {
    await this.performTransaction('bodyWeights', 'readwrite', store => store.add(bodyWeight));
    return bodyWeight;
  }

  async getBodyWeights(userId: string, limit?: number): Promise<BodyWeight[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['bodyWeights'], 'readonly');
      const store = transaction.objectStore('bodyWeights');
      const index = store.index('userDate');
      
      const range = IDBKeyRange.bound([userId, new Date(0)], [userId, new Date()]);
      const request = index.openCursor(range, 'prev');
      
      const results: BodyWeight[] = [];
      let count = 0;

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor && (!limit || count < limit)) {
          results.push(cursor.value);
          count++;
          cursor.continue();
        } else {
          resolve(results);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  // Exercise operations
  async addExercise(exercise: Exercise): Promise<Exercise> {
    await this.performTransaction('exercises', 'readwrite', store => store.add(exercise));
    return exercise;
  }

  async getExercises(): Promise<Exercise[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['exercises'], 'readonly');
      const store = transaction.objectStore('exercises');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getExercisesByMuscleGroup(muscleGroup: string): Promise<Exercise[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['exercises'], 'readonly');
      const store = transaction.objectStore('exercises');
      const index = store.index('primaryMuscles');
      const request = index.getAll(muscleGroup);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Workout session operations
  async addWorkoutSession(session: WorkoutSession): Promise<WorkoutSession> {
    await this.performTransaction('workoutSessions', 'readwrite', store => store.add(session));
    return session;
  }

  async getWorkoutSessions(userId: string, limit?: number): Promise<WorkoutSession[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['workoutSessions'], 'readonly');
      const store = transaction.objectStore('workoutSessions');
      const index = store.index('userDate');
      
      const range = IDBKeyRange.bound([userId, new Date(0)], [userId, new Date()]);
      const request = index.openCursor(range, 'prev');
      
      const results: WorkoutSession[] = [];
      let count = 0;

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor && (!limit || count < limit)) {
          results.push(cursor.value);
          count++;
          cursor.continue();
        } else {
          resolve(results);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  // Personal record operations
  async addPersonalRecord(pr: PersonalRecord): Promise<PersonalRecord> {
    await this.performTransaction('personalRecords', 'readwrite', store => store.add(pr));
    return pr;
  }

  async getPersonalRecords(userId: string, exerciseId?: string): Promise<PersonalRecord[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['personalRecords'], 'readonly');
      const store = transaction.objectStore('personalRecords');
      
      if (exerciseId) {
        const index = store.index('userExercise');
        const request = index.getAll([userId, exerciseId]);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      } else {
        const index = store.index('userId');
        const request = index.getAll(userId);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      }
    });
  }

  // Calorie entry operations
  async addCalorieEntry(entry: CalorieEntry): Promise<CalorieEntry> {
    await this.performTransaction('calorieEntries', 'readwrite', store => store.add(entry));
    return entry;
  }

  async getCalorieEntries(userId: string, startDate: Date, endDate: Date): Promise<CalorieEntry[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['calorieEntries'], 'readonly');
      const store = transaction.objectStore('calorieEntries');
      const index = store.index('userDate');
      
      const range = IDBKeyRange.bound([userId, startDate], [userId, endDate]);
      const request = index.getAll(range);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Clear all data (for development/testing)
  async clearAllData(): Promise<void> {
    if (!this.db) return;

    const storeNames = [
      'users', 'bodyWeights', 'exercises', 'workoutSessions', 
      'personalRecords', 'measurements', 'calorieEntries', 
      'userAchievements', 'workoutTemplates'
    ];

    for (const storeName of storeNames) {
      await this.performTransaction(storeName, 'readwrite', store => store.clear());
    }
  }
}

export const gymDB = new GymDatabase();