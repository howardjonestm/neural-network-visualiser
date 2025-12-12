# Data Model: Educational Enhancements

**Feature**: 002-educational-enhancements
**Date**: 2025-12-09

## Entity Overview

This feature adds educational content entities to the existing neural network visualization. The core network entities (Neuron, Layer, Weight, Network) remain unchanged except for the default architecture configuration.

## New Entities

### Hint

Represents an inline educational hint/callout that appears to guide users.

```typescript
interface Hint {
  id: string;                    // Unique identifier (e.g., "hint-step-button")
  targetSelector: string;        // CSS selector for element to point to
  title: string;                 // Short heading (e.g., "Training Step")
  content: string;               // Explanation text (1-2 sentences)
  position: HintPosition;        // Where to display relative to target
  triggerEvent: HintTrigger;     // When to show the hint
  showOnce: boolean;             // If true, don't show after dismissal
}

type HintPosition = 'top' | 'bottom' | 'left' | 'right';
type HintTrigger = 'load' | 'first-interaction' | 'hover';
```

**Relationships**:
- Associated with a DOM element via `targetSelector`
- State tracked in `HintState` entity

**Validation**:
- `id` must be unique across all hints
- `targetSelector` must match exactly one element
- `content` should be ≤100 characters for readability

### HintState

Tracks which hints have been dismissed by the user.

```typescript
interface HintState {
  dismissedHints: Record<string, boolean>;  // hintId → dismissed
  lastResetDate: string | null;             // ISO date of last reset
}
```

**Persistence**: localStorage key `"nn-viz-hints"`

**State Transitions**:
- Initial: `{ dismissedHints: {}, lastResetDate: null }`
- On dismiss: `dismissedHints[hintId] = true`
- On reset: `dismissedHints = {}, lastResetDate = new Date().toISOString()`

### LegendItem

Represents a single item in the visual legend.

```typescript
interface LegendItem {
  id: string;                    // Unique identifier
  category: LegendCategory;      // Grouping category
  label: string;                 // Display name
  description: string;           // Brief explanation
  visualSample: LegendVisual;    // How to render the sample
}

type LegendCategory = 'neurons' | 'weights' | 'layers' | 'training';

interface LegendVisual {
  type: 'circle' | 'line' | 'gradient' | 'color-swatch';
  properties: Record<string, string | number>;  // CSS/SVG properties
}
```

**Validation**:
- `label` should be ≤20 characters
- `description` should be ≤50 characters

### LossTrend

Represents the current training loss trend for display.

```typescript
interface LossTrend {
  direction: 'improving' | 'worsening' | 'stable';
  currentLoss: number;
  previousLoss: number;
  changeThreshold: number;       // Minimum change to show direction (default 0.001)
}

// Computed from loss values
function computeTrend(current: number, previous: number, threshold = 0.001): LossTrend {
  const diff = current - previous;
  if (Math.abs(diff) < threshold) return { direction: 'stable', ... };
  return { direction: diff < 0 ? 'improving' : 'worsening', ... };
}
```

### LearningResource

Represents an external learning resource link.

```typescript
interface LearningResource {
  id: string;
  title: string;                 // Display title
  description: string;           // Brief description of content
  url: string;                   // External URL
  type: ResourceType;            // Content format
  difficulty: Difficulty;        // Target audience level
}

type ResourceType = 'video' | 'interactive' | 'article' | 'book' | 'reference';
type Difficulty = 'beginner' | 'intermediate' | 'advanced';
```

**Validation**:
- `url` must be valid HTTPS URL
- `title` should be ≤50 characters
- `description` should be ≤100 characters

### EducationalContent

Static content for the "How This Relates to AI" section.

```typescript
interface EducationalContent {
  id: string;
  title: string;
  sections: ContentSection[];
}

interface ContentSection {
  heading: string;
  body: string;                  // Plain text or simple markdown
  emphasis?: string;             // Key takeaway to highlight
}
```

## Modified Entities

### Network (Existing - Modified Default)

The default architecture changes from `[2, 2, 1]` to `[2, 4, 3, 2, 1]`.

```typescript
// Before
const DEFAULT_ARCHITECTURE = [2, 2, 1];

// After
const DEFAULT_ARCHITECTURE = [2, 4, 3, 2, 1];
```

**Impact**:
- More neurons to render (12 vs 5)
- More weights to render (26 vs 6)
- Layout calculations must adapt

### TrainingConfig (Existing - Extended)

Add previous loss for trend calculation.

```typescript
interface TrainingConfig {
  learningRate: number;
  isPlaying: boolean;
  stepCount: number;
  currentLoss: number;
  previousLoss: number;          // NEW: for trend calculation
}
```

## Entity Relationships

```
┌─────────────┐     renders     ┌─────────────┐
│   Legend    │◄────────────────│ LegendItem  │
└─────────────┘                 └─────────────┘
                                       │
                                   explains
                                       ▼
                               ┌─────────────┐
                               │   Network   │
                               │  Component  │
                               └─────────────┘
                                       ▲
                                   points to
                                       │
┌─────────────┐     uses        ┌─────────────┐
│  HintState  │◄────────────────│    Hint     │
│(localStorage)│                └─────────────┘
└─────────────┘

┌─────────────┐     computes    ┌─────────────┐
│TrainingConfig│────────────────►│  LossTrend  │
└─────────────┘                 └─────────────┘

┌─────────────┐     contains    ┌─────────────┐
│  Resources  │◄────────────────│Learning     │
│   Panel     │                 │Resource     │
└─────────────┘                 └─────────────┘
```

## Data Instances

### Predefined Hints

| ID | Target | Trigger | Content |
|----|--------|---------|---------|
| hint-network | #network-svg | load | "This is your neural network. Each circle is a neuron." |
| hint-weights | .weight | load | "Lines connecting neurons are weights. Blue = positive, red = negative." |
| hint-step | #step-btn | first-interaction | "Click to run one training step. Watch the weights change!" |
| hint-play | #play-btn | first-interaction | "Press to train continuously. The network learns from examples." |
| hint-loss | #loss-value | first-interaction | "Loss measures how wrong the network is. Lower is better!" |
| hint-learning-rate | #learning-rate-slider | first-interaction | "Adjust how fast the network learns. Too fast = unstable." |
| hint-reset | #reset-btn | first-interaction | "Start over with new random weights." |

### Predefined Legend Items

| Category | Label | Description | Visual |
|----------|-------|-------------|--------|
| neurons | Neuron | Processing unit | Circle |
| neurons | Activation | How active (opacity) | Gradient 20%→100% |
| weights | Positive | Strengthens signal | Blue line |
| weights | Negative | Weakens signal | Red line |
| weights | Magnitude | Strength (thickness) | Thin→thick line |
| layers | Input | Receives data | Leftmost column |
| layers | Hidden | Processes data | Middle columns |
| layers | Output | Produces result | Rightmost column |
| training | Loss | Error measure | Number display |
| training | Step | One learning cycle | Button icon |

### Predefined Resources

| Title | Type | Difficulty | URL |
|-------|------|------------|-----|
| Neural Networks (3Blue1Brown) | video | beginner | youtube.com/playlist?list=... |
| Neural Networks: Zero to Hero | video | beginner | youtube.com/playlist?list=... |
| Neural Networks and Deep Learning | book | beginner | neuralnetworksanddeeplearning.com |
| TensorFlow Playground | interactive | beginner | playground.tensorflow.org |
| Wikipedia: Artificial Neural Network | reference | beginner | en.wikipedia.org/wiki/... |

## Storage Schema

### localStorage: nn-viz-hints

```json
{
  "dismissedHints": {
    "hint-network": true,
    "hint-weights": true
  },
  "lastResetDate": "2025-12-09T10:30:00.000Z"
}
```

No other persistence required - all other data is static or in-memory.
