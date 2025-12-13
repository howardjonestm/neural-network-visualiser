# Feature Specification: Training UX Improvements

**Feature ID**: 009-training-ux-improvements
**Date**: 2025-12-13
**Status**: Draft

## Overview

Comprehensive UX improvements to make the neural network training tutorial more intuitive, interactive, and visually engaging. This spec addresses user feedback on simplifying controls, enhancing visualizations, and creating a more cohesive learning experience.

## Problem Statement

The current training tutorial has several UX issues:
1. Training controls are cluttered with duplicate information and unnecessary options
2. Understanding Training steps lack synchronized visualizations that bring the text to life
3. The "Show Math" section is disconnected from the training steps it relates to
4. The Trained Network section has confusing state messages and buttons
5. Run Network has too many controls (speed, step navigation) that don't add value
6. Users aren't encouraged to interact with the network during training
7. Predicted values aren't prominently displayed

## User Stories

### US1: Synchronized Training Step Visualizations
**As a** learner navigating Understanding Training
**I want** the network visualization to animate in sync with each step (Forward Pass, Calculate Loss, Backpropagation)
**So that** I can see what each concept looks like in practice

**Acceptance Criteria:**
- When viewing "Forward Pass" step, neurons animate sequentially from input to output
- When viewing "Calculate Loss" step, output layer is highlighted with loss indication
- When viewing "Backpropagation" step, weights animate backward showing gradient flow
- Animations trigger automatically when user navigates to each step
- Animations can replay if user revisits a step

### US2: Contextual Math Explanations
**As a** learner wanting deeper understanding
**I want** the "Show Math" content to appear within each Understanding Training step
**So that** it's obvious which math relates to which concept

**Acceptance Criteria:**
- Each training step (Forward Pass, Loss, Backprop) has its own expandable math section
- Math content is contextual to that specific step
- Sigmoid formula appears in Forward Pass step
- Loss formula appears in Calculate Loss step
- Weight update formula and learning rate explanation appear in Backpropagation step

### US3: Simplified Training Controls
**As a** user training the network
**I want** minimal, clear controls
**So that** I can focus on learning rather than interface complexity

**Acceptance Criteria:**
- Play and Reset buttons displayed horizontally together, styled in blue
- Remove "Training Controls" section title
- Remove "Reset Network" section title
- Remove duplicate Steps/Loss display (show only once)
- Keep green indicator for converged/trained state
- Remove or simplify the `[1, 1] -> expects 0` training sample display
- Remove the learning rate slider from immediate view (keep in advanced settings if needed)

### US4: Clean Trained Network Section
**As a** user exploring the trained network
**I want** a clean interface without confusing messages
**So that** I can focus on understanding the trained state

**Acceptance Criteria:**
- Remove "Network not yet trained" message completely
- Remove "Highlight strong weights" button
- Show signal/activation flowing through the network to create interactive feeling
- Weights pulsate subtly to indicate trained state (existing behavior)

### US5: Streamlined Run Network Controls
**As a** user running inference
**I want** simple controls focused on the result
**So that** I understand what the network predicts

**Acceptance Criteria:**
- Remove speed selector (1x, 2x, 4x options)
- Remove Previous and Next step buttons
- Make calculations section collapsible/expandable (collapsed by default)
- Prominently display predicted value on the left information panel
- Prominently display predicted value on the neural network visualization itself
- Clear visual distinction between expected and predicted values

### US6: Interactive Training Encouragement
**As a** new user
**I want** to be encouraged to interact with the network during training
**So that** I discover I can watch weights and nodes change in real-time

**Acceptance Criteria:**
- Prompt or hint encouraging users to hover/click on weights and nodes
- Consider momentarily showing a tooltip/panel as user scrolls to training section
- Visual cues that weights are interactive (subtle hover effects already exist)

### US7: Real-time Signal Visualization
**As a** user watching training or exploring the trained network
**I want** to see signal/activation flowing through the network
**So that** I get an intuitive sense of how data moves through layers

**Acceptance Criteria:**
- During training: periodic visualization of forward pass signal flow
- On Trained Network section: continuous subtle signal animation
- Signal visualization doesn't interfere with weight change animations
- Can be toggled or plays automatically based on context

## Functional Requirements

### FR-001: Auto-triggering Training Step Animations
- Forward pass animation triggers when user navigates to Forward Pass step
- Loss highlight animation triggers when user navigates to Calculate Loss step
- Backpropagation animation triggers when user navigates to Backpropagation step
- Use existing animation functions from `renderer.ts` (animateForwardPass, animateLossHighlight, animateBackpropagation)

### FR-002: Contextual Math Panels
- Move math content from standalone "Show Math" section into each training step
- Create three separate expandable math sections
- Forward Pass math: sigmoid formula, activation calculation
- Calculate Loss math: MSE formula, error calculation
- Backpropagation math: weight update formula, learning rate trade-offs

### FR-003: Horizontal Play/Reset Layout
- Play and Reset buttons in single horizontal row
- Both buttons styled with blue background (primary action color)
- Equal sizing for visual balance

### FR-004: Remove Section Titles
- Remove "Training Controls" heading
- Remove "Reset Network" heading
- Keep minimal visual separation between control groups

### FR-005: Single Stats Display
- Show Steps and Loss only once (in training info area)
- Remove duplicate display from other sections
- Keep green convergence indicator

### FR-006: Remove Training Sample Display
- Remove `[1, 1] -> expects 0` sample indicator
- Or replace with simpler "Training on XOR patterns" text if context needed

### FR-007: Remove Trained Network Messages
- Delete "Network not yet trained" conditional message
- Delete "Highlight strong weights" button and associated functionality

### FR-008: Signal Flow Animation
- Create new animation showing activation values flowing through network
- Use color intensity or traveling dots/pulses along weight lines
- Trigger on Trained Network section visibility
- Subtle, non-distracting animation

### FR-009: Remove Run Network Complexity
- Delete speed selector (1x/2x/4x buttons)
- Delete Previous/Next step navigation buttons
- Wrap calculations in collapsible `<details>` element, collapsed by default

### FR-010: Prominent Prediction Display
- Large, clear predicted value in left panel
- Predicted value shown on/near output neuron in visualization
- Color coding: green for correct, red for incorrect prediction

### FR-011: Interaction Hints
- Show hint on first visit to Training section encouraging weight/node interaction
- Hint dismissible and remembers dismissal (localStorage)
- Consider scroll-triggered hint reveal

## Non-Functional Requirements

### NFR-001: Performance
- Animations maintain 30fps minimum
- Signal flow animation uses GPU-accelerated CSS properties
- No layout thrashing during animations

### NFR-002: Accessibility
- All removed buttons maintain keyboard alternatives where needed
- Animation respects prefers-reduced-motion
- Expandable sections keyboard accessible

### NFR-003: Mobile Responsiveness
- Horizontal button layout stacks vertically on narrow screens
- Collapsible sections work on touch devices

## Out of Scope

- Changes to network architecture or training algorithm
- New training data patterns beyond XOR
- Persistent state across page reloads (beyond hint dismissal)
- Audio feedback

## Technical Considerations

### Files to Modify
- `src/tutorial/sections/training.ts` - Training step animations, math integration
- `src/tutorial/sections/tour.ts` - Remove messages/buttons, add signal animation
- `src/tutorial/sections/inference.ts` - Simplify controls, prominent prediction
- `src/controls/playback.ts` - Horizontal layout, remove titles
- `src/controls/reset.ts` - Horizontal layout, remove title
- `src/controls/parameters.ts` - Ensure hidden by default
- `src/visualisation/renderer.ts` - Signal flow animation, prediction overlay
- `src/demo/controls.ts` - Remove speed/step controls, collapsible calculations
- `src/styles.css` - New layouts, animation styles
- `src/education/content.ts` - Reorganize math content per step

### Dependencies
- Existing animation functions in renderer.ts
- D3.js for signal flow visualization
- CSS transitions for UI simplifications

## Success Metrics

| ID | Metric | Target |
|----|--------|--------|
| SM-001 | Training control button count | Reduced from 4+ to 2 (Play, Reset) |
| SM-002 | Section titles removed | 2 titles removed |
| SM-003 | Run Network controls | Reduced from 5+ to 2 (input selector, run button) |
| SM-004 | Animation sync with steps | 100% of training steps have visualization |
| SM-005 | Prediction visibility | Visible within 1 second of inference completion |

## Open Questions

1. Should signal flow animation be continuous or pulse periodically?
2. Should interaction hints show once per session or once ever?
3. For mobile, should we keep expandable math or show it inline?

## Revision History

| Date | Author | Changes |
|------|--------|---------|
| 2025-12-13 | Claude | Initial specification from user feedback |
