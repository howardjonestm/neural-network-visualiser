# Data Model: Training UI Polish & Visual Enhancements

**Feature**: 008-training-ui-polish
**Date**: 2025-12-13

## Overview

This feature primarily involves UI/CSS changes and animation state management. The data model additions are minimal, extending existing types to support new visualization states.

---

## New Types

### TrainingVisualizationStep

Represents a step in the Understanding Training guided experience with visualization state.

```typescript
interface TrainingVisualizationStep {
  stepNumber: 1 | 2 | 3;
  description: 'Forward Pass' | 'Calculate Loss' | 'Backpropagation';
  visualizationState: VisualizationState;
  animationDuration: number; // milliseconds (2000-3000 per clarification)
}

type VisualizationState =
  | 'idle'
  | 'forward-pass-animating'
  | 'loss-highlighting'
  | 'backprop-animating';
```

### NetworkTrainedState

Enhanced training state for accurate detection (fixes "Network Not Yet Trained" bug).

```typescript
interface NetworkTrainedState {
  iterationCount: number;      // Total training iterations performed
  hasBeenTrained: boolean;     // true if iterationCount > 0
  isCurrentlyTraining: boolean; // true during active training
  lastLoss: number | null;     // Most recent loss value
}
```

### PredictionResult

For the prominent inference output display.

```typescript
interface PredictionResult {
  input: [number, number];     // XOR input pair
  expected: number;            // Expected output (0 or 1)
  predicted: number;           // Network's actual output (0.0 - 1.0)
  isCorrect: boolean;          // Within threshold of expected
  threshold: number;           // Comparison threshold (e.g., 0.5)
}
```

---

## Modified Types

### TutorialState (existing in `src/tutorial/types.ts`)

**Additions**:

```typescript
interface TutorialState {
  // ... existing fields ...

  // NEW: Track actual training iterations for robust detection
  trainingIterations: number;

  // NEW: Current visualization state for Understanding Training
  currentVisualization: VisualizationState;

  // NEW: Prominent prediction result
  lastPrediction: PredictionResult | null;
}
```

### TrainingGuidedStep (existing in `src/tutorial/types.ts`)

**Modifications**:

```typescript
interface TrainingGuidedStep {
  stepNumber: number;
  description: string;
  explanation: string;
  // REMOVED: termsIntroduced (per FR-009)
  animationDuration: number;
  showMathOption: boolean;
  // NEW: Visualization trigger
  visualizationType: 'forward-pass' | 'loss' | 'backprop';
}
```

---

## State Transitions

### NetworkTrainedState Transitions

```
[Untrained]
    |
    | (first training step)
    v
[Trained: hasBeenTrained=true]
    |
    | (reset network)
    v
[Untrained]
```

- `hasBeenTrained` becomes `true` permanently after first training iteration
- Only `reset()` returns to untrained state
- `isCurrentlyTraining` toggles with play/pause

### VisualizationState Transitions

```
[idle]
    |
    | (user clicks Next on step 1)
    v
[forward-pass-animating] -- (animation complete) --> [idle]
    |
    | (user clicks Next on step 2)
    v
[loss-highlighting] -- (animation complete) --> [idle]
    |
    | (user clicks Next on step 3)
    v
[backprop-animating] -- (animation complete) --> [idle]
```

- User navigation triggers visualization
- Animation completion returns to idle
- Navigation away cancels active animation

---

## Validation Rules

1. **PredictionResult.isCorrect**: `Math.round(predicted) === expected`
2. **NetworkTrainedState.hasBeenTrained**: `iterationCount > 0`
3. **TrainingVisualizationStep.animationDuration**: Must be 2000-3000ms (per clarification)

---

## No API Contracts

This feature is entirely client-side with no external API calls. All data is managed in browser state.

---

## Entity Relationships

```
TutorialState
    ├── currentSection: SectionId
    ├── trainingIterations: number ─────────┐
    ├── currentVisualization: VisualizationState   │
    └── lastPrediction: PredictionResult ──────────┤
                                                   │
NetworkTrainedState (derived from TutorialState) ◄─┘
    ├── hasBeenTrained: boolean
    └── isCurrentlyTraining: boolean

TrainingGuidedStep[] (static config)
    └── visualizationType → triggers VisualizationState changes
```
