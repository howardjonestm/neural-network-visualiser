# Data Model: UI Layout Improvements

**Feature**: 005-ui-layout-improvements
**Date**: 2025-12-11

## Overview

This feature primarily involves UI/layout changes with minimal data model impact. The existing entities (Neuron, Weight, Layer) remain unchanged. This document captures the visualization-specific data structures affected.

## Existing Entities (Unchanged)

### Neuron
```typescript
interface Neuron {
  id: string;              // Unique identifier
  layerIndex: number;      // Which layer (0 = input)
  positionInLayer: number; // Position within layer
  bias: number;            // Bias value
  activation: number;      // Current activation (0-1 for sigmoid)
  preActivation: number;   // Value before activation function
  delta: number;           // Error delta for backpropagation
}
```

### Weight
```typescript
interface Weight {
  id: string;           // Unique identifier
  fromNeuronId: string; // Source neuron
  toNeuronId: string;   // Target neuron
  value: number;        // Current weight value
  gradient: number;     // Gradient for updates
}
```

### Layer
```typescript
interface Layer {
  index: number;        // Layer position
  type: LayerType;      // 'input' | 'hidden' | 'output'
  neurons: Neuron[];    // Neurons in this layer
  size: number;         // Number of neurons
}
```

## Visualization Entities (Modified)

### NeuronDisplayConfig (New)

Captures how a neuron should be visually rendered.

```typescript
interface NeuronDisplayConfig {
  fill: string;           // HSL color string based on activation
  stroke: string;         // Border color
  strokeWidth: number;    // Border width
}
```

**Derivation Rules**:
- `fill` = `hsl(220, 70%, ${85 - activation * 60}%)`
  - activation = 0 → lightness 85% (light blue)
  - activation = 1 → lightness 25% (dark blue)
- `stroke` = `#374151` (consistent border)
- `strokeWidth` = 2px (default), 3px (hover)

### TooltipContent (Extended)

Extended to include educational explanations.

```typescript
interface WeightTooltipContent {
  value: number;              // Current weight value
  delta?: number;             // Change from last training step
  deltaMagnitude?: string;    // 'small' | 'medium' | 'large' | 'none'
  explanation: string;        // Educational text
}

interface BiasTooltipContent {
  value: number;              // Current bias value
  explanation: string;        // Educational text
}
```

**Static Explanations**:
- Weight: "Weights control connection strength between neurons. Positive weights excite, negative weights inhibit."
- Bias: "Bias shifts the activation threshold. Higher bias makes the neuron activate more easily."

### ControlPanelConfig (New)

Configuration for reorganized control layout.

```typescript
interface ControlPanelConfig {
  position: 'left' | 'right';
  title: string;
  controls: string[];  // IDs of control elements
}

const TRAINING_PANEL: ControlPanelConfig = {
  position: 'left',
  title: 'Train Network',
  controls: ['playback-controls', 'parameter-controls', 'reset-controls', 'loss-display']
};

const RUN_PANEL: ControlPanelConfig = {
  position: 'right',
  title: 'Run Network',
  controls: ['input-selector', 'demo-button', 'step-controls', 'prediction-display']
};
```

## CSS Custom Properties (Extended)

```css
:root {
  /* Existing */
  --color-positive: #2563eb;
  --color-negative: #dc2626;
  --color-neuron-stroke: #374151;

  /* New for intensity-based fills */
  --neuron-hue: 220;           /* Blue hue */
  --neuron-saturation: 70%;    /* Moderate saturation */
  --neuron-lightness-low: 85%; /* For activation = 0 */
  --neuron-lightness-high: 25%;/* For activation = 1 */
}
```

## State Changes

### Removed State

The following are removed from application state:

```typescript
// In main.ts, these will be removed:
let legend: Legend;           // No longer initialized
let resourcesPanel: ResourcesPanel;  // No longer initialized
```

### HTML Structure Changes

**Before**:
```html
<main id="app">
  <header>...</header>
  <aside id="legend-container">...</aside>
  <section id="visualisation">...</section>
  <aside id="controls-container">
    <div id="controls">...</div>
    <div id="demo-controls">...</div>
    <div id="resources-container">...</div>
  </aside>
</main>
```

**After**:
```html
<main id="app">
  <header>...</header>
  <section id="visualisation">...</section>
  <aside id="controls-container">
    <div id="training-panel" class="control-panel">
      <h3>Train Network</h3>
      <div id="controls">...</div>
    </div>
    <div id="run-panel" class="control-panel">
      <h3>Run Network</h3>
      <div id="demo-controls">...</div>
    </div>
  </aside>
</main>
```

## Validation Rules

### Neuron Activation Bounds
- Range: [0, 1] (sigmoid output)
- HSL lightness mapping must stay within [25%, 85%] for WCAG compliance

### Weight Display
- Format: Fixed decimal (3 places)
- Color: Green for positive delta, red for negative

### Bias Display
- Format: Fixed decimal (3 places)
- Only shown for hidden/output neurons (input neurons have no bias)

## Entity Relationships

```
Network
├── layers[]
│   └── neurons[]
│       ├── activation → NeuronDisplayConfig.fill
│       └── bias → BiasTooltipContent
└── weights[]
    └── value, gradient → WeightTooltipContent
```

## Migration Notes

No data migration required. All changes are:
1. CSS styling changes (neuron fill)
2. HTML structure changes (panel removal, layout)
3. JavaScript initialization changes (remove unused components)
4. Tooltip content additions (static text)

The underlying neural network data model remains unchanged.
