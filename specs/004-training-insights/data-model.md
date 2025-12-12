# Data Model: Training Insights

**Date**: 2025-12-11
**Feature**: 004-training-insights

## Entity Overview

```
┌─────────────────────┐      computes      ┌─────────────────────┐
│  WeightDeltaTracker │─────────────────►  │     WeightDelta     │
│  (Service)          │                    │     (Value Object)  │
└─────────────────────┘                    └─────────────────────┘
         │                                           │
         │ stores                                    │ used by
         ▼                                           ▼
┌─────────────────────┐                    ┌─────────────────────┐
│   WeightHistory     │                    │   NetworkRenderer   │
│   (Data Store)      │                    │   (Visualization)   │
└─────────────────────┘                    └─────────────────────┘

┌─────────────────────┐      generates     ┌─────────────────────┐
│       Neuron        │─────────────────►  │ActivationTooltipData│
│   (Existing)        │                    │   (View Model)      │
└─────────────────────┘                    └─────────────────────┘
```

## Entities

### WeightDelta (Value Object)

Represents the change in a single weight between training steps.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| weightId | string | Reference to Weight.id | Must exist in network |
| previousValue | number | Value before training step | Any finite number |
| currentValue | number | Value after training step | Any finite number |
| delta | number | Change amount (current - previous) | Computed, not stored |
| magnitude | 'none' \| 'small' \| 'medium' \| 'large' | Categorized change size | Computed from delta |

**Derivations**:
- `delta = currentValue - previousValue`
- `magnitude`:
  - `'none'`: |delta| < 0.001
  - `'small'`: 0.001 ≤ |delta| < 0.01
  - `'medium'`: 0.01 ≤ |delta| < 0.1
  - `'large'`: |delta| ≥ 0.1

### WeightDeltaTracker (Service)

Manages weight change tracking across training steps.

| Field | Type | Description |
|-------|------|-------------|
| previousValues | Map<string, number> | Weight ID → last known value |
| history | Map<string, number[]> | Weight ID → last 10 values (ring buffer) |
| historyDepth | number | Max history entries (default: 10) |

**Operations**:
- `captureSnapshot(weights: Weight[]): void` - Store current values as "previous"
- `computeDeltas(weights: Weight[]): Map<string, WeightDelta>` - Calculate deltas from previous
- `getHistory(weightId: string): number[]` - Get value history for a weight
- `clear(): void` - Reset all tracking (called on network reset)

**State Transitions**:
```
[Empty] ──captureSnapshot──► [HasPrevious] ──computeDeltas──► [HasDeltas]
                                  │                              │
                                  └──────captureSnapshot◄────────┘
```

### WeightHistory (Data Store)

Ring buffer storing recent weight values for the P3 history feature.

| Field | Type | Description |
|-------|------|-------------|
| values | number[] | Last N weight values (newest at end) |
| maxSize | number | Maximum entries (10) |

**Operations**:
- `push(value: number): void` - Add value, evict oldest if at capacity
- `toArray(): number[]` - Get all values in chronological order
- `getDeltas(): number[]` - Get differences between consecutive values

### ActivationTooltipData (View Model)

Data prepared for rendering activation function tooltip.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| neuronId | string | Reference to Neuron.id | Must exist |
| neuronType | 'input' \| 'hidden' \| 'output' | Layer type | Derived from layer |
| formula | string | Display formula | "σ(x) = 1/(1+e⁻ˣ)" for hidden/output, "Pass-through" for input |
| preActivation | number | Weighted sum + bias | Any finite number |
| postActivation | number | After activation function | 0 < value < 1 for sigmoid |
| curvePosition | { x: number, y: number } | Position on mini curve | Normalized 0-1 range |

**Derivations**:
- For input neurons: `preActivation = postActivation = activation` (pass-through)
- For hidden/output: `postActivation = sigmoid(preActivation)`
- `curvePosition.x = mapToRange(preActivation, -6, 6, 0, 1)`
- `curvePosition.y = postActivation`

## Relationships

### WeightDeltaTracker ↔ Weight
- Tracker observes Weight objects from Network
- One tracker instance per application
- Weights are not modified; tracker maintains separate state

### ActivationTooltipData ↔ Neuron
- Tooltip data generated on-demand from Neuron state
- No persistent relationship; computed per hover event
- Requires access to Layer.type for neuron classification

### WeightDelta ↔ NetworkRenderer
- Renderer consumes deltas to apply visual highlighting
- Deltas are ephemeral; only needed during animation
- Renderer does not store deltas after animation completes

## Existing Types (Reference)

These types already exist and should NOT be modified:

```typescript
// src/network/types.ts
interface Weight {
  id: string;
  fromNeuronId: string;
  toNeuronId: string;
  value: number;
  gradient: number;
}

interface Neuron {
  id: string;
  layerIndex: number;
  positionInLayer: number;
  bias: number;
  activation: number;
  preActivation: number;
  delta: number;
}
```

## New Type Definitions

```typescript
// src/visualisation/weight-delta.ts

export type DeltaMagnitude = 'none' | 'small' | 'medium' | 'large';

export interface WeightDelta {
  weightId: string;
  previousValue: number;
  currentValue: number;
  readonly delta: number;        // Computed getter
  readonly magnitude: DeltaMagnitude;  // Computed getter
}

export interface WeightDeltaTracker {
  captureSnapshot(weights: Weight[]): void;
  computeDeltas(weights: Weight[]): Map<string, WeightDelta>;
  getHistory(weightId: string): number[];
  clear(): void;
}
```

```typescript
// src/education/activation-tooltip.ts

export interface ActivationTooltipData {
  neuronId: string;
  neuronType: 'input' | 'hidden' | 'output';
  formula: string;
  preActivation: number;
  postActivation: number;
  curvePosition: { x: number; y: number };
}

export function createActivationTooltipData(
  neuron: Neuron,
  layerType: LayerType
): ActivationTooltipData;
```

## Validation Rules

1. **WeightDelta**:
   - `weightId` must reference an existing weight in the network
   - `previousValue` and `currentValue` must be finite numbers (not NaN/Infinity)

2. **WeightHistory**:
   - Maximum 10 entries per weight (enforced by ring buffer)
   - Values must be finite numbers

3. **ActivationTooltipData**:
   - `preActivation` can be any real number
   - `postActivation` must be in range (0, 1) for sigmoid neurons
   - `curvePosition` x and y must be in range [0, 1]
