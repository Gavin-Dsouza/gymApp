import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { gymDB } from './services/database';
import { ExerciseLibraryService } from './services/exerciseLibrary';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Exercises from './pages/Exercises';

function App() {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await gymDB.init();
        await ExerciseLibraryService.initializeDefaultExercises();
        console.log('App initialized successfully');
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initializeApp();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-recovery-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/workouts" element={<div className="p-8 text-center">Workouts page coming soon...</div>} />
            <Route path="/nutrition" element={<div className="p-8 text-center">Nutrition page coming soon...</div>} />
            <Route path="/progress" element={<div className="p-8 text-center">Progress page coming soon...</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
