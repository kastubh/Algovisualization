import { History, LayoutDashboard, LogOut, Sparkles } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';

export default function Navbar() {
  const { accessToken, logout } = useAuthStore();
  const navigate = useNavigate();
  const navClass = ({ isActive }) => `inline-flex items-center gap-2 px-3 py-2 text-sm font-medium ${isActive ? 'text-mint' : 'text-ink/70 hover:text-ink'}`;

  return (
    <header className="border-b border-black/10 bg-paper/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to={accessToken ? '/dashboard' : '/'} className="flex items-center gap-2 text-lg font-bold">
          <Sparkles className="h-5 w-5 text-coral" />
          AlgoViz
        </Link>
        <nav className="flex items-center gap-1">
          {accessToken ? (
            <>
              <NavLink to="/dashboard" className={navClass}><LayoutDashboard className="h-4 w-4" />Dashboard</NavLink>
              <NavLink to="/history" className={navClass}><History className="h-4 w-4" />History</NavLink>
              <button
                className="focus-ring inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-ink/70 hover:text-ink"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                type="button"
              >
                <LogOut className="h-4 w-4" />Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navClass}>Login</NavLink>
              <NavLink to="/register" className="focus-ring bg-ink px-4 py-2 text-sm font-semibold text-white">Get Started</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
