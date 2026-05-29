import { useEffect, useState } from 'react';
import { getHistory } from '../api/algorithms.js';
import AlgorithmInput from '../components/algorithm/AlgorithmInput.jsx';
import Sidebar from '../components/layout/Sidebar.jsx';
import VisualizerCanvas from '../components/visualizer/VisualizerCanvas.jsx';

export default function DashboardPage() {
  const [recent, setRecent] = useState([]);

  async function loadRecent() {
    const data = await getHistory({ limit: 6 });
    setRecent(data.items);
  }

  useEffect(() => {
    loadRecent().catch(() => setRecent([]));
  }, []);

  return (
    <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6 lg:grid-cols-[280px_1fr]">
      <Sidebar items={recent} />
      <div className="space-y-5">
        <AlgorithmInput onCreated={loadRecent} />
        <VisualizerCanvas />
      </div>
    </main>
  );
}
