import { useEffect, useRef, useState } from 'react';

export function useTutorPlayer(tutorScript, onStepChange) {
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentCaption, setCurrentCaption] = useState('');
  const synthRef = useRef(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis || null;
    return () => synthRef.current?.cancel();
  }, []);

  function buildQueue() {
    if (!tutorScript) return [];
    return [
      { text: tutorScript.intro_text, stepIndex: -1 },
      ...tutorScript.steps.map((step, index) => ({
        text: step.spoken_text,
        stepIndex: index,
        caption: step.key_highlight,
      })),
      { text: tutorScript.outro_text, stepIndex: tutorScript.steps.length },
    ];
  }

  function speakQueue(startFrom = 0) {
    const synth = synthRef.current;
    const queue = buildQueue();
    if (!synth || queue.length === 0) return;
    synth.cancel();

    function speakItem(index) {
      if (index >= queue.length) {
        setIsPlaying(false);
        return;
      }
      const item = queue[index];
      const utterance = new SpeechSynthesisUtterance(item.text);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.volume = 1;
      utterance.onstart = () => {
        setHasStarted(true);
        setIsPlaying(true);
        setCurrentStepIndex(item.stepIndex);
        setCurrentCaption(item.caption || item.text);
        if (item.stepIndex >= 0 && item.stepIndex < (tutorScript?.steps.length || 0)) {
          onStepChange?.(item.stepIndex);
        }
      };
      utterance.onend = () => speakItem(index + 1);
      utterance.onerror = () => setIsPlaying(false);
      synth.speak(utterance);
    }

    speakItem(startFrom);
  }

  function play() {
    speakQueue(0);
  }

  function pause() {
    synthRef.current?.pause();
    setIsPlaying(false);
  }

  function resume() {
    synthRef.current?.resume();
    setIsPlaying(true);
  }

  function replay() {
    speakQueue(0);
  }

  function jumpToStep(stepIndex) {
    speakQueue(stepIndex + 1);
  }

  function stop() {
    synthRef.current?.cancel();
    setIsPlaying(false);
  }

  return { currentStepIndex, isPlaying, hasStarted, currentCaption, play, pause, resume, replay, jumpToStep, stop };
}
