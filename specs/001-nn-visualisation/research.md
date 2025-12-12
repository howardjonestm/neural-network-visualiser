# Research: Neural Network Visualisation

**Date**: 2025-12-09
**Feature**: 001-nn-visualisation

## Technology Decisions

### 1. Visualisation Library

**Decision**: D3.js v7

**Rationale**:
- Excellent for custom network visualizations with educational focus
- Native SVG rendering provides accessibility benefits (DOM elements, screen readers)
- Rich ecosystem of neural network and graph visualization examples
- Smooth animation support via `d3-transition`
- Built-in tooltip and hover interaction patterns
- ~75KB gzipped (fits well within 500KB budget)
- Large community and extensive documentation

**Alternatives Considered**:

| Library | Size | Verdict |
|---------|------|---------|
| Konva.js | 55KB | Rejected: Canvas-based lacks DOM accessibility |
| Canvas API | 0KB | Rejected: High dev effort for hit detection, poor accessibility |
| Vanilla SVG | 0KB | Rejected: Manual animation handling, limited interactivity patterns |
| p5.js | 351KB | Rejected: Exceeds reasonable size, overkill for this use case |

### 2. Build Tooling

**Decision**: Vite

**Rationale**:
- Fast development server with hot module replacement
- Optimized production builds with tree-shaking
- Native TypeScript support without configuration
- Outputs static files perfect for GitHub Pages
- Zero-config for simple projects

**Alternatives Considered**:

| Tool | Verdict |
|------|---------|
| Webpack | Rejected: Configuration overhead, slower builds |
| Parcel | Acceptable but Vite faster and more modern |
| No bundler | Rejected: TypeScript requires compilation |

### 3. Language

**Decision**: TypeScript 5.x

**Rationale**:
- Type safety critical for neural network math (weight matrices, dimensions)
- Catches dimension mismatches at compile time
- Better IDE support for development
- Compiles to clean ES2020 JavaScript

**Alternatives Considered**:

| Language | Verdict |
|----------|---------|
| JavaScript | Acceptable but lacks type safety for math |
| CoffeeScript | Rejected: Outdated, poor ecosystem |

### 4. Testing Framework

**Decision**: Vitest

**Rationale**:
- Native Vite integration (same config)
- Fast execution with ESM support
- Jest-compatible API
- Good TypeScript support

**Alternatives Considered**:

| Framework | Verdict |
|-----------|---------|
| Jest | Acceptable but slower, needs ESM config |
| Mocha | Acceptable but requires more setup |

### 5. Neural Network Architecture

**Decision**: XOR Problem with 2-2-1 Architecture

**Rationale**:
- Classic educational example that demonstrates non-linear learning
- Small enough to visualize clearly (2 input, 2 hidden, 1 output = 5 neurons)
- Converges reliably with proper initialization
- Shows meaningful weight changes during training
- Well-documented expected behavior for verification

**Architecture Details**:
- Input layer: 2 neurons (X1, X2)
- Hidden layer: 2 neurons (with sigmoid activation)
- Output layer: 1 neuron (with sigmoid activation)
- Total connections: 6 weights (4 input-hidden + 2 hidden-output)
- Total biases: 3 (2 hidden + 1 output)

**Training Data** (built-in):
```
Input     Expected Output
[0, 0] -> 0
[0, 1] -> 1
[1, 0] -> 1
[1, 1] -> 0
```

**Alternatives Considered**:

| Problem | Verdict |
|---------|---------|
| AND/OR gates | Rejected: Linearly separable, doesn't show hidden layer value |
| MNIST digits | Rejected: Too many neurons to visualize clearly |
| Sine wave | Acceptable but XOR more classic for education |

### 6. Weight Initialization

**Decision**: Xavier (Glorot) Initialization

**Rationale**:
- Standard practice for sigmoid activations
- Prevents vanishing/exploding gradients at initialization
- Well-documented mathematical basis
- Leads to faster, more stable convergence

**Formula**: `weight = random(-sqrt(6/(n_in + n_out)), sqrt(6/(n_in + n_out)))`

### 7. Activation Function

**Decision**: Sigmoid (Logistic)

**Rationale**:
- Output bounded [0, 1] - easy to visualize as intensity
- Smooth gradient - good for educational animation
- Classic for introductory neural network education
- Derivative is simple: `sigmoid(x) * (1 - sigmoid(x))`

**Alternatives Considered**:

| Function | Verdict |
|----------|---------|
| ReLU | Rejected: Dying neurons confusing for beginners |
| Tanh | Acceptable but sigmoid more classic for education |

### 8. Visual Encoding

**Decision**: Line thickness + color gradient for weights

**Rationale**:
- Thickness shows magnitude (thick = large absolute value)
- Color shows sign (blue = positive, red = negative)
- Combined encoding doesn't rely solely on color (accessibility)
- Neuron activation shown as fill opacity

**Encoding Scheme**:
- Weight line thickness: `1px + abs(weight) * 3px` (capped at 6px)
- Weight line color: Blue (#2563eb) for positive, Red (#dc2626) for negative
- Neuron fill: Grayscale based on activation (0 = white, 1 = black)
- Bias: Shown in tooltip, not encoded visually (avoids clutter)

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| D3 learning curve | Use minimal D3 features; focus on selections, transitions, scales |
| XOR may not converge sometimes | Use Xavier init; add "stuck" detection; reset button |
| Animation performance | Throttle to 30fps; use requestAnimationFrame |
| Browser compatibility | Target ES2020; test Chrome/Firefox/Safari |

## Open Questions (Resolved)

1. ~~Which visualization library?~~ → D3.js
2. ~~What network architecture?~~ → 2-2-1 XOR
3. ~~How to encode weights visually?~~ → Thickness + color
4. ~~What activation function?~~ → Sigmoid
