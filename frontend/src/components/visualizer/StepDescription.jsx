import { useVizStore } from '../../store/vizStore.js';

export default function StepDescription() {
  const { vizData, currentStep } = useVizStore();
  if (!vizData) return <p className="text-sm text-ink/60">Generate a visualization to inspect each step.</p>;
  const step = vizData.steps[currentStep];
  return (
    <div>
      <h2 className="text-xl font-semibold">{step.title}</h2>
      <p className="mt-1 text-sm leading-6 text-ink/70">{step.description}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
        <span className="bg-paper px-2 py-1">{vizData.algorithm_name}</span>
        <span className="bg-paper px-2 py-1">{vizData.time_complexity}</span>
        <span className="bg-paper px-2 py-1">{vizData.space_complexity}</span>
      </div>
    </div>
  );
}
