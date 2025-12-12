# Data Model: Visual Forward Pass Demonstration

**Feature**: 003-forward-pass-demo
**Date**: 2025-12-09
**Status**: Complete

## New Entities

### DemoState

Represents the current state of the forward pass demonstration.

```typescript
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
  totalSteps: 5,  // 5 layers in network
  selectedInput: [0, 0],
  speed: 'medium',
  steps: [],
  interruptedTraining: false,
};
```

**Validation Rules**:
- `currentStepIndex` must be in range [0, totalSteps - 1]
- `selectedInput` must be one of XOR_INPUTS
- `steps` array is populated when demo starts, cleared when idle

**State Transitions**:
| From | To | Trigger |
|------|-----|---------|
| idle | running | startAutoDemo() |
| idle | step-through | nextStep() when idle |
| running | paused | pause() |
| paused | running | resume() |
| paused | idle | cancel() |
| running | idle | animation complete |
| step-through | step-through | nextStep() / prevStep() |
| step-through | idle | cancel() or final step |

### DemoStep

Represents a single layer's computation in the forward pass.

```typescript
export interface NeuronCalculation {
  neuronId: string;
  inputs: { sourceId: string; activation: number; weight: number }[];
  bias: number;
  weightedSum: number;
  preActivation: number;
  postActivation: number;
  formula: string;  // Pre-formatted display string
}

export interface DemoStep {
  layerIndex: number;
  layerType: LayerType;
  layerLabel: string;  // "Input", "Hidden 1", etc.
  neurons: NeuronCalculation[];
  isComplete: boolean;
}
```

**Example DemoStep**:
```typescript
{
  layerIndex: 2,
  layerType: 'hidden',
  layerLabel: 'Hidden 2',
  neurons: [
    {
      neuronId: 'n_2_0',
      inputs: [
        { sourceId: 'n_1_0', activation: 0.731, weight: 0.543 },
        { sourceId: 'n_1_1', activation: 0.622, weight: -0.891 },
        { sourceId: 'n_1_2', activation: 0.445, weight: 0.234 },
        { sourceId: 'n_1_3', activation: 0.512, weight: 0.678 },
      ],
      bias: 0.102,
      weightedSum: 0.547,
      preActivation: 0.547,
      postActivation: 0.633,
      formula: '0.731×0.543 + 0.622×-0.891 + 0.445×0.234 + 0.512×0.678 + 0.102 = 0.547 → σ(0.547) = 0.633'
    },
    // ... more neurons
  ],
  isComplete: false
}
```

### XORInput

Type alias for valid XOR input pairs.

```typescript
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
```

### DemoSpeedConfig

Timing configuration for each speed setting.

```typescript
export interface DemoSpeedConfig {
  layerDuration: number;  // milliseconds per layer
  pulseDuration: number;  // milliseconds for pulse travel
  label: string;
}

export const SPEED_CONFIGS: Record<DemoSpeed, DemoSpeedConfig> = {
  slow: { layerDuration: 3000, pulseDuration: 2000, label: 'Slow' },
  medium: { layerDuration: 2000, pulseDuration: 1200, label: 'Medium' },
  fast: { layerDuration: 1000, pulseDuration: 600, label: 'Fast' },
};
```

### SignalAnimation

Represents the visual pulse traveling through the network.

```typescript
export interface SignalPosition {
  x: number;
  y: number;
}

export interface SignalAnimation {
  fromNeuronId: string;
  toNeuronId: string;
  startPosition: SignalPosition;
  endPosition: SignalPosition;
  progress: number;  // 0 to 1
  weightValue: number;  // For color indication
}
```

## Existing Entities (Referenced)

### From src/network/types.ts

```typescript
// Used unchanged
export interface Network { ... }
export interface Layer { ... }
export interface Neuron { ... }
export interface Weight { ... }
export interface TrainingConfig { ... }
export interface TrainingSample { ... }
export const XOR_DATA: TrainingSample[];
```

### From src/education/types.ts

```typescript
// Used for consistent styling
export type LegendVisualType = 'circle' | 'line' | 'swatch';
```

## Relationships

```
DemoState
├── has many DemoStep (one per layer)
│   └── has many NeuronCalculation (one per neuron in layer)
├── references XORInput (selected input pair)
└── references DemoSpeed (playback speed)

SignalAnimation
├── references Neuron (from/to)
└── references Weight (for polarity coloring)
```

## Data Flow

1. **Demo Start**:
   ```
   User selects XORInput →
   forwardPass(network, input) captures activations →
   generateDemoSteps(network) creates DemoStep[] →
   DemoState.steps populated →
   Animation begins
   ```

2. **Step Navigation**:
   ```
   User clicks Next/Previous →
   DemoState.currentStepIndex adjusted →
   Animation jumps to step position →
   Calculation panel updates with step.neurons[].formula
   ```

3. **Auto-Play Loop**:
   ```
   For each step in DemoState.steps:
     Animate pulse from previous layer to current →
     Highlight current layer neurons →
     Update calculation panel →
     Wait SPEED_CONFIGS[speed].layerDuration →
     Increment currentStepIndex
   ```

## Storage

No persistent storage required. All demo state is:
- Ephemeral (lives only during demo session)
- Computed from current network state
- Reset when demo ends or page reloads

## Indexes / Lookups

For efficient animation, maintain lookup maps:

```typescript
// Neuron positions by ID (computed from layout)
type NeuronPositionMap = Map<string, { x: number; y: number }>;

// Weight endpoints by ID (computed from layout)
type WeightEndpointsMap = Map<string, { x1: number; y1: number; x2: number; y2: number }>;
```

These are computed once when demo starts from existing layout calculations.
