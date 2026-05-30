import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Sidebar({ items = [] }) {
  return (
    <aside className="rounded-lg bg-[var(--color-sidebar)] p-4 shadow-[var(--shadow-md)]">
      <div className="mb-3 flex items-center gap-2 pl-1 text-xs font-bold uppercase tracking-[0.1em] text-stone-400">
        <Clock className="h-4 w-4" /> Recent
      </div>
      <div className="space-y-2">
        {items.slice(0, 6).map((item) => (
          <Link key={item.id} className="sidebar-item block rounded-md px-3 py-2 text-sm" to={`/history/${item.id}`}>
            <span className="block truncate font-semibold text-[var(--color-text-inverse)]">{item.title || 'Untitled'}</span>
            <span className={`badge mt-1 badge-${item.algorithm_type || 'other'}`}>{item.algorithm_type}</span>
          </Link>
        ))}
        {items.length === 0 && <p className="px-3 py-2 text-sm text-stone-400">No saved runs yet.</p>}
      </div>
    </aside>
  );
}
