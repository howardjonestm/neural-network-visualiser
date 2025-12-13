// Tutorial Module Type Definitions
// Types for scroll-based tutorial sections and state management

import type { XORInput } from '../demo/types';

/**
 * T004: Visualization states for Understanding Training animations
 */
export type VisualizationState =
  | 'idle'
  | 'forward-pass-animating'
  | 'loss-highlighting'
  | 'backprop-animating';

/**
 * T002 (009): Training step type for animation synchronization
 */
export type TrainingStep = 'forward-pass' | 'calculate-loss' | 'backpropagation';

/**
 * T005: Prediction result for prominent inference display
 */
export interface PredictionResult {
  input: [number, number];
  expected: number;
  predicted: number;
  isCorrect: boolean;
  threshold: number;
}

/**
 * Section identifiers for the four tutorial sections
 */
export type SectionId = 'objectives' | 'training' | 'tour' | 'inference';

/**
 * All section IDs in order
 */
export const SECTION_IDS: SectionId[] = ['objectives', 'training', 'tour', 'inference'];

/**
 * Section display names
 */
export const SECTION_NAMES: Record<SectionId, string> = {
  objectives: 'Objectives',
  training: 'Training',
  tour: 'Trained Network',
  inference: 'Inference',
};

/**
 * A distinct phase of the learning journey with associated content,
 * visualizations, and interactions.
 */
export interface TutorialSection {
  id: SectionId;
  element: HTMLElement;
  isVisible: boolean;
  isActive: boolean;
  onActivate?: () => void;
  onDeactivate?: () => void;
}

/**
 * Central state management for the tutorial experience.
 */
export interface TutorialState {
  currentSection: SectionId;
  trainingCompleted: boolean;
  trainingInProgress: boolean;
  guidedStepsCompleted: number;
  selectedInferenceInput: XORInput;
  /** T003: Track actual training iterations for robust detection */
  trainingIterations: number;
  /** T004: Current visualization state for Understanding Training */
  currentVisualization: VisualizationState;
  /** T005: Prominent prediction result */
  lastPrediction: PredictionResult | null;
  /** T002 (009): Current training step for animation sync */
  currentTrainingStep: TrainingStep | null;
}

/**
 * Default initial state
 */
export const DEFAULT_TUTORIAL_STATE: TutorialState = {
  currentSection: 'objectives',
  trainingCompleted: false,
  trainingInProgress: false,
  guidedStepsCompleted: 0,
  selectedInferenceInput: [0, 0],
  trainingIterations: 0,
  currentVisualization: 'idle',
  lastPrediction: null,
  currentTrainingStep: null,
};

/**
 * Tracks user's position within the tutorial
 */
export interface ScrollProgress {
  totalSections: number;
  currentSectionIndex: number;
  sectionProgress: number;
  overallProgress: number;
}

/**
 * An educational concept with definition and optional extended explanation.
 */
export interface KeyTerm {
  id: string;
  term: string;
  shortDefinition: string;
  extendedExplanation?: string;
  mathFormula?: string;
  relatedTerms?: string[];
  firstAppearance: SectionId;
}

/**
 * A discrete step in the guided training sequence.
 */
export interface TrainingGuidedStep {
  stepNumber: number;
  description: string;
  explanation: string;
  termsIntroduced: string[];
  animationDuration: number;
  showMathOption: boolean;
}

/**
 * Listener type for tutorial state changes
 */
export type TutorialStateListener = (state: TutorialState) => void;

/**
 * Section callback for activation/deactivation events
 */
export type SectionCallback = (sectionId: SectionId) => void;
