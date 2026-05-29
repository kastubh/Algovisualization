import { useEffect, useState } from 'react';
import { getHistory } from '../api/algorithms.js';
import AlgorithmInput from '../components/algorithm/AlgorithmInput.jsx';
import Sidebar from '../components/layout/Sidebar.jsx';
import AiTutorPanel from '../components/tutor/AiTutorPanel.jsx';
import VisualizerCanvas from '../components/visualizer/VisualizerCanvas.jsx';
import { useVizStore } from '../store/vizStore.js';

export default function DashboardPage() {
  const [recent, setRecent] = useState([]);
  const [currentVisualizationId, setCurrentVisualizationId] = useState(null);
  const [selectedLlm, setSelectedLlm] = useState({ provider: 'openai', model: 'gpt-4o-mini' });
  const [activeTab, setActiveTab] = useState('visualizer');
  const vizData = useVizStore((state) => state.vizData);

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
        <AlgorithmInput
          onSelectionChange={setSelectedLlm}
          onCreated={(historyId) => {
            setCurrentVisualizationId(historyId);
            setActiveTab('visualizer');
            loadRecent();
          }}
        />
        <div className="flex gap-2 border-b border-black/10">
          <button
            className={`px-4 py-2 text-sm font-semibold ${activeTab === 'visualizer' ? 'border-b-2 border-coral text-coral' : 'text-ink/55'}`}
            onClick={() => setActiveTab('visualizer')}
            type="button"
          >
            Step Visualizer
          </button>
          <button
            className={`px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40 ${activeTab === 'tutor' ? 'border-b-2 border-coral text-coral' : 'text-ink/55'}`}
            disabled={!currentVisualizationId || !vizData}
            onClick={() => setActiveTab('tutor')}
            type="button"
          >
            AI Tutor
          </button>
        </div>
        {activeTab === 'visualizer' && <VisualizerCanvas />}
        {activeTab === 'tutor' && currentVisualizationId && vizData && (
          <AiTutorPanel
            visualizationId={currentVisualizationId}
            vizData={vizData}
            provider={selectedLlm.provider}
            model={selectedLlm.model}
            onRetract={() => setActiveTab('visualizer')}
          />
        )}
      </div>
    </main>
  );
}
