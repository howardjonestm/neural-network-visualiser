# Data Model: Neural Network Visualisation

**Date**: 2025-12-09
**Feature**: 001-nn-visualisation

## Entity Definitions

### Neuron

A computational unit that receives weighted inputs, applies a bias, and produces
an activation output.

```typescript
interface Neuron {
  id: string;              // Unique identifier (e.g., "h1", "o1")
  layerIndex: number;      // Which layer this neuron belongs to (0-indexed)
  positionInLayer: number; // Position within its layer (0-indexed)
  bias: number;            // Bias value added before activation
  activation: number;      // Current output value [0, 1]
  preActivation: number;   // Weighted sum + bias before activation function
  delta: number;           // Error signal for backpropagation
}
```

**Validation Rules**:
- `id` must be unique across all neurons in the network
- `layerIndex` must be >= 0 and < total layer count
- `positionInLayer` must be >= 0 and < layer size
- `activation` must be in range [0, 1] (sigmoid output)
- Input neurons have no bias (bias = 0)

**State Transitions**:
1. Initialization: Random bias via Xavier init (except input layer)
2. Forward pass: Compute `preActivation`, then `activation = sigmoid(preActivation)`
3. Backward pass: Compute `delta` from error gradient
4. Reset: Return to initialization state

### Layer

An ordered collection of neurons at the same depth in the network.

```typescript
interface Layer {
  index: number;           // Layer position (0 = input, last = output)
  type: LayerType;         // 'input' | 'hidden' | 'output'
  neurons: Neuron[];       // Neurons in this layer
  size: number;            // Number of neurons (neurons.length)
}

type LayerType = 'input' | 'hidden' | 'output';
```

**Validation Rules**:
- Layer 0 must be type 'input'
- Last layer must be type 'output'
- All intermediate layers are type 'hidden'
- `size` must equal `neurons.length`
- `neurons` must be non-empty

### Weight

A connection between two neurons in adjacent layers.

```typescript
interface Weight {
  id: string;              // Unique identifier (e.g., "w_i0_h1")
  fromNeuronId: string;    // Source neuron (earlier layer)
  toNeuronId: string;      // Target neuron (later layer)
  value: number;           // Current weight value
  gradient: number;        // Gradient for current training step
}
```

**Validation Rules**:
- `fromNeuronId` must reference a neuron in layer N
- `toNeuronId` must reference a neuron in layer N+1 (adjacent layer)
- Weight connects every neuron in layer N to every neuron in layer N+1 (fully connected)

**State Transitions**:
1. Initialization: Random value via Xavier init
2. Forward pass: Used to compute weighted sum
3. Backward pass: `gradient` computed from delta propagation
4. Update: `value -= learningRate * gradient`
5. Reset: Return to new random initialization

### Network

The complete neural network containing all layers and weights.

```typescript
interface Network {
  layers: Layer[];         // Ordered array of layers
  weights: Weight[];       // All connections between layers
  architecture: number[];  // Layer sizes, e.g., [2, 2, 1]
}
```

**Validation Rules**:
- `architecture.length` must be >= 2 (at least input and output)
- `layers.length` must equal `architecture.length`
- Each `layers[i].size` must equal `architecture[i]`
- `weights.length` must equal sum of (architecture[i] * architecture[i+1])

**For XOR (2-2-1)**:
- `architecture = [2, 2, 1]`
- Total neurons: 5
- Total weights: (2*2) + (2*1) = 6
- Total biases: 2 + 1 = 3 (hidden + output)

### TrainingConfig

Parameters controlling the training process.

```typescript
interface TrainingConfig {
  learningRate: number;    // Step size for weight updates
  isPlaying: boolean;      // Whether auto-training is active
  stepCount: number;       // Number of training steps completed
  currentLoss: number;     // Current mean squared error
}
```

**Validation Rules**:
- `learningRate` must be in range (0, 1] (typically 0.1 to 1.0)
- `stepCount` must be >= 0
- `currentLoss` must be >= 0

**Default Values**:
- `learningRate = 0.5`
- `isPlaying = false`
- `stepCount = 0`
- `currentLoss = 1.0`

### TrainingData

Fixed dataset for the XOR problem.

```typescript
interface TrainingSample {
  inputs: number[];        // Input values (length matches input layer)
  expected: number[];      // Expected output (length matches output layer)
}

const XOR_DATA: TrainingSample[] = [
  { inputs: [0, 0], expected: [0] },
  { inputs: [0, 1], expected: [1] },
  { inputs: [1, 0], expected: [1] },
  { inputs: [1, 1], expected: [0] },
];
```

**Validation Rules**:
- `inputs.length` must equal input layer size
- `expected.length` must equal output layer size
- All values must be in range [0, 1]

## Relationships

```
Network (1) ────contains──── (many) Layer
Layer (1) ────contains──── (many) Neuron
Layer[N] (many) ────connects via weights to──── (many) Layer[N+1]
Weight (1) ────from──── (1) Neuron
Weight (1) ────to──── (1) Neuron
Network (1) ────uses──── (1) TrainingConfig
Network (1) ────trains on──── (many) TrainingSample
```

## Visual Representation Mapping

| Entity | Visual Element | Encoding |
|--------|----------------|----------|
| Neuron | Circle | Position: x by layer, y by position in layer |
| Neuron.activation | Circle fill | Opacity (0 = transparent, 1 = opaque) |
| Weight | Line connecting circles | Position: connects neuron centers |
| Weight.value (magnitude) | Line thickness | 1-6px based on abs(value) |
| Weight.value (sign) | Line color | Blue (positive) / Red (negative) |
| Bias | Tooltip on neuron hover | Text display |
| TrainingConfig.learningRate | Slider control | UI element |
| TrainingConfig.isPlaying | Play/Pause button | UI element |
| TrainingConfig.stepCount | Counter display | UI element |
| TrainingConfig.currentLoss | Loss display | UI element |

## State Machine: Training Step

```
[Idle]
   │
   │ User clicks "Step" OR isPlaying=true
   ▼
[Forward Pass]
   │ For each layer (0 to N):
   │   For each neuron in layer:
   │     Compute weighted sum + bias
   │     Apply sigmoid activation
   ▼
[Compute Loss]
   │ Compare output to expected
   │ Calculate MSE loss
   ▼
[Backward Pass]
   │ For each layer (N to 1):
   │   For each neuron:
   │     Compute delta (error signal)
   │   For each weight to this layer:
   │     Compute gradient
   ▼
[Update Weights]
   │ For each weight:
   │   value -= learningRate * gradient
   │ For each bias (non-input neurons):
   │   bias -= learningRate * delta
   ▼
[Update Visuals]
   │ Animate weight line thickness/color
   │ Animate neuron fill opacity
   │ Update stepCount and currentLoss
   ▼
[Idle] (or loop if isPlaying)
```
