# Feature Specification: Training Insights

**Feature Branch**: `004-training-insights`
**Created**: 2025-12-11
**Status**: Draft
**Input**: User description: "Feature improvements from specs/004-feature-ideas.md focusing on weight change visualization and activation function explanations"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visualize Weight Changes During Training (Priority: P1)

As a learner, I want to see how weights change during training so I can understand that the network is actually learning and adjusting itself.

**Why this priority**: Users report that training feels like a "black box" - they can't see that anything is happening. Weight visualization directly addresses this core educational gap.

**Independent Test**: Can be fully tested by running training steps and observing visual feedback on weight connections - delivers immediate understanding of the learning process.

**Acceptance Scenarios**:

1. **Given** a network with visible weights, **When** the user clicks "Train Step", **Then** weights that increased show a brief green flash or color shift
2. **Given** a network with visible weights, **When** the user clicks "Train Step", **Then** weights that decreased show a brief red flash or color shift
3. **Given** a network after training, **When** the user hovers over a weight connection, **Then** a tooltip shows the current weight value and how much it changed from the previous step
4. **Given** a user training the network, **When** multiple training steps occur, **Then** the cumulative change in weight thickness/color reflects the magnitude of the weight

---

### User Story 2 - Understand Activation Function Mathematics (Priority: P2)

As a learner, I want to understand how the activation function transforms neuron inputs so I can grasp the mathematics behind neural network decision-making.

**Why this priority**: Understanding activation functions is fundamental to neural network comprehension, but secondary to seeing that learning is happening.

**Independent Test**: Can be fully tested by hovering over any neuron and verifying the tooltip displays the activation formula and values - delivers mathematical understanding.

**Acceptance Scenarios**:

1. **Given** a network displaying neuron activations, **When** the user hovers over a hidden or output neuron, **Then** a tooltip appears showing the activation function formula
2. **Given** a hovering tooltip on a neuron, **When** viewing the tooltip, **Then** it displays the pre-activation value (weighted sum + bias) and post-activation value
3. **Given** a hovering tooltip on a neuron, **When** viewing the tooltip, **Then** it shows a mini visualization (curve or number line) indicating where the current value falls on the activation function
4. **Given** an input neuron, **When** the user hovers over it, **Then** the tooltip shows that input neurons pass through values unchanged (no activation function applied)

---

### User Story 3 - Track Weight Delta History (Priority: P3)

As a learner who wants to analyze training patterns, I want to see the recent history of weight changes so I can identify which connections are learning the most.

**Why this priority**: Nice-to-have feature that adds depth for advanced learners, but not essential for basic understanding.

**Independent Test**: Can be fully tested by training several steps and clicking on a weight to see its change history - delivers pattern recognition capability.

**Acceptance Scenarios**:

1. **Given** a network that has been trained for several steps, **When** the user clicks on a weight connection, **Then** a panel shows the last 10 weight values and their deltas
2. **Given** a weight history panel, **When** reviewing the data, **Then** increases and decreases are color-coded consistently with the main visualization

---

### Edge Cases

- What happens when weight changes are extremely small (near-zero)? The visualization should have a minimum threshold before showing visual feedback to avoid noise.
- How does the system handle weights that oscillate (alternating increase/decrease)? The visualization should still be clear and not create confusing flickering.
- What happens when the user hovers during an animation? The tooltip should remain stable and readable.
- How does the activation tooltip handle very large or very small pre-activation values? Numbers should be formatted appropriately (scientific notation or rounding).

## Requirements *(mandatory)*

### Functional Requirements

**Weight Change Visualization:**
- **FR-001**: System MUST visually indicate when a weight has increased after a training step
- **FR-002**: System MUST visually indicate when a weight has decreased after a training step
- **FR-003**: System MUST distinguish between small, medium, and large weight changes in the visualization
- **FR-004**: Weight change indicators MUST appear after training and fade over 500ms
- **FR-005**: System MUST provide hover tooltips on weight connections showing current value and recent change

**Activation Function Explanation:**
- **FR-006**: System MUST display activation function information when hovering over hidden/output neurons
- **FR-007**: Neuron tooltips MUST show the activation function formula (sigmoid: 1/(1+e^-x))
- **FR-008**: Neuron tooltips MUST display the current pre-activation value (weighted sum)
- **FR-009**: Neuron tooltips MUST display the current post-activation value
- **FR-010**: Input neuron tooltips MUST indicate that no activation function is applied
- **FR-011**: Neuron tooltips MUST include a visual representation of where the value falls on the activation curve

**Weight History (P3):**
- **FR-012**: System MUST track weight value history (last 10 steps) during training session
- **FR-013**: Users MUST be able to view recent weight change history for any connection
- **FR-014**: Weight history MUST be cleared when the network is reset/reinitialized

### Key Entities

- **WeightDelta**: Represents the change in a weight value between training steps (previous value, current value, change amount)
- **ActivationTooltip**: Information displayed when hovering over a neuron (formula, pre-activation, post-activation, visual curve position)
- **WeightHistory**: Collection of recent weight values for a specific connection (used for P3 history feature)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify which weights changed after a training step within 2 seconds of clicking "Train Step"
- **SC-002**: Users can determine whether a weight increased or decreased by visual inspection alone (no need to read numbers)
- **SC-003**: Users can view the activation function formula and current values for any hidden/output neuron within 1 second of hovering
- **SC-004**: 80% of first-time users report understanding "what training does" after 5 minutes of interaction with the visualization
- **SC-005**: The weight change visualization remains smooth and readable during rapid training (10+ steps per second)
- **SC-006**: Activation tooltips display values with appropriate precision (2-4 decimal places for normal values, scientific notation for extreme values)

## Clarifications

### Session 2025-12-11

- Q: What color scheme should be used for weight change visualization? → A: Green = increased, Red = decreased (standard metrics convention)
- Q: How long should weight change indicators remain visible before fading? → A: 500ms (balanced - noticeable but not intrusive)
- Q: How many training steps should be retained in weight history? → A: Last 10 steps

## Assumptions

- The existing neural network visualizer already displays weight connections and neuron activations
- Sigmoid is the current (and only) activation function, though the design should accommodate future additions
- Weight change visualization uses color/brightness changes rather than animation complexity to maintain performance
- Tooltips use standard hover interaction patterns (appear on hover, disappear on mouse-out)
- The visualization prioritizes clarity over visual complexity - changes should be obvious, not subtle
