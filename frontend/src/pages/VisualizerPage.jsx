import { Share2 } from 'lucide-react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { getOne, shareVisualization } from '../api/algorithms.js';
import VisualizerCanvas from '../components/visualizer/VisualizerCanvas.jsx';
import { useVizStore } from '../store/vizStore.js';

export default function VisualizerPage() {
  const { id } = useParams();
  const setVizData = useVizStore((state) => state.setVizData);

  useEffect(() => {
    getOne(id).then((data) => setVizData(data.viz_data)).catch(() => toast.error('Could not load visualization'));
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
      <VisualizerCanvas />
    </main>
  );
}
