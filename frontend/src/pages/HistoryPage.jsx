import { Search, Share2, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { deleteOne, getHistory, shareVisualization } from '../api/algorithms.js';

export default function HistoryPage() {
  const [data, setData] = useState({ items: [], total: 0, page: 1, pages: 1 });
  const [search, setSearch] = useState('');

  async function load(page = 1) {
    const response = await getHistory({ page, search: search || undefined });
    setData(response);
  }

  useEffect(() => {
    load().catch(() => setData({ items: [], total: 0, page: 1, pages: 1 }));
  }, []);

  async function share(id) {
    const response = await shareVisualization(id);
    await navigator.clipboard?.writeText(response.url);
    toast.success('Share link copied');
  }

  async function remove(id) {
    await deleteOne(id);
    toast.success('Deleted');
    load(data.page);
  }

  return (
    <main className="mx-auto max-w-6xl space-y-5 px-4 py-6">
      <form className="panel flex gap-2 rounded-md p-4" onSubmit={(event) => { event.preventDefault(); load(); }}>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/45" />
          <input className="focus-ring w-full border border-black/15 bg-white py-2 pl-9 pr-3" placeholder="Search history" value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
        <button className="focus-ring bg-ink px-4 py-2 font-semibold text-white" type="submit">Search</button>
      </form>
      <section className="panel divide-y divide-black/10 rounded-md">
        {data.items.map((item) => (
          <article key={item.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <Link to={`/history/${item.id}`} className="min-w-0">
              <h2 className="truncate font-semibold">{item.title || 'Untitled visualization'}</h2>
              <p className="text-sm text-ink/60">{item.algorithm_type} · {item.step_count || 0} steps</p>
            </Link>
            <div className="flex gap-2">
              <button className="focus-ring border border-black/15 bg-white p-2" onClick={() => share(item.id)} type="button" aria-label="Share"><Share2 className="h-4 w-4" /></button>
              <button className="focus-ring border border-black/15 bg-white p-2 text-coral" onClick={() => remove(item.id)} type="button" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
            </div>
          </article>
        ))}
        {data.items.length === 0 && <p className="p-4 text-sm text-ink/60">No history yet.</p>}
      </section>
    </main>
  );
}
