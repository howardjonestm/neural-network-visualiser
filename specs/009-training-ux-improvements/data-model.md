# Data Model: Training UX Improvements

**Feature**: 009-training-ux-improvements
**Date**: 2025-12-13

## Overview

This feature primarily involves UI/UX changes with minimal data model impact. The main additions are state tracking for interaction hints and animation triggers.

## State Changes

### Tutorial State Extensions

**File**: `src/tutorial/state.ts`

```typescript
// Existing state (no changes)
interface TutorialState {
  trainingIterations: number;
  currentVisualization: VisualizationState;
  lastPrediction: PredictionResult | null;
  // ... other existing fields
}

// New fields to add:
interface TutorialState {
  // ... existing fields ...

  /** Track if interaction hint has been shown/dismissed */
  interactionHintDismissed: boolean;

  /** Current training step for animation sync */
  currentTrainingStep: TrainingStep | null;
}

type TrainingStep = 'forward-pass' | 'calculate-loss' | 'backpropagation';
```

### Hint Persistence State

**Storage**: localStorage
**Key**: `nn-visualiser-hint-dismissed`
**Value**: `"true"` | absent

```typescript
// Utility functions for hint state
function isHintDismissed(): boolean {
  try {
    return localStorage.getItem('nn-visualiser-hint-dismissed') === 'true';
  } catch {
    return false; // Graceful fallback if localStorage unavailable
  }
}

function dismissHint(): void {
  try {
    localStorage.setItem('nn-visualiser-hint-dismissed', 'true');
  } catch {
    // Silently fail - hint will show again next time
  }
}
```

## Entity Definitions

### TrainingStep Enum

Represents the three phases of the Understanding Training section:

| Value | Description | Associated Animation |
|-------|-------------|---------------------|
| `forward-pass` | Input propagates through network | `animateForwardPass()` |
| `calculate-loss` | Output compared to expected | `animateLossHighlight()` |
| `backpropagation` | Gradients flow backward | `animateBackpropagation()` |

### PredictionDisplay

Enhanced prediction result for prominent display:

```typescript
interface PredictionDisplay {
  input: [number, number];      // e.g., [0, 1]
  expected: number;             // e.g., 1
  predicted: number;            // e.g., 0.92
  predictedClass: number;       // Math.round(predicted)
  isCorrect: boolean;           // predictedClass === expected
}
```

### MathContent

Reorganized math content structure per training step:

```typescript
interface StepMathContent {
  step: TrainingStep;
  title: string;
  formulas: Formula[];
  explanation: string;
}

interface Formula {
  name: string;
  notation: string;      // HTML/Unicode representation
  description: string;
}

// Example usage:
const forwardPassMath: StepMathContent = {
  step: 'forward-pass',
  title: 'Forward Pass Mathematics',
  formulas: [
    {
      name: 'Sigmoid Activation',
      notation: 'σ(z) = 1 / (1 + e<sup>-z</sup>)',
      description: 'Squashes input to range (0, 1)'
    },
    {
      name: 'Weighted Sum',
      notation: 'z = Σ(w<sub>i</sub> × x<sub>i</sub>) + b',
      description: 'Input to activation function'
    }
  ],
  explanation: 'Each neuron computes a weighted sum of inputs, adds bias, then applies sigmoid.'
};
```

## State Transitions

### Training Step Navigation

```
[User clicks Next in Understanding Training]
     │
     ▼
┌─────────────────────┐
│ Update currentStep  │
│ in tutorial state   │
└─────────────────────┘
     │
     ▼
┌─────────────────────┐
│ Cancel any active   │
│ animations          │
└─────────────────────┘
     │
     ▼
┌─────────────────────┐
│ Trigger animation   │
│ for new step        │
└─────────────────────┘
```

### Hint Display Flow

```
[User scrolls to Training section]
     │
     ▼
┌─────────────────────┐
│ Check localStorage  │
│ for dismissal       │
└─────────────────────┘
     │
     ├──── Dismissed ────► [No hint shown]
     │
     ▼ Not dismissed
┌─────────────────────┐
│ Show interaction    │
│ hint after 2s delay │
└─────────────────────┘
     │
     ▼
[User clicks dismiss]
     │
     ▼
┌─────────────────────┐
│ Set localStorage    │
│ dismissal flag      │
└─────────────────────┘
```

## Validation Rules

### Prediction Display
- `predicted` must be in range [0, 1] (sigmoid output)
- `predictedClass` = Math.round(predicted)
- `isCorrect` = (predictedClass === expected)

### Training Step
- Only one step active at a time
- Animation must complete or be cancelled before step change
- Step sequence: forward-pass → calculate-loss → backpropagation

## No Database/API Changes

This feature is entirely client-side with no backend implications.

## Migration Notes

No data migration required. New state fields have sensible defaults:
- `interactionHintDismissed`: Derived from localStorage at runtime
- `currentTrainingStep`: null initially, set when user enters Understanding Training
