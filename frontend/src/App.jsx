import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import SharedVizPage from './pages/SharedVizPage.jsx';
import VisualizerPage from './pages/VisualizerPage.jsx';
import { useAuthStore } from './store/authStore.js';

function PrivateRoute({ children }) {
  const token = useAuthStore((state) => state.accessToken);
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/visualize" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute><HistoryPage /></PrivateRoute>} />
        <Route path="/history/:id" element={<PrivateRoute><VisualizerPage /></PrivateRoute>} />
        <Route path="/shared/:token" element={<SharedVizPage />} />
        <Route path="*" element={<main className="mx-auto max-w-5xl p-6"><h1 className="text-2xl font-semibold">Page not found</h1></main>} />
      </Routes>
    </div>
  );
}
