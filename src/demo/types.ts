// Demo Module Type Definitions
// Forward pass demonstration types and configuration

import type { LayerType } from '../network/types';

// T002: DemoMode, DemoSpeed, DemoState types
export type DemoMode = 'idle' | 'running' | 'paused' | 'step-through';

export type DemoSpeed = 'slow' | 'medium' | 'fast';

export interface DemoState {
  mode: DemoMode;
  currentStepIndex: number;
  totalSteps: number;
  selectedInput: XORInput;
  speed: DemoSpeed;
  steps: DemoStep[];
  interruptedTraining: boolean;
}

export const DEFAULT_DEMO_STATE: DemoState = {
  mode: 'idle',
  currentStepIndex: 0,
  totalSteps: 5, // 5 layers in network
  selectedInput: [0, 0],
  speed: 'medium',
  steps: [],
  interruptedTraining: false,
};

// T003: DemoStep, NeuronCalculation interfaces
export interface NeuronCalculation {
  neuronId: string;
  inputs: { sourceId: string; activation: number; weight: number }[];
  bias: number;
  weightedSum: number;
  preActivation: number;
  postActivation: number;
  formula: string; // Pre-formatted display string
}

export interface DemoStep {
  layerIndex: number;
  layerType: LayerType;
  layerLabel: string; // "Input", "Hidden 1", etc.
  neurons: NeuronCalculation[];
  isComplete: boolean;
}

// T004: XORInput, XOR_INPUTS, XOR_EXPECTED constants
export type XORInput = [number, number];

export const XOR_INPUTS: XORInput[] = [
  [0, 0],
  [0, 1],
  [1, 0],
  [1, 1],
];

export const XOR_EXPECTED: Record<string, number> = {
  '0,0': 0,
  '0,1': 1,
  '1,0': 1,
  '1,1': 0,
};

// T005: DemoSpeedConfig, SPEED_CONFIGS constants
export interface DemoSpeedConfig {
  layerDuration: number; // milliseconds per layer
  pulseDuration: number; // milliseconds for pulse travel
  label: string;
}

export const SPEED_CONFIGS: Record<DemoSpeed, DemoSpeedConfig> = {
  slow: { layerDuration: 3000, pulseDuration: 2000, label: 'Slow' },
  medium: { layerDuration: 2000, pulseDuration: 1200, label: 'Medium' },
  fast: { layerDuration: 1000, pulseDuration: 600, label: 'Fast' },
};

// T006: SignalPosition, SignalAnimation interfaces
export interface SignalPosition {
  x: number;
  y: number;
}

export interface SignalAnimation {
  fromNeuronId: string;
  toNeuronId: string;
  startPosition: SignalPosition;
  endPosition: SignalPosition;
  progress: number; // 0 to 1
  weightValue: number; // For color indication
}

// Listener type for state changes
export type DemoStateListener = (state: DemoState) => void;
