import { Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { getOne, shareVisualization } from '../api/algorithms.js';
import AiTutorPanel from '../components/tutor/AiTutorPanel.jsx';
import VisualizerCanvas from '../components/visualizer/VisualizerCanvas.jsx';
import { useVizStore } from '../store/vizStore.js';

export default function VisualizerPage() {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const [activeTab, setActiveTab] = useState('visualizer');
  const vizData = useVizStore((state) => state.vizData);
  const setVizData = useVizStore((state) => state.setVizData);

  useEffect(() => {
    getOne(id)
      .then((data) => {
        setDetail(data);
        setVizData(data.viz_data);
      })
      .catch(() => toast.error('Could not load visualization'));
  }, [id, setVizData]);

  async function share() {
    const response = await shareVisualization(id);
    await navigator.clipboard?.writeText(response.url);
    toast.success('Share link copied');
  }

  return (
    <main className="mx-auto max-w-6xl space-y-4 px-4 py-6">
      <div className="flex justify-end">
        <button className="focus-ring inline-flex items-center gap-2 bg-ink px-4 py-2 font-semibold text-white" onClick={share} type="button">
          <Share2 className="h-4 w-4" />Share
        </button>
      </div>
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
          disabled={!vizData || !detail}
          onClick={() => setActiveTab('tutor')}
          type="button"
        >
          AI Tutor
        </button>
      </div>
      {activeTab === 'visualizer' && <VisualizerCanvas />}
      {activeTab === 'tutor' && vizData && detail && (
        <AiTutorPanel
          visualizationId={id}
          vizData={vizData}
          provider={detail.llm_provider}
          model={detail.llm_model}
          onRetract={() => setActiveTab('visualizer')}
        />
      )}
    </main>
  );
}
