// Tutorial State Management
// Central state management for the tutorial experience

import type { XORInput } from '../demo/types';
import type {
  SectionId,
  TutorialState,
  TutorialStateListener,
  VisualizationState,
  PredictionResult,
  TrainingStep,
} from './types';
import { DEFAULT_TUTORIAL_STATE } from './types';

/**
 * T003 (009): Hint persistence utilities for interaction hints
 * Uses localStorage to remember if user has dismissed the hint
 */
const HINT_DISMISSED_KEY = 'nn-visualiser-hint-dismissed';

/**
 * Check if the interaction hint has been dismissed
 * @returns true if hint was previously dismissed
 */
export function isHintDismissed(): boolean {
  try {
    return localStorage.getItem(HINT_DISMISSED_KEY) === 'true';
  } catch {
    // localStorage unavailable (private browsing, etc.)
    return false;
  }
}

/**
 * Mark the interaction hint as dismissed
 */
export function dismissHint(): void {
  try {
    localStorage.setItem(HINT_DISMISSED_KEY, 'true');
  } catch {
    // Silently fail if localStorage unavailable
  }
}

/**
 * Factory function to create a tutorial state manager.
 * Returns an observable state object with subscribe/unsubscribe capability.
 */
export function createTutorialState() {
  let state: TutorialState = { ...DEFAULT_TUTORIAL_STATE };
  const listeners: Set<TutorialStateListener> = new Set();

  /**
   * Notify all listeners of state change
   */
  function notify(): void {
    const snapshot = { ...state };
    listeners.forEach((fn) => fn(snapshot));
  }

  return {
    /**
     * Get a snapshot of the current state
     */
    getState(): TutorialState {
      return { ...state };
    },

    /**
     * Update state with partial updates
     */
    setState(updates: Partial<TutorialState>): void {
      state = { ...state, ...updates };
      notify();
    },

    /**
     * Set the current active section
     */
    setCurrentSection(sectionId: SectionId): void {
      if (state.currentSection !== sectionId) {
        state = { ...state, currentSection: sectionId };
        notify();
      }
    },

    /**
     * Mark training as in progress
     */
    startTraining(): void {
      state = { ...state, trainingInProgress: true };
      notify();
    },

    /**
     * Mark training as complete
     */
    completeTraining(): void {
      state = {
        ...state,
        trainingInProgress: false,
        trainingCompleted: true,
      };
      notify();
    },

    /**
     * Stop training (pause, not complete)
     */
    stopTraining(): void {
      state = { ...state, trainingInProgress: false };
      notify();
    },

    /**
     * Increment guided steps completed counter
     */
    incrementGuidedStep(): void {
      state = {
        ...state,
        guidedStepsCompleted: state.guidedStepsCompleted + 1,
      };
      notify();
    },

    /**
     * Set the selected input for inference demonstration
     */
    setInferenceInput(input: XORInput): void {
      state = { ...state, selectedInferenceInput: input };
      notify();
    },

    /**
     * Check if network has been trained
     * T003: Use trainingIterations > 0 for robust detection
     */
    isNetworkTrained(): boolean {
      return state.trainingIterations > 0;
    },

    /**
     * T003: Increment training iterations counter
     */
    incrementTrainingIterations(): void {
      state = { ...state, trainingIterations: state.trainingIterations + 1 };
      notify();
    },

    /**
     * T004: Set the current visualization state
     */
    setVisualizationState(vizState: VisualizationState): void {
      state = { ...state, currentVisualization: vizState };
      notify();
    },

    /**
     * T005: Set the last prediction result
     */
    setLastPrediction(prediction: PredictionResult | null): void {
      state = { ...state, lastPrediction: prediction };
      notify();
    },

    /**
     * T002 (009): Set the current training step for animation sync
     */
    setCurrentTrainingStep(step: TrainingStep | null): void {
      state = { ...state, currentTrainingStep: step };
      notify();
    },

    /**
     * Subscribe to state changes
     * @returns Unsubscribe function
     */
    subscribe(listener: TutorialStateListener): () => void {
      listeners.add(listener);
      // Immediately call with current state
      listener({ ...state });
      return () => listeners.delete(listener);
    },

    /**
     * Reset state to initial values
     */
    reset(): void {
      state = { ...DEFAULT_TUTORIAL_STATE };
      notify();
    },
  };
}

/**
 * Type for the tutorial state manager instance
 */
export type TutorialStateManager = ReturnType<typeof createTutorialState>;
