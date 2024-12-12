import { HashRouter, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import WorkoutsByType from './pages/WorkoutsByType';
import WorkoutsByExercise from './pages/WorkoutsByExercise';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import ProfilePage from './pages/ProfilePage';

function App() {

  return (
    <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute/>}>
              <Route path="/" element={<MainPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/workout" element={<MainPage />} />
              <Route path="/workout/:date" element={<MainPage />} />
              <Route path="/workouts-by-type" element={<WorkoutsByType />} />
              <Route path="/workouts-by-exercise" element={<WorkoutsByExercise />} />
            </Route>
          </Routes>
        </HashRouter>
    </AuthProvider>
  )
}

export default App
