import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { getShared } from '../api/algorithms.js';
import VisualizerCanvas from '../components/visualizer/VisualizerCanvas.jsx';
import { useVizStore } from '../store/vizStore.js';

export default function SharedVizPage() {
  const { token } = useParams();
  const setVizData = useVizStore((state) => state.setVizData);

  useEffect(() => {
    getShared(token).then((data) => setVizData(data.viz_data)).catch(() => toast.error('Shared visualization not found'));
  }, [token, setVizData]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <VisualizerCanvas />
    </main>
  );
}
