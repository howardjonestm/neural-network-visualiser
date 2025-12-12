# Research: Educational Enhancements

**Feature**: 002-educational-enhancements
**Date**: 2025-12-09

## Research Areas

### 1. Deeper Network Architecture for XOR

**Question**: What network architecture (layers/neurons) works well for XOR while demonstrating depth?

**Decision**: Use a 2-4-3-2-1 architecture (5 layers total)
- Input: 2 neurons (XOR inputs)
- Hidden 1: 4 neurons
- Hidden 2: 3 neurons
- Hidden 3: 2 neurons
- Output: 1 neuron (XOR result)

**Rationale**:
- XOR can be solved with 2-2-1, but a deeper network better demonstrates layer concepts
- Tapering structure (4→3→2→1) visually shows information compression
- 5 layers is deep enough to show "depth" without overwhelming the visualization
- Still converges reliably on XOR problem with appropriate learning rate (0.5-1.0)

**Alternatives Considered**:
- 2-3-3-3-1 (uniform hidden): Less visually interesting, doesn't show compression
- 2-8-4-2-1 (very wide): Too many neurons, clutters visualization
- 2-2-2-1 (4 layers): Not enough depth to demonstrate concept

### 2. Inline Hint/Callout UI Pattern

**Question**: How should inline hints be implemented for progressive disclosure?

**Decision**: CSS-positioned callout bubbles with arrow pointers
- Positioned absolutely relative to target elements
- Arrow points to the relevant UI element
- Semi-transparent background with high-contrast text
- Dismiss button (×) in corner
- State persisted in localStorage by hint ID

**Rationale**:
- Non-blocking: user can interact with underlying elements
- Clear association: arrow shows what the hint explains
- Dismissible: respects user agency
- Persistent: dismissed hints don't reappear on refresh
- No external library needed: pure CSS + minimal JS

**Alternatives Considered**:
- Modal dialogs: Blocking, violates progressive disclosure principle
- Tooltip on hover only: Insufficient for first-time guidance
- Tutorial overlay: Too heavy, interrupts natural exploration
- Third-party tour library (Shepherd.js, Intro.js): Adds bundle bloat, overkill for ~10 hints

### 3. Legend Component Design

**Question**: How should the persistent legend be structured and positioned?

**Decision**: Collapsible sidebar legend on the left side
- Default expanded on desktop (1024px+)
- Collapsible to icon-only on smaller screens
- Sections: Neurons, Weights, Layers, Training
- Each section has icon + short description
- Color swatches for weight colors (blue/red)
- Opacity gradient for activation levels

**Rationale**:
- Always visible: users can reference while exploring
- Collapsible: doesn't permanently consume space
- Left side: follows F-pattern reading, seen first
- Grouped by concept: logical organization

**Alternatives Considered**:
- Bottom bar: Competes with controls, less visible
- Overlay on hover: Hidden by default, poor discoverability
- Within network diagram: Clutters the visualization

### 4. Loss Trend Indicator

**Question**: How should loss changes be communicated to beginners?

**Decision**: Traffic light indicator + directional arrow + plain text
- Green down arrow (↓): "Getting better" when loss decreases
- Red up arrow (↑): "Getting worse" when loss increases
- Yellow dash (—): "No change" when loss is stable (<0.001 change)
- Displayed next to loss value in stats panel

**Rationale**:
- Immediate visual feedback without reading numbers
- Color + direction = redundant encoding (accessibility)
- Plain language ("Getting better") for non-technical users
- Minimal space usage

**Alternatives Considered**:
- Sparkline/chart: Requires history tracking, more complex
- Percentage change: Still requires numerical interpretation
- Color-coded loss value: Too subtle, missed by beginners

### 5. LLM Connection Content

**Question**: How to explain the connection between this demo and real AI systems?

**Decision**: Dedicated "How This Relates to AI" expandable panel in resources section
- Key points:
  1. Same building blocks: "LLMs like ChatGPT use neurons, layers, and weights just like this"
  2. Scale difference: "This has 12 neurons; GPT-4 has hundreds of billions"
  3. Training similarity: "Both learn by adjusting weights to reduce loss"
  4. Key difference: "LLMs process text tokens instead of numbers"
- Links to beginner-friendly resources (3Blue1Brown, Andrej Karpathy)

**Rationale**:
- Answers the "so what?" question for curious users
- Concrete comparison (12 vs billions) makes scale tangible
- Doesn't oversimplify (acknowledges differences)
- Provides exit ramps to deeper learning

**Alternatives Considered**:
- Inline throughout: Distracts from core learning
- Separate page: Breaks single-page simplicity
- Video embed: Increases load time, external dependency

### 6. External Learning Resources

**Question**: Which external resources should be curated?

**Decision**: Curated list of 5-7 beginner-friendly resources
1. **3Blue1Brown Neural Networks playlist** (YouTube) - Visual explanations
2. **Andrej Karpathy's "Neural Networks: Zero to Hero"** (YouTube) - Hands-on coding
3. **Neural Networks and Deep Learning** (neuralnetworksanddeeplearning.com) - Free online book
4. **TensorFlow Playground** (playground.tensorflow.org) - Interactive deeper exploration
5. **Wikipedia: Artificial Neural Network** - Reference
6. **Anthropic Research Blog** - Current AI developments (optional)

**Rationale**:
- Mix of video, interactive, and text formats
- All free and accessible
- Progressive depth (beginner → intermediate)
- Reputable sources

**Alternatives Considered**:
- Academic papers: Too advanced for target audience
- Paid courses: Accessibility barrier
- Single source: Limited perspectives

### 7. localStorage Schema for Hint State

**Question**: How should dismissed hint state be persisted?

**Decision**: Simple key-value in localStorage
```
Key: "nn-viz-hints"
Value: JSON object { "hint-id-1": true, "hint-id-2": true, ... }
```
- `true` = hint has been dismissed
- Missing key = hint should show
- Single "reset hints" button to clear all

**Rationale**:
- Minimal storage footprint
- Fast lookup (O(1) per hint)
- Easy to reset all at once
- No expiration needed (educational content doesn't change)

**Alternatives Considered**:
- Per-hint localStorage keys: Clutters storage namespace
- sessionStorage: Hints reappear every session (annoying)
- No persistence: Hints always show (also annoying)

## Technical Decisions Summary

| Area | Decision | Complexity |
|------|----------|------------|
| Network Architecture | 2-4-3-2-1 (5 layers) | Low - config change |
| Hint System | CSS callouts + localStorage | Medium - new component |
| Legend | Collapsible left sidebar | Medium - new component |
| Loss Indicator | Traffic light + arrow + text | Low - enhance existing |
| LLM Content | Expandable panel in resources | Low - static content |
| External Resources | Curated list of 5-7 links | Low - static content |
| State Persistence | localStorage JSON object | Low - simple API |

## Dependencies

No new npm dependencies required. All features implementable with:
- Existing D3.js for any SVG elements
- Native DOM APIs for hint positioning
- Native localStorage API for state
- CSS for styling and animations
