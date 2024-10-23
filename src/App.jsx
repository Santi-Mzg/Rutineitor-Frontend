import { HashRouter, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import { AuthProvider } from './context/AuthContext';
import { WorkoutProvider } from './context/WorkoutContext'
import ProtectedRoute from './ProtectedRoute';

function App() {

  return (
    <AuthProvider>
      <WorkoutProvider>
        <HashRouter>
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute/>}>
              <Route path="/" element={<MainPage />} />
              <Route path="/workout" element={<MainPage />} />
              <Route path="/workout/:date" element={<MainPage />} />
            </Route>
          </Routes>
        </HashRouter>
      </WorkoutProvider>
    </AuthProvider>
  )
}

export default App
