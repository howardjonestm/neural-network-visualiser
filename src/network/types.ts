// Neural Network Type Definitions

export type LayerType = 'input' | 'hidden' | 'output';

export interface Neuron {
  id: string;
  layerIndex: number;
  positionInLayer: number;
  bias: number;
  activation: number;
  preActivation: number;
  delta: number;
}

export interface Layer {
  index: number;
  type: LayerType;
  neurons: Neuron[];
  size: number;
}

export interface Weight {
  id: string;
  fromNeuronId: string;
  toNeuronId: string;
  value: number;
  gradient: number;
}

export interface Network {
  layers: Layer[];
  weights: Weight[];
  architecture: number[];
}

export interface TrainingConfig {
  learningRate: number;
  isPlaying: boolean;
  stepCount: number;
  currentLoss: number;
  previousLoss: number;
}

export interface TrainingSample {
  inputs: number[];
  expected: number[];
}

export const DEFAULT_TRAINING_CONFIG: TrainingConfig = {
  learningRate: 0.5,
  isPlaying: false,
  stepCount: 0,
  currentLoss: 1.0,
  previousLoss: 1.0,
};

export const XOR_DATA: TrainingSample[] = [
  { inputs: [0, 0], expected: [0] },
  { inputs: [0, 1], expected: [1] },
  { inputs: [1, 0], expected: [1] },
  { inputs: [1, 1], expected: [0] },
];

/**
 * T001: Result of processing a single training sample within a step
 */
export interface TrainingStepResult {
  sample: TrainingSample;        // The sample that was processed
  sampleIndex: number;           // Index within XOR_DATA (0-3)
  output: number;                // Network's actual output
  error: number;                 // output - expected (signed)
  loss: number;                  // error^2 (MSE contribution)
}

/**
 * T002: Aggregated information about a complete training step (all 4 samples)
 */
export interface TrainingStepSummary {
  stepNumber: number;            // Current step count
  samples: TrainingStepResult[]; // Results for each sample (length 4)
  totalLoss: number;             // Sum of individual losses / 4
  isImproving: boolean;          // totalLoss < previousLoss
  previousLoss: number;          // Loss from previous step (for trend)
}
