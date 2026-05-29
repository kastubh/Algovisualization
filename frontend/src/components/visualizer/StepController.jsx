import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';
import { useEffect } from 'react';
import { useVizStore } from '../../store/vizStore.js';

export default function StepController() {
  const { vizData, currentStep, isPlaying, play, pause, next, prev, reset } = useVizStore();
  const total = vizData?.steps?.length || 0;

  useEffect(() => {
    if (!isPlaying || !total) return undefined;
    const timer = window.setInterval(() => {
      const latest = useVizStore.getState();
      if (latest.currentStep >= total - 1) latest.pause();
      else latest.next();
    }, 1300);
    return () => window.clearInterval(timer);
  }, [isPlaying, total]);

  if (!vizData) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button className="focus-ring border border-black/15 bg-white p-2" onClick={prev} type="button" aria-label="Previous step"><ChevronLeft className="h-4 w-4" /></button>
      <button className="focus-ring bg-ink p-2 text-white" onClick={isPlaying ? pause : play} type="button" aria-label={isPlaying ? 'Pause' : 'Play'}>
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </button>
      <button className="focus-ring border border-black/15 bg-white p-2" onClick={next} type="button" aria-label="Next step"><ChevronRight className="h-4 w-4" /></button>
      <button className="focus-ring border border-black/15 bg-white p-2" onClick={reset} type="button" aria-label="Reset"><RotateCcw className="h-4 w-4" /></button>
      <span className="text-sm font-semibold text-ink/65">Step {Math.min(currentStep + 1, total)} of {total}</span>
    </div>
  );
}
