import { Loader2, Pause, Play, RotateCcw, SkipBack, SkipForward, Undo2, Wand2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { generateTutorScript } from '../../api/tutor.js';
import { useBoardOrchestrator } from '../../hooks/useBoardOrchestrator.js';
import TeacherFigure from './TeacherFigure.jsx';
import ArrayOnBoard from './board/ArrayOnBoard.jsx';
import BoardTextWriter from './board/BoardTextWriter.jsx';
import ChalkBoard from './board/ChalkBoard.jsx';
import ChalkUnderline from './board/ChalkUnderline.jsx';
import GraphOnBoard from './board/GraphOnBoard.jsx';
import TreeOnBoard from './board/TreeOnBoard.jsx';

function BoardVisualization({ boardState, isErasing }) {
  if (!boardState) return null;
  if (boardState.algorithmType === 'tree') {
    return <TreeOnBoard data={boardState.data} highlights={boardState.highlightIndices} />;
  }
  if (boardState.algorithmType === 'graph') {
    return <GraphOnBoard data={boardState.data} highlights={boardState.highlightIndices} />;
  }
  if (Array.isArray(boardState.data)) {
    return (
      <ArrayOnBoard
        array={boardState.data}
        highlightIndices={boardState.highlightIndices}
        swapIndices={boardState.swapIndices}
        pointers={boardState.pointers}
        isVisible={!isErasing}
      />
    );
  }
  return (
    <div className="my-5 border border-white/20 bg-white/5 p-4 text-xl text-chalk">
      {boardState.descriptionLines?.[0] || 'This step is explained in the transcript below.'}
    </div>
  );
}

function GenerateScriptPrompt({ isGenerating, onGenerate, onRetract }) {
  return (
    <section className="card-raised p-5">
      <div className="mb-4 flex justify-end">
        <button className="focus-ring inline-flex items-center gap-2 border border-black/15 bg-white px-3 py-2 text-sm font-semibold" onClick={onRetract} type="button">
          <Undo2 className="h-4 w-4" /> Retract
        </button>
      </div>
      <div
        className="flex flex-col items-center justify-center gap-4 border border-dashed border-[var(--color-border)] px-6 py-16 text-center"
        style={{
          borderRadius: 'var(--radius-xl)',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(229,65,42,0.05) 0%, transparent 70%)',
        }}
      >
        <div className="text-4xl">AI</div>
        <div>
          <p className="font-display mb-2 text-xl font-bold text-[var(--color-text-primary)]">Generate AI Tutor Video</p>
          <p className="max-w-sm text-sm text-[var(--color-text-secondary)]">
            Your AI tutor will walk through every step with voice narration and animated explanations on the digital chalkboard.
          </p>
        </div>
        <p className="max-w-md text-center text-sm leading-6 text-ink/65">
          Generate a YouTube-style chalkboard lesson. The teacher writes each step, points to highlights, and speaks through the algorithm.
        </p>
        <button className="btn-primary focus-ring px-8 py-3 text-[0.95rem] disabled:opacity-60" disabled={isGenerating} onClick={onGenerate} type="button">
          {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
          {isGenerating ? 'Preparing Chalkboard Lesson...' : 'Generate Chalkboard Lesson'}
        </button>
      </div>
    </section>
  );
}

export default function AiTutorPanel({ visualizationId, vizData, provider, model, onRetract }) {
  const [tutorScript, setTutorScript] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const board = useBoardOrchestrator(tutorScript, vizData);

  async function handleGenerateScript() {
    if (!visualizationId) return;
    setIsGenerating(true);
    try {
      const script = await generateTutorScript(visualizationId, { provider, model, voice_style: 'friendly' });
      setTutorScript(script);
      toast.success('Chalkboard lesson ready');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Could not generate AI Tutor script');
    } finally {
      setIsGenerating(false);
    }
  }

  function retract() {
    board.stop();
    onRetract?.();
  }

  if (!tutorScript) {
    return <GenerateScriptPrompt isGenerating={isGenerating} onGenerate={handleGenerateScript} onRetract={retract} />;
  }

  const stepNumber = Math.min(board.currentStepIndex + 1, Math.max(board.totalSteps, 1));
  const titleKey = `${board.currentStepIndex}-${board.boardState?.topicLabel || ''}`;

  return (
    <section className="card-raised space-y-4 p-4 sm:p-5">
      <div className="flex justify-end">
        <button className="focus-ring inline-flex items-center gap-2 border border-black/15 bg-white px-3 py-2 text-sm font-semibold" onClick={retract} type="button">
          <Undo2 className="h-4 w-4" /> Retract
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[170px_1fr] lg:items-end">
        <TeacherFigure
          isSpeaking={board.isSpeaking}
          pointDirection={board.teacherPointDirection}
          emotion={board.boardState?.action === 'swap' ? 'excited' : 'neutral'}
        />

        <ChalkBoard isErasing={board.isErasing}>
          <div className="relative min-h-[360px]">
            <div className="mb-4 flex flex-wrap items-center gap-3 pr-20">
              <span className="bg-white/15 px-3 py-1 text-sm font-bold uppercase tracking-widest text-chalk">Topic</span>
              <BoardTextWriter key={titleKey} text={`${board.boardState?.topicLabel || vizData?.algorithm_name || 'Algorithm'} - Step ${stepNumber} of ${board.totalSteps}`} speed={24} className="text-3xl font-bold" />
            </div>

            <BoardVisualization boardState={board.boardState} isErasing={board.isErasing} />

            <div className="mt-4 space-y-2">
              {(board.boardState?.descriptionLines || []).map((line, index) => (
                <BoardTextWriter key={`${board.currentStepIndex}-${index}-${line}`} text={line} prefix="> " speed={24} delay={index * 350} className="text-2xl" />
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-3 text-lg">
              {board.boardState?.action && (
                <span className="border border-white/25 px-3 py-1 text-[#86EFAC]">Action: {board.boardState.action}</span>
              )}
              {board.boardState?.timeComplexity && (
                <span className="border border-white/25 px-3 py-1 text-[#86EFAC]">Time {board.boardState.timeComplexity}</span>
              )}
              {board.boardState?.spaceComplexity && (
                <span className="border border-white/25 px-3 py-1 text-[#93C5FD]">Space {board.boardState.spaceComplexity}</span>
              )}
            </div>
            <ChalkUnderline width={160} />

            <div className="absolute right-2 top-2 text-lg text-white/45">Step {stepNumber}/{board.totalSteps}</div>
          </div>
        </ChalkBoard>
      </div>

      <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]" style={{ borderRadius: 'var(--radius-lg)' }}>
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Teacher Explanation</p>
        <p className="text-base leading-7 text-[var(--color-text-primary)]">{board.currentCaption || board.boardState?.spokenText || 'Press Play to start the chalkboard explanation.'}</p>
      </div>

      <div className="flex flex-col gap-4 border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3 shadow-[var(--shadow-sm)] sm:flex-row sm:items-center sm:justify-between" style={{ borderRadius: 'var(--radius-lg)' }}>
        <div className="flex flex-wrap items-center gap-2">
          <button className="btn-secondary focus-ring px-3 py-2 text-sm" onClick={board.prevStep} type="button">
            <SkipBack className="h-4 w-4" /> Prev
          </button>
          {board.isPlaying ? (
            <button className="focus-ring inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-sidebar)] px-5 py-2 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(0,0,0,0.2)]" onClick={board.pause} type="button">
              <Pause className="h-4 w-4" /> Pause
            </button>
          ) : board.hasStarted ? (
            <button className="focus-ring inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-sidebar)] px-5 py-2 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(0,0,0,0.2)]" onClick={board.resume} type="button">
              <Play className="h-4 w-4" /> Resume
            </button>
          ) : (
            <button className="btn-primary focus-ring px-5 py-2 text-sm" onClick={board.play} type="button">
              <Play className="h-4 w-4" /> Play
            </button>
          )}
          <button className="btn-secondary focus-ring px-3 py-2 text-sm" onClick={board.nextStep} type="button">
            Next <SkipForward className="h-4 w-4" />
          </button>
          <button className="btn-secondary focus-ring px-3 py-2 text-sm" onClick={board.replay} type="button">
            <RotateCcw className="h-4 w-4" /> Replay
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {Array.from({ length: board.totalSteps }).map((_, index) => (
            <span key={index} className={`step-dot ${index === board.currentStepIndex ? 'current' : index < board.currentStepIndex ? 'done' : ''}`} />
          ))}
        </div>
        <span className="text-sm font-semibold text-ink/45">~{Math.max(1, Math.ceil(tutorScript.total_estimated_seconds / 60))} min</span>
      </div>
    </section>
  );
}
