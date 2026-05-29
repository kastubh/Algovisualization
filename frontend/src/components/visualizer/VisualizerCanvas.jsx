import StepController from './StepController.jsx';
import StepDescription from './StepDescription.jsx';
import { useVizStore } from '../../store/vizStore.js';
import { getVisualizer } from '../../utils/vizRenderer.js';

export default function VisualizerCanvas() {
  const vizData = useVizStore((state) => state.vizData);
  const Visualizer = getVisualizer(vizData?.algorithm_type);

  return (
    <section className="panel rounded-md p-5">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <StepDescription />
        <StepController />
      </div>
      {vizData ? <Visualizer /> : <div className="grid h-80 place-items-center border border-dashed border-black/20 text-sm text-ink/55">No visualization loaded</div>}
    </section>
  );
}
