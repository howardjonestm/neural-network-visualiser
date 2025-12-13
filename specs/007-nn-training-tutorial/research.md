# Research: Interactive Neural Network Training Tutorial

**Feature**: 007-nn-training-tutorial
**Date**: 2025-12-13

## Research Questions

1. How to implement scroll-based section transitions for a D3.js/TypeScript application?
2. Best practices for detecting section visibility and triggering animations
3. How to stop/pause processes when user scrolls away from a section
4. Accessibility considerations for scroll-based tutorials

---

## Decision 1: Scroll Detection Approach

**Decision**: Use native IntersectionObserver API (no external library)

**Rationale**:
- The application already uses vanilla TypeScript with minimal dependencies (only D3.js)
- IntersectionObserver is well-supported in all modern browsers (95%+)
- Adding Scrollama.js or similar would increase bundle size for functionality we can implement directly
- The project's constitution emphasizes keeping the bundle under 500KB gzipped

**Alternatives Considered**:
- **Scrollama.js**: Excellent library but adds dependency; IntersectionObserver is the underlying API anyway
- **GSAP ScrollTrigger**: Powerful but overkill for our discrete section transitions; also adds significant bundle size
- **Scroll event listeners**: Poor performance, blocks main thread

**Implementation Pattern**:
```typescript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      activateSection(entry.target);
    } else {
      deactivateSection(entry.target);
    }
  });
}, {
  threshold: [0, 0.5, 1.0],
  rootMargin: "-10% 0px"
});
```

---

## Decision 2: Section Transition Pattern

**Decision**: Use the "Sticky Graphic" pattern with the neural network visualization fixed in viewport while tutorial content scrolls

**Rationale**:
- This is the industry-standard pattern (Pudding.cool, NYT interactives, raft.github.io)
- The neural network visualization is the focal point - it should remain visible as context scrolls
- Allows continuous visual reference while explanatory text enters/exits
- Matches user expectations from interactive storytelling sites

**Alternatives Considered**:
- **Full-page sections**: Each section takes full viewport - requires scroll-jacking, violates constitution principles
- **Side-by-side layout throughout**: Less immersive for intro/conclusion sections
- **Collapsible sections**: More app-like than tutorial-like; loses scroll narrative flow

**Layout Structure**:
```
┌──────────────────────────────────────────────────┐
│ Section 1: Objectives (full-width, scrolls out)  │
├──────────────────────────────────────────────────┤
│ [Tutorial Text]      │ [Neural Network Viz]      │
│ (scrolls)            │ (sticky/fixed)            │
│ Section 2: Training  │                           │
│ Section 3: Tour      │                           │
│ Section 4: Inference │                           │
├──────────────────────────────────────────────────┤
│ Footer/End (scrolls in)                          │
└──────────────────────────────────────────────────┘
```

---

## Decision 3: Animation Triggering

**Decision**: Discrete section-based animations using D3 transitions, triggered by IntersectionObserver callbacks

**Rationale**:
- D3 transitions are already used throughout the codebase
- Discrete animations (not scrubbed) match the educational goal: complete one concept before moving to the next
- Simpler to implement and maintain than scroll-scrubbed animations
- Better for accessibility: animations complete regardless of scroll speed

**Alternatives Considered**:
- **Scroll-scrubbed animations**: Ties animation progress to scroll position; could feel sluggish or too fast depending on user scroll behavior
- **CSS scroll-driven animations**: Good performance but limited control for complex D3 visualizations
- **requestAnimationFrame manual loop**: More control but more code; D3 transitions handle this

**Trigger Points**:
- Section enters viewport at 50% visibility: trigger "enter" animation
- Section exits viewport: trigger "pause/stop" behavior

---

## Decision 4: Process Lifecycle Management

**Decision**: Implement section activation/deactivation callbacks that pause/stop running processes when sections exit viewport

**Rationale**:
- FR-017 requires stopping active processes when scrolling away
- Prevents resource waste from off-screen animations
- Ensures training state is preserved when user scrolls back
- Matches existing playback control patterns in the codebase

**Implementation Approach**:
```typescript
interface TutorialSection {
  id: string;
  element: HTMLElement;
  onActivate: () => void;   // Called when section enters viewport
  onDeactivate: () => void; // Called when section exits viewport
}

// Example: Training section
trainingSection.onDeactivate = () => {
  if (isTrainingRunning) {
    playbackControls.pause(); // Pause, don't reset
  }
  cancelAnimation();
};
```

---

## Decision 5: Accessibility Approach

**Decision**: Provide keyboard navigation as a first-class alternative to scroll, with proper ARIA landmarks

**Rationale**:
- Constitution requires keyboard navigation for all interactive elements
- Some users cannot use scroll (screen reader users, keyboard-only users)
- Progress indicator doubles as navigation: users can click/keyboard to section buttons
- Native browser scroll remains respected (no scroll-jacking)

**Implementation**:
1. **Section navigation**: Buttons in progress indicator allow keyboard users to jump to any section
2. **Tab navigation**: Each section's interactive elements are tabbable
3. **ARIA landmarks**: Sections marked with `role="region"` and `aria-label`
4. **Focus management**: When jumping to a section, focus moves to that section's heading
5. **Motion preferences**: Respect `prefers-reduced-motion` for all transitions

```html
<nav aria-label="Tutorial progress">
  <button data-section="objectives" aria-current="step">1. Objectives</button>
  <button data-section="training">2. Training</button>
  <button data-section="tour">3. Trained Network</button>
  <button data-section="inference">4. Inference</button>
</nav>

<section id="objectives" role="region" aria-label="Tutorial objectives">
  <h2 tabindex="-1">What We're Building</h2>
  <!-- Content -->
</section>
```

---

## Decision 6: Key Term Display Mechanism

**Decision**: Contextual inline definitions with optional expandable detail panels

**Rationale**:
- Constitution Principle IV (Progressive Disclosure) requires layered information
- FR-006 requires explaining key terms as they become relevant
- Inline tooltips/popovers keep user in context without full page navigation
- Expandable panels allow "view math" without overwhelming primary experience

**Alternatives Considered**:
- **Sidebar glossary**: Pulls attention away from main content
- **Modal dialogs**: Disruptive to scroll flow
- **Footnotes**: Traditional but doesn't fit interactive tutorial format
- **Fixed tooltip on hover**: Good for quick reference but not for extended explanations

**Implementation**:
```html
<span class="key-term" data-term="weight">
  weights
  <span class="term-indicator" aria-hidden="true">?</span>
</span>

<!-- On click/focus, shows: -->
<div class="term-popup" role="tooltip">
  <strong>Weight</strong>: A numerical value that determines the strength
  of a connection between neurons...
  <button class="show-math">Show mathematics</button>
</div>
```

---

## Decision 7: Tutorial State Management

**Decision**: Create a dedicated TutorialState module that tracks current section, training completion status, and network state

**Rationale**:
- Multiple sections need to coordinate state (e.g., Section 3 needs to know if training completed)
- FR-007 requires showing untrained state initially; clarifications require remembering training completion
- Existing `demoStateMachine` pattern provides a good model
- Centralized state prevents prop-drilling and simplifies section communication

**State Shape**:
```typescript
interface TutorialState {
  currentSection: 'objectives' | 'training' | 'tour' | 'inference';
  trainingCompleted: boolean;
  trainingInProgress: boolean;
  guidedStepsCompleted: number; // Track for SC-003 (at least 3 steps)
  selectedInferenceInput: XORInput;
}
```

---

## Integration with Existing Codebase

### Files to Modify

| File | Changes |
|------|---------|
| `src/index.html` | Restructure into scroll sections; add progress nav |
| `src/main.ts` | Initialize tutorial state; wire up scroll observer |
| `src/styles.css` | Add section layouts, sticky positioning, transitions |
| `src/visualisation/training-panel.ts` | Remove "animate training" button (FR-004) |

### Files to Create

| File | Purpose |
|------|---------|
| `src/tutorial/state.ts` | Tutorial state management |
| `src/tutorial/scroll-manager.ts` | IntersectionObserver setup, section callbacks |
| `src/tutorial/progress-indicator.ts` | Navigation/progress UI component |
| `src/tutorial/key-terms.ts` | Term definitions and popup logic |
| `src/tutorial/sections/objectives.ts` | Section 1 content and behavior |
| `src/tutorial/sections/training.ts` | Section 2: guided training integration |
| `src/tutorial/sections/tour.ts` | Section 3: trained network exploration |
| `src/tutorial/sections/inference.ts` | Section 4: inference demo integration |

### Preserved Functionality

All existing modules remain functional:
- `src/network/*` - Core neural network logic unchanged
- `src/visualisation/*` - Rendering unchanged, used by all sections
- `src/demo/*` - Integrated into Section 4 (Inference)
- `src/education/*` - Content used throughout tutorial sections
- `src/controls/*` - Training controls integrated into Section 2

---

## Performance Considerations

1. **Single IntersectionObserver**: Observe all sections with one observer (more efficient than multiple)
2. **Debounced resize handler**: Already exists in codebase; apply to section layout recalculation
3. **Lazy section initialization**: Only initialize interactive elements when section first becomes visible
4. **Animation cleanup**: Cancel pending D3 transitions when deactivating sections
5. **Memory management**: Unobserve sections when tutorial is complete/unmounted

---

## Open Questions Resolved

All NEEDS CLARIFICATION items from Technical Context have been resolved:
- Scroll detection: IntersectionObserver (native API)
- Animation library: D3 transitions (existing)
- Section transitions: Sticky graphic pattern
- Accessibility: Keyboard navigation buttons + ARIA landmarks
