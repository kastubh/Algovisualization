import { History, LayoutDashboard, LogOut, Sparkles } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';

export default function Navbar() {
  const { accessToken, logout } = useAuthStore();
  const navigate = useNavigate();
  const navClass = ({ isActive }) =>
    `inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text-primary)]'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-nav)] shadow-[var(--shadow-sm)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to={accessToken ? '/dashboard' : '/'} className="font-display flex items-center gap-2 text-[1.35rem] font-bold tracking-[-0.02em] text-[var(--color-text-primary)]">
          <Sparkles className="h-5 w-5 text-[var(--color-accent)]" />
          Algo<span className="text-[var(--color-accent)]">Viz</span>
        </Link>
        <nav className="flex items-center gap-1">
          {accessToken ? (
            <>
              <NavLink to="/dashboard" className={navClass}><LayoutDashboard className="h-4 w-4" />Dashboard</NavLink>
              <NavLink to="/history" className={navClass}><History className="h-4 w-4" />History</NavLink>
              <button
                className="focus-ring inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text-primary)]"
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
              <NavLink to="/register" className="btn-primary focus-ring px-4 py-2 text-sm">Get Started</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
