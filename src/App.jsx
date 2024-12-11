import { HashRouter, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import WorkoutFilter from './pages/WorkoutFilter';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

function App() {

  return (
    <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute/>}>
              <Route path="/" element={<MainPage />} />
              <Route path="/workout" element={<MainPage />} />
              <Route path="/workout/:date" element={<MainPage />} />
              <Route path="/workouts-by-type/" element={<WorkoutFilter />} />
            </Route>
          </Routes>
        </HashRouter>
    </AuthProvider>
  )
}

export default App
