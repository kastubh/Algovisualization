import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTutorPlayer } from './useTutorPlayer.js';

const ERASE_EVERY_N_STEPS = 4;

function pointerPositions(highlights = []) {
  const names = ['i', 'j', 'k'];
  return highlights.slice(0, 3).reduce((acc, value, index) => {
    acc[names[index]] = value;
    return acc;
  }, {});
}

function stateData(vizStep, vizData) {
  return vizStep?.state?.data || vizData?.initial_state?.data || [];
}

function buildBoardState(stepIndex, tutorScript, vizData) {
  const vizStep = vizData?.steps?.[stepIndex];
  const tutorStep = tutorScript?.steps?.[stepIndex];
  if (!vizStep) return null;
  const data = stateData(vizStep, vizData);
  return {
    topicLabel: vizStep.title || tutorStep?.key_highlight || vizData?.algorithm_name || 'Algorithm',
    descriptionLines: [vizStep.description].filter(Boolean),
    spokenText: tutorStep?.spoken_text || vizStep.description || '',
    algorithmType: vizData?.algorithm_type,
    data,
    highlightIndices: vizStep.highlights || [],
    swapIndices: vizStep.swap || [],
    pointers: pointerPositions(vizStep.highlights || []),
    action: vizStep.action,
    timeComplexity: vizData?.time_complexity,
    spaceComplexity: vizData?.space_complexity,
  };
}

export function useBoardOrchestrator(tutorScript, vizData) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isErasing, setIsErasing] = useState(false);
  const [boardState, setBoardState] = useState(() => buildBoardState(0, tutorScript, vizData));
  const totalSteps = vizData?.steps?.length || 0;

  const applyStepToBoard = useCallback(
    (stepIndex) => {
      const nextIndex = Math.max(0, Math.min(stepIndex, Math.max(totalSteps - 1, 0)));
      setBoardState(buildBoardState(nextIndex, tutorScript, vizData));
      setCurrentStepIndex(nextIndex);
    },
    [totalSteps, tutorScript, vizData],
  );

  const handleStepChange = useCallback(
    (stepIndex) => {
      const shouldErase = stepIndex > 0 && stepIndex % ERASE_EVERY_N_STEPS === 0;
      if (shouldErase) {
        setIsErasing(true);
        window.setTimeout(() => {
          setIsErasing(false);
          applyStepToBoard(stepIndex);
        }, 850);
      } else {
        applyStepToBoard(stepIndex);
      }
    },
    [applyStepToBoard],
  );

  const player = useTutorPlayer(tutorScript, handleStepChange);

  useEffect(() => {
    applyStepToBoard(0);
  }, [applyStepToBoard]);

  const teacherPointDirection = useMemo(() => {
    const highlights = boardState?.highlightIndices || [];
    const arrayLength = Array.isArray(boardState?.data) ? boardState.data.length : 0;
    if (!highlights.length || !arrayLength) return 'center';
    const avg = highlights.reduce((sum, index) => sum + Number(index || 0), 0) / highlights.length;
    const ratio = avg / Math.max(arrayLength - 1, 1);
    if (ratio < 0.34) return 'left';
    if (ratio > 0.66) return 'right';
    return 'center';
  }, [boardState]);

  function nextStep() {
    player.stop();
    handleStepChange(Math.min(currentStepIndex + 1, Math.max(totalSteps - 1, 0)));
  }

  function prevStep() {
    player.stop();
    handleStepChange(Math.max(currentStepIndex - 1, 0));
  }

  return {
    boardState,
    isErasing,
    teacherPointDirection,
    isPlaying: player.isPlaying,
    isSpeaking: player.isPlaying,
    hasStarted: player.hasStarted,
    currentCaption: player.currentCaption,
    currentStepIndex,
    totalSteps,
    play: player.play,
    pause: player.pause,
    resume: player.resume,
    replay: player.replay,
    stop: player.stop,
    nextStep,
    prevStep,
  };
}
