import { Loader2, Undo2, Wand2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { generateTutorScript } from '../../api/tutor.js';
import { useTutorPlayer } from '../../hooks/useTutorPlayer.js';
import AvatarAnimator from './AvatarAnimator.jsx';
import CaptionBar from './CaptionBar.jsx';
import TutorVideoControls from './TutorVideoControls.jsx';

function SyncedArrayRenderer({ vizData, currentStep }) {
  const step = vizData?.steps?.[currentStep];
  const data = step?.state?.data || vizData?.initial_state?.data || [];
  const max = Math.max(...data, 1);
  return (
    <div className="flex h-64 items-end gap-2 border-b border-black/10 px-2 sm:gap-3 sm:px-6">
      {data.map((value, index) => {
        const highlighted = step?.highlights?.includes(index);
        return (
          <div className="flex min-w-0 flex-1 flex-col items-center gap-2" key={`${index}-${value}`}>
            <div className={`w-full transition-all duration-500 ${highlighted ? 'bg-coral' : 'bg-mint'}`} style={{ height: `${Math.max(24, (value / max) * 220)}px` }} />
            <span className="text-xs font-semibold">{value}</span>
          </div>
        );
      })}
    </div>
  );
}

function SyncedTextRenderer({ vizData, currentStep }) {
  const step = vizData?.steps?.[currentStep];
  return (
    <div className="min-h-64 border border-dashed border-black/15 bg-paper p-4">
      <h3 className="font-semibold">{step?.title || vizData?.algorithm_name}</h3>
      <p className="mt-2 text-sm leading-6 text-ink/70">{step?.description || vizData?.description}</p>
    </div>
  );
}

function SyncedRenderer({ vizData, currentStep }) {
  if (['sorting', 'searching', 'linked_list'].includes(vizData?.algorithm_type)) {
    return <SyncedArrayRenderer vizData={vizData} currentStep={currentStep} />;
  }
  return <SyncedTextRenderer vizData={vizData} currentStep={currentStep} />;
}

export default function AiTutorPanel({ visualizationId, vizData, provider, model, onRetract }) {
  const [tutorScript, setTutorScript] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [syncedStep, setSyncedStep] = useState(0);
  const player = useTutorPlayer(tutorScript, setSyncedStep);
  const stepLabel =
    player.currentStepIndex < 0
      ? tutorScript?.algorithm_name || vizData?.algorithm_name || 'Ready'
      : player.currentStepIndex >= (tutorScript?.steps.length || 0)
        ? 'Summary'
        : tutorScript?.steps[player.currentStepIndex]?.key_highlight || `Step ${player.currentStepIndex + 1}`;
  const activeVizStep = vizData?.steps?.[syncedStep];
  const boardNote = {
    action: activeVizStep?.action || tutorScript?.steps?.[player.currentStepIndex]?.emphasis_words?.[0] || 'Explain',
    focus:
      activeVizStep?.highlights?.length > 0
        ? `Index ${activeVizStep.highlights.join(', ')}`
        : tutorScript?.steps?.[player.currentStepIndex]?.key_highlight || 'Current idea',
    description: activeVizStep?.description || vizData?.description,
  };

  async function handleGenerateScript() {
    if (!visualizationId) return;
    setIsGenerating(true);
    try {
      const script = await generateTutorScript(visualizationId, { provider, model, voice_style: 'friendly' });
      setTutorScript(script);
      toast.success('AI Tutor script ready');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Could not generate AI Tutor script');
    } finally {
      setIsGenerating(false);
    }
  }

  function retract() {
    player.stop();
    onRetract?.();
  }

  if (!tutorScript) {
    return (
      <section className="panel rounded-md p-5">
        <div className="mb-4 flex justify-end">
          <button className="focus-ring inline-flex items-center gap-2 border border-black/15 bg-white px-3 py-2 text-sm font-semibold" onClick={retract} type="button">
            <Undo2 className="h-4 w-4" /> Retract
          </button>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <p className="max-w-md text-center text-sm leading-6 text-ink/65">
            Generate a spoken AI tutor walkthrough. The current step visualizer stays unchanged in its own tab.
          </p>
          <button className="focus-ring inline-flex items-center gap-2 bg-coral px-5 py-3 font-semibold text-white disabled:opacity-60" disabled={isGenerating} onClick={handleGenerateScript} type="button">
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            {isGenerating ? 'Generating Script...' : 'Generate AI Tutor Video'}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="panel space-y-5 rounded-md p-5">
      <div className="flex justify-end">
        <button className="focus-ring inline-flex items-center gap-2 border border-black/15 bg-white px-3 py-2 text-sm font-semibold" onClick={retract} type="button">
          <Undo2 className="h-4 w-4" /> Retract
        </button>
      </div>
      <div className="space-y-3">
        <AvatarAnimator
          isSpeaking={player.isPlaying}
          name="Alex"
          currentCaption={player.currentCaption}
          currentStepLabel={stepLabel}
          boardNote={boardNote}
        />
        <CaptionBar text={player.currentCaption || 'Press Start to begin the AI Tutor explanation'} isVisible />
        <p className="text-center text-xs font-semibold text-ink/45">Total duration ~{Math.max(1, Math.ceil(tutorScript.total_estimated_seconds / 60))} min</p>
      </div>
      <div className="border border-black/10 bg-white p-4">
        <p className="mb-3 text-xs font-bold uppercase text-ink/45">Live Visualization Synced To Tutor</p>
        <SyncedRenderer vizData={vizData} currentStep={syncedStep} />
      </div>
      <TutorVideoControls
        isPlaying={player.isPlaying}
        hasStarted={player.hasStarted}
        onPlay={player.play}
        onPause={player.pause}
        onResume={player.resume}
        onReplay={player.replay}
        currentStep={player.currentStepIndex}
        totalSteps={tutorScript.steps.length}
      />
    </section>
  );
}
