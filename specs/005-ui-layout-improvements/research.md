# Research: UI Layout Improvements

**Feature**: 005-ui-layout-improvements
**Date**: 2025-12-11
**Status**: Complete

## Research Topics

### 1. CSS Grid Layout for Two-Panel Controls

**Decision**: Use CSS Grid with `grid-template-columns: 1fr 1fr` for training/run control split

**Rationale**:
- CSS Grid provides clean two-column layout without JavaScript
- Responsive: collapses to single column on smaller screens with `@media` queries
- Existing codebase uses CSS Grid for `#app` layout - consistent approach
- Flexbox would work but Grid is cleaner for fixed column counts

**Alternatives Considered**:
- Flexbox with `flex: 1` - Less semantic for defined column layout
- Absolute positioning - Fragile, doesn't respond to content changes
- Table layout - Outdated, semantic mismatch

### 2. Neuron Color Intensity System

**Decision**: Use HSL color model with fixed hue, variable lightness based on activation (0-1)

**Rationale**:
- Current neuron fill uses `fill-opacity` which makes neurons look transparent/hollow
- Solid fill with varying lightness creates stronger visual signal
- HSL allows direct mapping: activation 0 → lightness 85% (light), activation 1 → lightness 25% (dark)
- Formula: `hsl(220, 70%, ${85 - activation * 60}%)` for blue-based theme
- Maintains WCAG AA contrast at both extremes

**Implementation**:
```css
/* Low activation (near 0) */
fill: hsl(220, 70%, 85%);  /* Light blue */

/* High activation (near 1) */
fill: hsl(220, 70%, 25%);  /* Dark blue */
```

**Alternatives Considered**:
- RGB interpolation - Harder to maintain perceptual uniformity
- Multiple discrete colors - Loses continuous feedback
- Opacity only - Current approach, appears hollow

### 3. Title Positioning

**Decision**: Use CSS to align header to top-left via `text-align: left` and grid placement

**Rationale**:
- Current title is centered, feels disconnected from content
- Top-left is conventional for web applications
- Minor CSS change, no HTML restructuring needed
- Maintains responsive behavior

**Implementation**:
```css
header {
  text-align: left;
  padding-left: 1rem;
}
```

### 4. Panel Removal Strategy

**Decision**: Remove HTML elements and CSS rules; remove JavaScript initialization calls

**Rationale**:
- Legend container (`#legend-container`) - unused, hidden on mobile anyway
- Resources panel (`#resources-container`) - initialization in main.ts creates ResourcesPanel
- Both components exist in `src/education/` but their usage should be removed from main.ts
- HTML containers should be removed from index.html
- Dead code (the component files) can remain for potential future use

**Files to Modify**:
- `src/index.html` - Remove `<aside id="legend-container">` and resources container
- `src/main.ts` - Remove Legend and ResourcesPanel imports and initialization
- `src/styles.css` - CSS rules can remain (no harm, may be reused)

### 5. Control Section Labeling

**Decision**: Rename "Demo" section to "Run Network" with clear section headers

**Rationale**:
- "Demo" is ambiguous - could mean demonstration, could mean test mode
- "Run Network" clearly indicates: provide input, see output
- Training section already has "Training" context from playback controls
- Add visible section headers for clarity

**Implementation**:
- Add `<h3>` headers within control panels: "Train Network" and "Run Network"
- Update any text references in UI from "Demo" to "Run Network"

### 6. Weight/Bias Tooltip Content

**Decision**: Extend existing Tooltip class to show educational content alongside values

**Rationale**:
- Tooltip class already exists and handles positioning
- Weight hover already shows value via `showWeight()` method
- Need to add: brief explanation text
- Neuron tooltip (activation) already shows formula - follow same pattern

**Implementation for Weights**:
```
Weight: 0.523
Change: +0.012 (this step)

Weights control how strongly one neuron
influences another. Positive = excitation,
negative = inhibition.
```

**Implementation for Biases**:
```
Bias: -0.234

Bias shifts when this neuron activates.
Higher bias = easier activation,
lower bias = harder activation.
```

### 7. Grid Layout for Controls

**Decision**: Two-column grid with Training on left, Run Network on right

**Current State** (from styles.css analysis):
- `#controls` uses flexbox with `flex-wrap: wrap`
- `#demo-controls` is a separate container below

**New Layout**:
```
+---------------------------+---------------------------+
|     Train Network         |      Run Network          |
| - Step / Play buttons     | - Input selector          |
| - Learning rate slider    | - Run button              |
| - Reset button            | - Step through controls   |
| - Loss display            | - Prediction display      |
+---------------------------+---------------------------+
```

**CSS Implementation**:
```css
#controls-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 768px) {
  #controls-container {
    grid-template-columns: 1fr;
  }
}
```

## Resolved Clarifications

All technical unknowns from Technical Context have been resolved:

1. **Color system for neurons**: HSL with variable lightness (researched above)
2. **Layout approach**: CSS Grid for two-column controls (researched above)
3. **Panel removal**: Remove from HTML and main.ts initialization (researched above)
4. **Terminology**: "Run Network" replaces "Demo" (researched above)

## Dependencies

No new dependencies required. All implementations use:
- Existing D3.js for SVG manipulation
- Native CSS Grid (browser support is universal)
- Existing Tooltip class

## Performance Considerations

- HSL color calculation is negligible (simple arithmetic)
- CSS Grid layout is hardware-accelerated
- Removing unused panels reduces DOM nodes and initialization time
- No additional event listeners or animations added

## Accessibility Impact

- Maintain keyboard navigation for all controls
- Neuron color intensity must pass WCAG AA (4.5:1 contrast ratio)
- Section headers improve screen reader navigation
- Weight/bias tooltip text provides non-visual information
