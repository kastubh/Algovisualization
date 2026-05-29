import { Pause, Play, RotateCcw } from 'lucide-react';

export default function TutorVideoControls({ isPlaying, onPlay, onPause, onResume, onReplay, currentStep, totalSteps, hasStarted }) {
  const label = currentStep < 0 ? 'Intro' : currentStep >= totalSteps ? 'Done' : `Step ${currentStep + 1} of ${totalSteps}`;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <button className="focus-ring border border-black/15 bg-white p-2 text-ink/70" onClick={onReplay} type="button" aria-label="Replay from start">
        <RotateCcw className="h-4 w-4" />
      </button>
      {!hasStarted ? (
        <button className="focus-ring inline-flex items-center gap-2 bg-coral px-5 py-2 font-semibold text-white" onClick={onPlay} type="button">
          <Play className="h-4 w-4" /> Start AI Tutor
        </button>
      ) : isPlaying ? (
        <button className="focus-ring inline-flex items-center gap-2 bg-ink px-5 py-2 font-semibold text-white" onClick={onPause} type="button">
          <Pause className="h-4 w-4" /> Pause
        </button>
      ) : (
        <button className="focus-ring inline-flex items-center gap-2 bg-ink px-5 py-2 font-semibold text-white" onClick={onResume} type="button">
          <Play className="h-4 w-4" /> Resume
        </button>
      )}
      <span className="text-sm font-semibold text-ink/60">{label}</span>
    </div>
  );
}
