# Data Model: Interactive Neural Network Training Tutorial

**Feature**: 007-nn-training-tutorial
**Date**: 2025-12-13

## Overview

This feature is a client-side tutorial with no persistent storage. The data model describes the runtime state structures used to manage tutorial progression, section visibility, and user interactions.

---

## Entities

### TutorialSection

A distinct phase of the learning journey with associated content, visualizations, and interactions.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | string | Unique section identifier | `'objectives' \| 'training' \| 'tour' \| 'inference'` |
| element | HTMLElement | DOM element for the section | Required |
| isVisible | boolean | Whether section is currently in viewport | Computed |
| isActive | boolean | Whether section is the "current" active section | Only one true at a time |
| onActivate | () => void | Callback when section enters viewport | Optional |
| onDeactivate | () => void | Callback when section exits viewport | Optional |

**State Transitions**:
```
invisible → visible (enters viewport at threshold)
visible → active (becomes primary section - highest visibility ratio)
active → visible (another section becomes primary)
visible → invisible (exits viewport)
```

---

### TutorialState

Central state management for the tutorial experience.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| currentSection | SectionId | Currently active section | One of four section IDs |
| trainingCompleted | boolean | Whether full training has run | Default: false |
| trainingInProgress | boolean | Whether training is currently running | Default: false |
| guidedStepsCompleted | number | Count of guided training steps completed | Min: 0, used for SC-003 |
| selectedInferenceInput | XORInput | Input selected for inference demo | Default: [0, 0] |
| networkTrained | boolean | Alias for trainingCompleted (for clarity) | Computed |

**Lifecycle**:
1. Initial state: `currentSection: 'objectives'`, all flags false
2. User scrolls to training: `currentSection: 'training'`
3. User completes guided steps: `guidedStepsCompleted` increments
4. User runs full training: `trainingInProgress: true` → `trainingCompleted: true`
5. User scrolls to tour: `currentSection: 'tour'`
6. User scrolls to inference: `currentSection: 'inference'`

---

### KeyTerm

An educational concept with definition and optional extended explanation.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | string | Unique term identifier | Lowercase, hyphenated |
| term | string | Display name | Required |
| shortDefinition | string | Brief explanation (shown in popup) | Max 100 chars |
| extendedExplanation | string \| null | Detailed explanation with math | Optional |
| mathFormula | string \| null | LaTeX or plain text formula | Optional |
| relatedTerms | string[] | IDs of related terms | Optional |
| firstAppearance | SectionId | Section where term is introduced | Required |

**Predefined Terms** (from FR-006):
- `weight` - Connection strength between neurons
- `neuron` - Basic computational unit
- `layer` - Group of neurons at same depth
- `activation` - Output value of a neuron after applying activation function
- `loss` - Measure of prediction error
- `forward-pass` - Computing output from inputs through network
- `backpropagation` - Algorithm for updating weights based on error
- `inference` - Using trained network to make predictions

---

### ScrollProgress

Tracks user's position within the tutorial.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| totalSections | number | Number of tutorial sections | Fixed: 4 |
| currentSectionIndex | number | 0-based index of current section | 0-3 |
| sectionProgress | number | Progress within current section | 0.0-1.0 |
| overallProgress | number | Total tutorial progress | 0.0-1.0, computed |

**Computed**: `overallProgress = (currentSectionIndex + sectionProgress) / totalSections`

---

### TrainingGuidedStep

A discrete step in the guided training sequence.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| stepNumber | number | Step index (1-based) | 1-N |
| description | string | What this step demonstrates | Required |
| explanation | string | Explanation shown during step | Required |
| termsIntroduced | string[] | Key terms explained in this step | Term IDs |
| animationDuration | number | Duration of step animation (ms) | Default: 1000 |
| showMathOption | boolean | Whether "show math" is available | Default: false |

**Predefined Steps** (for SC-003: at least 3):
1. **Forward Pass**: Show input propagation through network
2. **Calculate Loss**: Show prediction vs expected, compute error
3. **Backpropagation**: Show weight updates flowing backward
4. (Optional) Additional steps for deeper understanding

---

## Relationships

```
TutorialState
├── currentSection → TutorialSection (1:1)
├── guidedStepsCompleted → TrainingGuidedStep (count)
└── selectedInferenceInput → XORInput (value)

TutorialSection
├── keyTerms → KeyTerm[] (many, by firstAppearance)
└── guidedSteps → TrainingGuidedStep[] (for training section only)

ScrollProgress
└── currentSectionIndex → TutorialSection (index mapping)
```

---

## Existing Entities (Preserved)

These entities exist in the current codebase and are reused without modification:

### Network (from `src/network/types.ts`)
- Represents the neural network structure
- Contains layers, neurons, weights
- Training state (weights) is mutable

### XORInput (from `src/demo/types.ts`)
- Tuple representing XOR input: `[0|1, 0|1]`
- Four possible values: [0,0], [0,1], [1,0], [1,1]

### DemoState (from `src/demo/state.ts`)
- Existing demo state machine
- Will be integrated into Section 4 (Inference)
- May be extended or wrapped by TutorialState

---

## Validation Rules

| Entity | Rule | Error Behavior |
|--------|------|----------------|
| TutorialState.guidedStepsCompleted | Must be >= 0 | Clamp to 0 |
| TutorialState.currentSection | Must be valid SectionId | Default to 'objectives' |
| TrainingGuidedStep.stepNumber | Must be unique, sequential | N/A (predefined) |
| KeyTerm.id | Must match pattern `[a-z-]+` | Reject invalid |
| ScrollProgress.sectionProgress | Must be 0.0-1.0 | Clamp to range |

---

## State Persistence

**None required.** All state is ephemeral and resets on page refresh. This is intentional:
- Allows users to re-experience the full tutorial
- No user accounts or preferences to persist
- Matches constitution Principle III (Static Deployment)

If future enhancement desires persistence:
- Use `localStorage` for tutorial progress
- Key: `nn-tutorial-progress`
- Value: serialized TutorialState (excluding DOM references)
