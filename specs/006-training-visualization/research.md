# Research: Training Visualization

**Feature**: 006-training-visualization
**Date**: 2025-12-11
**Status**: Complete

## Research Tasks Completed

### 1. Existing Training Infrastructure

**Question**: How does the current training system work and how can we hook into it?

**Findings**:
- `PlaybackControls` in `src/controls/playback.ts` manages training execution
- Provides `onBeforeTrainStep` and `onAfterTrainStep` hooks (lines 10-11)
- Training step processes all 4 XOR samples in sequence via `trainStep()` in `src/network/training.ts`
- Current loss display updates in `updateDisplay()` method (step count, loss value)

**Decision**: Extend existing callback hooks to emit per-sample data. Add new `onSampleProcessed` callback.

**Rationale**: Hooks are already wired in main.ts (lines 127-143). Adding granular sample-level events follows the established pattern.

**Alternatives Considered**:
- Polling approach (rejected - adds latency, not reactive)
- Event emitter pattern (rejected - over-engineering for single subscriber)

---

### 2. Weight Change Tracking

**Question**: How does the existing weight delta tracking work?

**Findings**:
- `WeightDeltaTracker` in `src/visualisation/weight-delta.ts` captures snapshots before/after training
- Computes deltas with magnitude classification: 'none' | 'small' | 'medium' | 'large'
- Thresholds: none < 0.001, small < 0.01, medium < 0.1, large >= 0.1
- `renderer.highlightWeightChanges()` applies CSS classes for visual feedback

**Decision**: Extend `WeightDelta` interface to include `direction: 'increasing' | 'decreasing' | 'stable'`

**Rationale**: Delta value already captures direction (positive/negative), just need explicit field for easier UI binding.

**Alternatives Considered**:
- Separate gradient tracker (rejected - duplicates delta tracking logic)
- Store gradient values directly (rejected - gradients are intermediate, deltas are what users see)

---

### 3. Animation Infrastructure

**Question**: Can we reuse demo animation for training forward pass visualization?

**Findings**:
- `src/demo/animation.ts` provides:
  - `animatePulse()` - pulse from neuron A to neuron B
  - `highlightNeuron()` - glow effect on neuron
  - `dimInactiveElements()` - focus attention on active layer
  - `showInputValues()` - display values on input neurons
- Speed configs handle timing: slow (2000ms), medium (1000ms), fast (500ms)
- Animation state management: `animationCancelled`, `resetAnimationState()`

**Decision**: Reuse existing animation functions. Create `trainingSampleAnimation()` wrapper that calls `showInputValues()` + layer-by-layer `animatePulse()`.

**Rationale**: Proven animation code, consistent visual language. Users familiar with demo animations will recognize training animations.

**Alternatives Considered**:
- Simplified animation (just highlight layers) - rejected for P3 story, but considered for P1/P2
- WebGL/Canvas animation (rejected - SVG approach is working, matches constitution)

---

### 4. UI Panel Placement

**Question**: Where should the training summary panel be displayed?

**Findings**:
- Current layout: Training panel (left) | Visualization (center) | Run panel (right)
- Training panel contains: Step/Play buttons, step count, loss value, learning rate
- Space available in training panel for additional content
- `LossTrendDisplay` component exists for trend arrows

**Decision**: Add training visualization section below existing stats in training panel. Include:
- Current sample display (inline with step count)
- Error display (below loss, with color coding)
- Toggle for animated training mode

**Rationale**: Keeps training-related info consolidated. Users already look at training panel during training.

**Alternatives Considered**:
- Floating overlay panel (rejected - obscures visualization)
- Separate tab/mode (rejected - adds cognitive load)
- Inline in visualization SVG (rejected - clutters network diagram)

---

### 5. Display Throttling

**Question**: How to handle rapid training updates without UI flicker?

**Findings**:
- Existing MIN_VISUAL_INTERVAL = 100ms in main.ts (line 65)
- Debounce already applied to `highlightWeightChanges()` calls
- Training runs at 30fps (33ms per frame) when playing

**Decision**: Keep 100ms throttle for visual updates. Display updates queue and show latest values (not every intermediate value).

**Rationale**: Users can't perceive updates faster than ~100ms. Showing latest value maintains accuracy without visual noise.

**Alternatives Considered**:
- Faster updates (50ms) - rejected, causes flicker
- Slower updates (200ms) - rejected, feels laggy

---

### 6. Color Coding for Errors

**Question**: What color scheme for error magnitude?

**Findings**:
- Constitution requires WCAG AA contrast (4.5:1 minimum)
- Existing palette uses blue (#3b82f6) for highlights
- Loss trend uses green/red arrows
- Neuron fill uses HSL with lightness 25-85%

**Decision**: Use gradient from green (#22c55e at error < 0.1) through yellow (#eab308 at error 0.3) to red (#ef4444 at error > 0.5)

**Rationale**: Traffic light metaphor is universally understood. These colors meet WCAG AA against white background.

**Alternatives Considered**:
- Single color with opacity (rejected - violates constitution on color-only info)
- Blue-to-orange gradient (rejected - less intuitive than green-yellow-red)

---

### 7. Gradient Direction Indicators

**Question**: How to visually indicate weight increase vs decrease?

**Findings**:
- Current weight lines use stroke-width for magnitude
- Classes `weight-increase` / `weight-decrease` exist but only used for CSS highlight colors
- No directional arrows currently

**Decision**: Add small triangular arrowheads on weight lines during/after training step:
- Upward-pointing (▲) for increasing weights
- Downward-pointing (▼) for decreasing weights
- Arrow size proportional to delta magnitude
- Auto-hide after 500ms (matches existing highlight fade)

**Rationale**: Arrows are clear directional indicators. Small size doesn't obscure weight lines. Transient display reduces visual clutter.

**Alternatives Considered**:
- Color-only (green up, red down) - rejected, constitution requires shape/pattern not just color
- Animated arrows - rejected, too distracting during continuous training
- Persistent arrows - rejected, clutters visualization

---

## Summary

All research questions resolved. Key decisions:

1. **Per-sample tracking**: Add `onSampleProcessed` callback to PlaybackControls
2. **Weight direction**: Extend WeightDelta with explicit direction field
3. **Animation reuse**: Wrap existing demo animations for training mode
4. **Panel location**: Training summary in existing training panel
5. **Throttling**: Keep 100ms interval, show latest values
6. **Error colors**: Green-yellow-red gradient (WCAG AA compliant)
7. **Gradient arrows**: Transient triangular indicators on weight lines

Ready for Phase 1: Data model and quickstart guide.
