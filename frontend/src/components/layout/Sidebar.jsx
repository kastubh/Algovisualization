import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Sidebar({ items = [] }) {
  return (
    <aside className="panel rounded-md p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink/70">
        <Clock className="h-4 w-4" /> Recent
      </div>
      <div className="space-y-2">
        {items.slice(0, 6).map((item) => (
          <Link key={item.id} className="block border border-black/10 bg-paper px-3 py-2 text-sm hover:border-mint" to={`/history/${item.id}`}>
            <span className="block truncate font-semibold">{item.title || 'Untitled'}</span>
            <span className="text-xs text-ink/55">{item.algorithm_type}</span>
          </Link>
        ))}
        {items.length === 0 && <p className="text-sm text-ink/55">No saved runs yet.</p>}
      </div>
    </aside>
  );
}
