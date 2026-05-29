import { create } from 'zustand';

export const useVizStore = create((set, get) => ({
  vizData: null,
  currentStep: 0,
  isPlaying: false,
  setVizData(vizData) {
    set({ vizData, currentStep: 0, isPlaying: false });
  },
  play() {
    set({ isPlaying: true });
  },
  pause() {
    set({ isPlaying: false });
  },
  next() {
    const steps = get().vizData?.steps || [];
    set({ currentStep: Math.min(get().currentStep + 1, Math.max(steps.length - 1, 0)) });
  },
  prev() {
    set({ currentStep: Math.max(get().currentStep - 1, 0) });
  },
  reset() {
    set({ currentStep: 0, isPlaying: false });
  },
}));
