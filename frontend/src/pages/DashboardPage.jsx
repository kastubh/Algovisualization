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
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[280px_1fr]">
      <Sidebar items={recent} />
      <div className="space-y-6">
        <AlgorithmInput
          onSelectionChange={setSelectedLlm}
          onCreated={(historyId) => {
            setCurrentVisualizationId(historyId);
            setActiveTab('visualizer');
            loadRecent();
          }}
        />
        <div className="flex border-b border-[var(--color-border)]">
          <button
            className={`tab-btn ${activeTab === 'visualizer' ? 'active' : ''}`}
            onClick={() => setActiveTab('visualizer')}
            type="button"
          >
            Step Visualizer
          </button>
          <button
            className={`tab-btn disabled:cursor-not-allowed disabled:opacity-40 ${activeTab === 'tutor' ? 'active' : ''}`}
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
