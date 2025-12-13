# Feature Specification: Training UI Polish & Visual Enhancements

**Feature Branch**: `008-training-ui-polish`
**Created**: 2025-12-13
**Status**: Draft
**Input**: User description: "UI polish for neural network training tutorial including layout adjustments, visual training explanations, improved math displays, simplified controls, and enhanced inference visualization"

## Clarifications

### Session 2025-12-13

- Q: Should educational visualizations in Understanding Training be faster or slower than typical UI animations? → A: Moderate (2-3 seconds) - Give learners time to follow

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Improved Layout with Larger Visualization (Priority: P1)

As a learner viewing the neural network tutorial, I want the visualization to be prominently displayed and the training panel to be more compact, so I can focus on the neural network while still having access to controls.

**Why this priority**: The layout is the foundation of the user experience. A well-proportioned display with the neural network as the centerpiece ensures users can clearly see what they're learning about.

**Independent Test**: Open the tutorial and verify the neural network occupies approximately 60% of the right-hand side with a floating card effect, while the left panel is narrower with clean borders.

**Acceptance Scenarios**:

1. **Given** the tutorial is loaded on desktop, **When** viewing sections 2-4, **Then** the neural network visualization occupies approximately 60% of the viewport width on the right side
2. **Given** the tutorial is loaded, **When** viewing the neural network card, **Then** it appears to float above the background with shadow effects (not flush against a container border)
3. **Given** the training section is active, **When** viewing the left panel, **Then** it displays with compact width and thicker visual borders without extraneous text

---

### User Story 2 - Visual Training Explanations (Priority: P1)

As a learner stepping through the "Understanding Training" section, I want to see the concepts visualized on the neural network diagram as I navigate between steps, so I can understand how forward pass, loss calculation, and backpropagation work visually.

**Why this priority**: This is the core educational value of the tutorial. Without visual demonstrations synchronized with explanations, users cannot effectively learn how neural networks operate.

**Independent Test**: Navigate through the Understanding Training steps and observe corresponding animations on the network diagram.

**Acceptance Scenarios**:

1. **Given** the user is on the Forward Pass step, **When** viewing the network, **Then** neurons animate in sequence from input to output showing activation "firing"
2. **Given** the user is on the Loss Calculation step, **When** viewing the network, **Then** the output layer and loss calculation area are visually highlighted
3. **Given** the user is on the Backpropagation step, **When** viewing the network, **Then** an animation flows backward through the network showing weight adjustment propagation
4. **Given** the user is on any Understanding Training step, **When** looking at the step navigation, **Then** only Next and Previous buttons are shown (no completion marking, no key terms section)

---

### User Story 3 - Trained Network State Recognition (Priority: P2)

As a learner who has trained the network, I want the system to correctly recognize the trained state and provide appropriate visual feedback, so I can clearly see the difference between trained and untrained networks.

**Why this priority**: Users need clear feedback that training has succeeded. The current "Network Not Yet Trained" message appearing after training is confusing and undermines confidence.

**Independent Test**: Train the network, navigate to the Trained Network section, and verify trained state is recognized with pulsating animation.

**Acceptance Scenarios**:

1. **Given** the network has been trained, **When** viewing the Trained Network section, **Then** the status correctly shows the network as trained (not "Network Not Yet Trained")
2. **Given** the network has been trained, **When** navigating to the Trained Network section, **Then** the connection lines pulsate/animate to emphasize the trained state
3. **Given** the network has NOT been trained, **When** viewing the Inference section, **Then** NO "Network Not Yet Trained" message is displayed (users can still experiment)

---

### User Story 4 - Enhanced Inference Display (Priority: P2)

As a learner running inference, I want to clearly see the inputs on the network and the predicted output prominently displayed, so I can understand how the network processes data and makes predictions.

**Why this priority**: Inference is the payoff for the training process. Users need to clearly see inputs flow through the network and the resulting prediction in a prominent location.

**Independent Test**: Run inference and verify inputs appear on input neurons and prediction is prominently displayed outside the calculations panel.

**Acceptance Scenarios**:

1. **Given** inference is running, **When** viewing the input layer, **Then** the input values (0 or 1) appear as labels overlaid on the input neurons
2. **Given** inference has completed, **When** viewing the output, **Then** the predicted value is displayed prominently in a dedicated area (not buried in the calculations panel)
3. **Given** inference has completed, **When** comparing expected vs predicted, **Then** both values are clearly visible and easy to compare

---

### User Story 5 - Expanded Math Explanations (Priority: P3)

As a learner who wants to understand the mathematics, I want the "Show Math" section to comprehensively explain sigmoid activation and backpropagation weight adjustments with proper mathematical formatting, so I can understand the underlying calculations.

**Why this priority**: Mathematical understanding is valuable for deeper learning but not essential for the core tutorial experience.

**Independent Test**: Expand the Show Math section and verify it contains well-formatted explanations of sigmoid and backpropagation math.

**Acceptance Scenarios**:

1. **Given** the Show Math section is expanded, **When** viewing sigmoid explanation, **Then** the formula is displayed in proper mathematical notation (not plain text)
2. **Given** the Show Math section is expanded, **When** viewing backpropagation explanation, **Then** the weight update formula and chain rule are explained with mathematical formatting
3. **Given** the Show Math section is expanded, **When** reading about learning rate, **Then** the trade-offs of high vs low learning rates are explained clearly

---

### User Story 6 - Simplified Training Controls (Priority: P3)

As a learner, I want simplified training controls that hide advanced options while still allowing access to detailed explanations, so I can focus on learning without being overwhelmed by parameters.

**Why this priority**: Simpler controls reduce cognitive load. Advanced users can still access explanations if curious.

**Independent Test**: View the training controls and verify they are simplified with advanced options hidden but accessible.

**Acceptance Scenarios**:

1. **Given** the training section is active, **When** viewing controls, **Then** no "Step" button is visible (only continuous training)
2. **Given** the training section is active, **When** viewing controls, **Then** the learning rate slider is hidden from immediate view
3. **Given** the user wants to understand learning rate, **When** expanding the math section, **Then** detailed explanation of learning rate math and trade-offs is available
4. **Given** the training section is active, **When** viewing controls, **Then** only a Reset button is shown (no "R: Reset" keyboard shortcut notice)

---

### Edge Cases

- What happens when the network is partially trained (some improvement but not converged)? The system should recognize any training has occurred and show the trained state.
- How does the visualization handle rapid navigation between Understanding Training steps? Animations should cancel cleanly when navigating away.
- What happens if a user resizes the window during an animation? The animation should adapt or reset gracefully.
- How does the pulsating trained network animation affect performance? It should be subtle and performant (CSS-based where possible).

## Requirements *(mandatory)*

### Functional Requirements

**Layout & Visual Design**

- **FR-001**: System MUST display the neural network visualization occupying approximately 60% of the viewport width on the right side for sections 2-4
- **FR-002**: System MUST render the neural network container with a floating card effect (elevated shadow, not flush against borders)
- **FR-003**: System MUST display the left training panel with narrower width and thicker visual borders
- **FR-004**: System MUST NOT display any extraneous text labels on the panel borders

**Understanding Training Visualizations**

- **FR-005**: System MUST animate neurons firing sequentially (input to output) when the Forward Pass step is displayed
- **FR-006**: System MUST highlight the output layer and loss calculation area when the Loss Calculation step is displayed
- **FR-007**: System MUST animate weight adjustment flow backward through the network when the Backpropagation step is displayed
- **FR-008**: System MUST display only Next and Previous navigation buttons for Understanding Training steps
- **FR-009**: System MUST NOT display a "Key Terms" section in the Understanding Training area
- **FR-010**: System MUST NOT display completion markers or checkboxes for Understanding Training steps

**Training State Detection**

- **FR-011**: System MUST correctly detect and display trained network state when training has occurred
- **FR-012**: System MUST animate connection lines with a pulsating effect when viewing a trained network in the Tour section
- **FR-013**: System MUST NOT display "Network Not Yet Trained" message in the Inference section

**Inference Display**

- **FR-014**: System MUST display input values as labels overlaid on input layer neurons during inference
- **FR-015**: System MUST display the predicted output value in a prominent, dedicated area outside the calculations panel
- **FR-016**: System MUST provide clear visual comparison between expected and predicted values

**Math Explanations**

- **FR-017**: System MUST display the sigmoid activation function in proper mathematical notation
- **FR-018**: System MUST explain backpropagation weight update formula with mathematical formatting
- **FR-019**: System MUST explain learning rate trade-offs (high vs low values) within the expandable math section

**Control Simplification**

- **FR-020**: System MUST NOT display a "Step" button in training controls
- **FR-021**: System MUST hide the learning rate slider from immediate view (accessible through expandable section)
- **FR-022**: System MUST display only a Reset button (no keyboard shortcut notice text)

### Key Entities

- **TrainingStep**: Represents a step in the Understanding Training sequence (forward pass, loss, backpropagation) with associated visualization state
- **NetworkState**: Represents whether the network is untrained, training, or trained - determined by whether any training iterations have been performed
- **InferenceResult**: Contains input values, predicted output, expected output, and comparison status

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can clearly identify the neural network as the primary visual element, occupying at least 55-65% of horizontal space on desktop viewports
- **SC-002**: 100% of Understanding Training steps have corresponding visual animations that demonstrate the concept
- **SC-003**: Users correctly identify trained vs untrained network state based on visual indicators alone (no text required to understand state)
- **SC-004**: Users can identify the predicted output value within 2 seconds of inference completion without scrolling or expanding panels
- **SC-005**: Mathematical formulas are rendered with proper notation (fractions, exponents, Greek letters) rather than plain ASCII text
- **SC-006**: Training control panel contains 50% fewer visible interactive elements compared to current implementation
- **SC-007**: Educational visualizations (Understanding Training steps) complete within 2-3 seconds to allow learners time to follow; other UI animations complete within 1.5 seconds
