# Data Model: Training Visualization

**Feature**: 006-training-visualization
**Date**: 2025-12-11

## Entities

### TrainingSample (existing, in `src/network/types.ts`)

Represents a single input/output pair in the training data.

```typescript
interface TrainingSample {
  inputs: number[];    // Input values, e.g., [0, 1]
  expected: number[];  // Expected output, e.g., [1]
}
```

**Notes**: Already exists as `XOR_DATA` constant. No changes needed.

---

### TrainingStepResult (new)

Captures the result of processing a single training sample within a step.

```typescript
interface TrainingStepResult {
  sample: TrainingSample;        // The sample that was processed
  sampleIndex: number;           // Index within XOR_DATA (0-3)
  output: number;                // Network's actual output
  error: number;                 // output - expected (signed)
  loss: number;                  // error^2 (MSE contribution)
}
```

**Location**: `src/network/types.ts`

**Validation**:
- `sampleIndex` must be 0-3 for XOR data
- `error` can be positive or negative
- `loss` is always >= 0

---

### TrainingStepSummary (new)

Aggregated information about a complete training step (all 4 samples).

```typescript
interface TrainingStepSummary {
  stepNumber: number;            // Current step count
  samples: TrainingStepResult[]; // Results for each sample (length 4)
  totalLoss: number;             // Sum of individual losses / 4
  isImproving: boolean;          // totalLoss < previousLoss
  previousLoss: number;          // Loss from previous step (for trend)
}
```

**Location**: `src/network/types.ts`

**State Transitions**:
- Created after each complete training step
- `isImproving` computed by comparing to previous step
- Reset when network is reset

---

### WeightChange (extended from WeightDelta)

Extends existing `WeightDelta` to include direction indicator.

```typescript
// Existing in src/visualisation/weight-delta.ts
interface WeightDelta {
  weightId: string;
  previousValue: number;
  currentValue: number;
  delta: number;
  magnitude: 'none' | 'small' | 'medium' | 'large';
}

// Extended with direction
interface WeightChange extends WeightDelta {
  direction: 'increasing' | 'decreasing' | 'stable';
}
```

**Location**: `src/visualisation/weight-delta.ts`

**Validation**:
- `direction` derived from `delta` sign
- `direction = 'stable'` when `magnitude === 'none'`

**Derivation Rules**:
```typescript
function getDirection(delta: number, magnitude: DeltaMagnitude): WeightDirection {
  if (magnitude === 'none') return 'stable';
  return delta > 0 ? 'increasing' : 'decreasing';
}
```

---

### TrainingVisualizationState (new)

UI state for the training visualization panel.

```typescript
interface TrainingVisualizationState {
  isAnimated: boolean;           // Whether to animate forward pass
  currentSample: TrainingStepResult | null;  // Last processed sample
  stepSummary: TrainingStepSummary | null;   // Last complete step
  displayThrottleMs: number;     // Update throttle (default 100)
}
```

**Location**: `src/visualisation/training-panel.ts`

**State Transitions**:
- `currentSample` updated after each sample (during step)
- `stepSummary` updated after complete step (all 4 samples)
- `isAnimated` toggled by user
- Reset to null values when network is reset

---

## Relationships

```
┌─────────────────────┐
│    Network          │
│ (existing)          │
└─────────┬───────────┘
          │ trains on
          ▼
┌─────────────────────┐
│  TrainingSample[]   │◄──────────────┐
│  (XOR_DATA)         │               │
└─────────┬───────────┘               │
          │ produces                   │
          ▼                           │
┌─────────────────────┐               │
│ TrainingStepResult  │───────────────┘
│                     │  references sample
└─────────┬───────────┘
          │ aggregated into
          ▼
┌─────────────────────┐
│ TrainingStepSummary │
└─────────┬───────────┘
          │ displayed by
          ▼
┌─────────────────────┐     ┌─────────────────┐
│TrainingVisualization│◄────│   WeightChange  │
│      State          │     │   (per weight)  │
└─────────────────────┘     └─────────────────┘
```

---

## Error Color Mapping

Maps error magnitude to visual color for FR-004 compliance.

```typescript
type ErrorSeverity = 'good' | 'moderate' | 'poor';

function getErrorSeverity(errorMagnitude: number): ErrorSeverity {
  const absError = Math.abs(errorMagnitude);
  if (absError < 0.1) return 'good';
  if (absError < 0.3) return 'moderate';
  return 'poor';
}

const ERROR_COLORS = {
  good: '#22c55e',      // Green - low error
  moderate: '#eab308',  // Yellow - medium error
  poor: '#ef4444',      // Red - high error
} as const;
```

**Location**: `src/visualisation/training-panel.ts`

---

## CSS Classes for Weight Direction

```css
/* In src/styles.css - extend existing weight highlight classes */

.weight-arrow-up {
  /* Triangle pointing up for increasing weights */
  marker-end: url(#arrow-up);
}

.weight-arrow-down {
  /* Triangle pointing down for decreasing weights */
  marker-end: url(#arrow-down);
}

/* Arrow markers defined in SVG defs */
```

---

## Integration Points

### PlaybackControls Extensions

Add new callback for per-sample events:

```typescript
// In src/controls/playback.ts
interface PlaybackCallbacks {
  onStep: (stepCount: number, loss: number) => void;
  onPlayPauseChange: (isPlaying: boolean) => void;
  onBeforeTrainStep?: () => void;
  onAfterTrainStep?: () => void;
  // NEW: Called after each sample within a step
  onSampleProcessed?: (result: TrainingStepResult) => void;
}
```

### TrainingPanel Component

New component for training visualization:

```typescript
// In src/visualisation/training-panel.ts
class TrainingPanel {
  private state: TrainingVisualizationState;

  constructor(containerId: string);

  // Update with sample result (called 4x per step)
  updateSample(result: TrainingStepResult): void;

  // Update with step summary (called 1x per step)
  updateSummary(summary: TrainingStepSummary): void;

  // Toggle animation mode
  setAnimated(animated: boolean): void;

  // Reset display
  reset(): void;
}
```
