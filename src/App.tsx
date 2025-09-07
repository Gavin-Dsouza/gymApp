import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { gymDB } from './services/database';
import { ExerciseLibraryService } from './services/exerciseLibrary';
import { NutritionService } from './services/nutritionService';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Exercises from './pages/Exercises';
import Workouts from './pages/Workouts';
import Progress from './pages/Progress';
import Nutrition from './pages/Nutrition';

function App() {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await gymDB.init();
        await ExerciseLibraryService.initializeDefaultExercises();
        await NutritionService.initializeDefaultFoods();
        console.log('App initialized successfully');
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initializeApp();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-dark-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/progress" element={<Progress />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
