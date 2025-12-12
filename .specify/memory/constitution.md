<!--
SYNC IMPACT REPORT
==================
Version change: 0.0.0 → 1.0.0 (Initial constitution creation)

Modified principles: N/A (new constitution)

Added sections:
- Core Principles (5 principles defined)
- Technical Constraints (static hosting, client-side only)
- User Experience Standards (accessibility, progressive disclosure)
- Governance

Removed sections: N/A

Templates requiring updates:
- .specify/templates/plan-template.md - ✅ Compatible (no changes needed)
- .specify/templates/spec-template.md - ✅ Compatible (no changes needed)
- .specify/templates/tasks-template.md - ✅ Compatible (no changes needed)

Follow-up TODOs: None
==================
-->

# Neural Network Visualiser Constitution

## Core Principles

### I. Visual-First Design

All features MUST prioritize visual representation over textual explanation.
Complex concepts MUST be demonstrated through interactive animations and
diagrams before being described in text. The visualisation is the primary
teaching tool; text serves only to support and contextualise what users see.

**Rationale**: Users learn neural network concepts more effectively through
seeing how weights adjust in real-time than reading about matrix operations.
The raft.github.io approach demonstrates that complex distributed systems
concepts become accessible when users can watch them in action.

### II. Educational Clarity

Every visual element MUST map directly to a neural network concept (neuron,
layer, weight, bias, activation). Users MUST be able to:
- Identify individual neurons and understand their role
- See weights as visible connections with values
- Observe how biases affect neuron outputs
- Watch weight adjustments during learning

No visual element may exist purely for aesthetic purposes; all must teach.

**Rationale**: The goal is comprehension, not impression. Users should leave
with a primitive but accurate mental model of how neural networks function.

### III. Static Deployment

The entire application MUST function as a static website deployable to GitHub
Pages with zero server-side dependencies. All computation MUST occur in the
browser using JavaScript/TypeScript. No database, API calls, or build-time
computation may be required for the core visualisation to function.

**Rationale**: Accessibility requires minimal friction. Users should access
the visualiser via a single URL without installation, accounts, or waiting
for server responses.

### IV. Progressive Disclosure

Information MUST be layered from simple to complex. Initial view shows only
the network structure and basic animation. Advanced details (matrix math,
gradient calculations, backpropagation steps) MUST be hidden by default and
revealed through deliberate user interaction.

**Rationale**: Beginners need immediate visual feedback without cognitive
overload. Advanced users can drill down into mathematical details when ready.
This mirrors the raft.github.io approach of starting with a live simulation
before linking to papers and implementations.

### V. Interactivity Over Passivity

Users MUST be able to interact with the visualisation, not merely observe it.
Required interactions include:
- Triggering training steps manually or via play/pause
- Adjusting learning rate and seeing immediate effects
- Hovering/clicking to inspect specific weights and neurons
- Resetting the network to observe different training runs

**Rationale**: Active participation creates deeper understanding than passive
observation. Users who can experiment with parameters develop intuition about
why neural networks behave as they do.

## Technical Constraints

### Deployment Requirements

- MUST deploy as static files (HTML, CSS, JS) to GitHub Pages
- MUST NOT require any backend services or APIs
- MUST work in modern browsers (Chrome, Firefox, Safari, Edge latest 2 versions)
- MUST load and become interactive within 3 seconds on standard connections
- SHOULD remain functional offline once initially loaded

### Technology Boundaries

- Client-side rendering only (no SSR required)
- Vanilla JS/TS or lightweight frameworks acceptable (no heavy frameworks
  that bloat bundle size beyond 500KB gzipped)
- SVG or Canvas for visualisations; WebGL optional for performance
- No external runtime dependencies for core functionality

## User Experience Standards

### Accessibility

- MUST support keyboard navigation for all interactive elements
- MUST provide sufficient color contrast (WCAG AA minimum)
- SHOULD provide alternative text descriptions for key visual states
- MUST NOT rely solely on color to convey information (use shape/pattern)

### Responsive Design

- MUST function on desktop viewports (1024px+)
- SHOULD adapt gracefully to tablet viewports (768px-1023px)
- MAY provide limited functionality on mobile (display only, reduced
  interactivity acceptable)

### Performance

- Initial render MUST complete within 1 second
- Animation frame rate MUST maintain 30fps minimum during training
- No user interaction may block the main thread for >100ms

## Governance

This constitution establishes the non-negotiable principles for the Neural
Network Visualiser project. All implementation decisions MUST align with
these principles.

### Amendment Process

1. Proposed changes MUST be documented with rationale
2. Changes affecting core principles require explicit justification of why
   the educational mission is better served
3. Technical constraint changes must demonstrate necessity
4. Version increment follows semantic versioning:
   - MAJOR: Core principle changes
   - MINOR: New sections or significant guidance expansion
   - PATCH: Clarifications and wording improvements

### Compliance

- All pull requests MUST verify alignment with Visual-First Design (Principle I)
- Features adding text without corresponding visualisation require explicit
  justification referencing Principle II
- Any proposed backend dependency violates Principle III and requires
  constitution amendment before consideration

**Version**: 1.0.0 | **Ratified**: 2025-12-09 | **Last Amended**: 2025-12-09
