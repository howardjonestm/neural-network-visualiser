# Quickstart: Interactive Neural Network Training Tutorial

**Feature**: 007-nn-training-tutorial
**Date**: 2025-12-13

## Prerequisites

- Node.js 18+ installed
- Git repository cloned
- On feature branch `007-nn-training-tutorial`

## Setup

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Key Files to Understand

### Existing (to integrate with)

| File | Purpose |
|------|---------|
| `src/main.ts` | Application entry point; initializes network, renderer, controls |
| `src/index.html` | Current page structure (will be restructured) |
| `src/network/network.ts` | Neural network creation and structure |
| `src/network/training.ts` | Training logic (forward pass, backprop, loss) |
| `src/visualisation/renderer.ts` | D3-based network visualization |
| `src/demo/state.ts` | State machine for demo flow |

### New (to create)

| File | Purpose |
|------|---------|
| `src/tutorial/state.ts` | Tutorial state management |
| `src/tutorial/scroll-manager.ts` | IntersectionObserver for section detection |
| `src/tutorial/progress-indicator.ts` | Navigation/progress UI |
| `src/tutorial/sections/*.ts` | Individual section logic |

## Development Workflow

### 1. Start with HTML Structure

Modify `src/index.html` to create the four-section layout:

```html
<main id="app">
  <!-- Progress indicator (sticky header) -->
  <nav id="tutorial-progress" aria-label="Tutorial progress">
    <button data-section="objectives" aria-current="step">1</button>
    <button data-section="training">2</button>
    <button data-section="tour">3</button>
    <button data-section="inference">4</button>
  </nav>

  <!-- Section 1: Objectives -->
  <section id="section-objectives" class="tutorial-section">
    <h1>Training a Neural Network to Solve XOR</h1>
    <!-- Intro content -->
  </section>

  <!-- Section 2: Training (with sticky visualization) -->
  <section id="section-training" class="tutorial-section tutorial-section--split">
    <div class="tutorial-text">
      <!-- Scrollable training explanation -->
    </div>
    <div class="tutorial-viz">
      <svg id="network-svg"></svg>
      <!-- Existing visualization -->
    </div>
  </section>

  <!-- Section 3: Trained Network Tour -->
  <section id="section-tour" class="tutorial-section tutorial-section--split">
    <!-- ... -->
  </section>

  <!-- Section 4: Inference -->
  <section id="section-inference" class="tutorial-section tutorial-section--split">
    <!-- ... -->
  </section>
</main>
```

### 2. Implement Scroll Detection

Create `src/tutorial/scroll-manager.ts`:

```typescript
type SectionId = 'objectives' | 'training' | 'tour' | 'inference';

interface ScrollManagerOptions {
  onSectionEnter: (sectionId: SectionId) => void;
  onSectionExit: (sectionId: SectionId) => void;
}

export class ScrollManager {
  private observer: IntersectionObserver;

  constructor(options: ScrollManagerOptions) {
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries, options),
      { threshold: [0, 0.5], rootMargin: '-10% 0px' }
    );
  }

  observe(element: HTMLElement, sectionId: SectionId): void {
    element.dataset.sectionId = sectionId;
    this.observer.observe(element);
  }

  private handleIntersection(
    entries: IntersectionObserverEntry[],
    options: ScrollManagerOptions
  ): void {
    entries.forEach(entry => {
      const sectionId = entry.target.dataset.sectionId as SectionId;
      if (entry.isIntersecting) {
        options.onSectionEnter(sectionId);
      } else {
        options.onSectionExit(sectionId);
      }
    });
  }
}
```

### 3. Create Tutorial State

Create `src/tutorial/state.ts`:

```typescript
import type { XORInput } from '../demo/types';

export interface TutorialState {
  currentSection: SectionId;
  trainingCompleted: boolean;
  trainingInProgress: boolean;
  guidedStepsCompleted: number;
  selectedInferenceInput: XORInput;
}

const initialState: TutorialState = {
  currentSection: 'objectives',
  trainingCompleted: false,
  trainingInProgress: false,
  guidedStepsCompleted: 0,
  selectedInferenceInput: [0, 0],
};

// Simple observable state
export function createTutorialState() {
  let state = { ...initialState };
  const listeners: Set<(state: TutorialState) => void> = new Set();

  return {
    getState: () => ({ ...state }),

    setState: (updates: Partial<TutorialState>) => {
      state = { ...state, ...updates };
      listeners.forEach(fn => fn(state));
    },

    subscribe: (fn: (state: TutorialState) => void) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },

    reset: () => {
      state = { ...initialState };
      listeners.forEach(fn => fn(state));
    },
  };
}
```

### 4. Wire Up in main.ts

Modify initialization in `src/main.ts`:

```typescript
import { ScrollManager } from './tutorial/scroll-manager';
import { createTutorialState } from './tutorial/state';

const tutorialState = createTutorialState();
const scrollManager = new ScrollManager({
  onSectionEnter: (sectionId) => {
    tutorialState.setState({ currentSection: sectionId });
    // Activate section-specific behavior
  },
  onSectionExit: (sectionId) => {
    // Pause/stop processes for this section
    if (sectionId === 'training' && tutorialState.getState().trainingInProgress) {
      playbackControls.pause();
    }
  },
});

// Observe all sections
document.querySelectorAll('.tutorial-section').forEach(section => {
  scrollManager.observe(section as HTMLElement, section.id.replace('section-', '') as SectionId);
});
```

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Test Categories

1. **Unit tests**: `tests/unit/tutorial/*.test.ts`
   - State management
   - Scroll manager callbacks
   - Progress indicator logic

2. **Integration tests**: `tests/integration/tutorial-flow.test.ts`
   - Full scroll navigation
   - Section transitions
   - Training lifecycle

## Common Tasks

### Add a new key term

1. Add definition to `src/tutorial/key-terms.ts`:
```typescript
{
  id: 'new-term',
  term: 'New Term',
  shortDefinition: 'Brief explanation...',
  firstAppearance: 'training',
}
```

2. Use in HTML:
```html
<span class="key-term" data-term="new-term">new term</span>
```

### Add a guided training step

1. Define step in `src/tutorial/sections/training.ts`:
```typescript
const guidedSteps: TrainingGuidedStep[] = [
  // ... existing steps
  {
    stepNumber: 4,
    description: 'New step description',
    explanation: 'What the user should understand...',
    termsIntroduced: ['related-term'],
    animationDuration: 1000,
  },
];
```

### Debug scroll detection

Add visual debug markers:
```typescript
const observer = new IntersectionObserver(callback, {
  // ... options
});
// In browser console:
// observer.thresholds shows configured thresholds
```

## Build and Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
# (automated via GitHub Actions on push to main)
```

## Architecture Decisions

See [research.md](./research.md) for detailed rationale on:
- IntersectionObserver vs scroll event listeners
- Sticky graphic pattern for visualization
- Accessibility keyboard navigation approach
