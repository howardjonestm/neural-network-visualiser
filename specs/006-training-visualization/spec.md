# Feature Specification: Training Visualization

**Feature Branch**: `006-training-visualization`
**Created**: 2025-12-11
**Status**: Draft
**Input**: User description: "Add training visualization features: show current training sample, display error/loss per sample, animate forward pass during training, highlight most-changed weights, show gradient direction indicators, and display training progress summary panel"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Training Progress Summary (Priority: P1)

As a learner, I want to see a real-time summary of training progress so I can understand how the network is improving over time.

**Why this priority**: This provides the foundational context that all other training visualizations build upon. Without knowing the current step, loss, and what sample is being trained, other visualizations lack meaning.

**Independent Test**: Click "Play" to train and verify the summary panel displays current step count, loss value, and which training sample is being used.

**Acceptance Scenarios**:

1. **Given** the network is training, **When** a training step completes, **Then** the summary panel updates to show "Step N | Loss: X.XXX | Learning: [input]→output"
2. **Given** training is paused or stopped, **When** I view the summary panel, **Then** it shows the last training state
3. **Given** I reset the network, **When** I view the summary panel, **Then** it clears or shows initial state

---

### User Story 2 - Current Training Sample Display (Priority: P1)

As a learner, I want to see which input/output pair the network is currently learning from so I understand the training data being used.

**Why this priority**: Understanding which sample is being trained is essential for following the learning process and connects directly to the error/loss display.

**Independent Test**: During training, verify the display shows "Training on: [0,1] → expects 1" (or similar) for each sample as it's processed.

**Acceptance Scenarios**:

1. **Given** training begins, **When** a sample is processed, **Then** display shows the input values and expected output for that sample
2. **Given** training cycles through XOR samples [0,0], [0,1], [1,0], [1,1], **When** each sample is processed, **Then** the display updates to show the current sample
3. **Given** training is not active, **When** I view the training panel, **Then** no current sample is shown or last sample is indicated as "Last trained"

---

### User Story 3 - Per-Sample Error Display (Priority: P1)

As a learner, I want to see the network's output compared to the expected output for each training sample so I understand why weights need to adjust.

**Why this priority**: Seeing the error is crucial for understanding backpropagation - it answers "why are weights changing?" which is central to learning neural networks.

**Independent Test**: During training, verify display shows "Output: 0.73, Expected: 1, Error: -0.27" format for the current sample.

**Acceptance Scenarios**:

1. **Given** a training step completes, **When** the error is calculated, **Then** display shows actual output, expected output, and the difference
2. **Given** the network prediction is close to expected, **When** viewing error display, **Then** error value is small and visually indicated as "good" (e.g., green coloring)
3. **Given** the network prediction is far from expected, **When** viewing error display, **Then** error value is large and visually indicated as "needs improvement" (e.g., red coloring)

---

### User Story 4 - Weight Change Highlighting (Priority: P2)

As a learner, I want to see which weights are changing the most during training so I can understand where learning is happening in the network.

**Why this priority**: This builds on existing partial weight change highlighting and helps users visualize where learning is concentrated.

**Independent Test**: During training, observe that weights changing significantly are visually distinct from those changing minimally.

**Acceptance Scenarios**:

1. **Given** training completes a step, **When** weights are updated, **Then** weights with largest absolute changes are highlighted more prominently
2. **Given** I hover over a highlighted weight, **When** viewing the tooltip, **Then** I see the magnitude of the recent change
3. **Given** the network approaches convergence, **When** training continues, **Then** weight highlights become less intense as changes become smaller

---

### User Story 5 - Gradient Direction Indicators (Priority: P2)

As a learner, I want to see which direction each weight is being pushed (increasing or decreasing) so I understand how backpropagation adjusts the network.

**Why this priority**: This adds educational depth by showing not just that weights change, but the direction of change, making gradient descent more tangible.

**Independent Test**: During training, verify weights show visual indicators (arrows or color coding) for whether they're increasing or decreasing.

**Acceptance Scenarios**:

1. **Given** a weight value increases after training, **When** viewing the weight, **Then** it shows an "increasing" indicator (e.g., upward arrow or specific color)
2. **Given** a weight value decreases after training, **When** viewing the weight, **Then** it shows a "decreasing" indicator (e.g., downward arrow or specific color)
3. **Given** a weight barely changes, **When** viewing the weight, **Then** no direction indicator is shown (below threshold)

---

### User Story 6 - Training Forward Pass Animation (Priority: P3)

As a learner, I want to see the training sample flow through the network with animations so I can visualize how data propagates during training.

**Why this priority**: This is a more advanced visualization that enhances understanding but requires the simpler displays to be meaningful. It reuses existing demo animation infrastructure.

**Independent Test**: Enable animated training mode and verify pulses flow from input through hidden layers to output during each training step.

**Acceptance Scenarios**:

1. **Given** animated training is enabled, **When** a training step begins, **Then** animated pulses show the forward pass from input to output
2. **Given** animated training is enabled, **When** forward pass completes, **Then** the output neuron briefly highlights showing the network's prediction
3. **Given** animated training is disabled (default), **When** training proceeds, **Then** training runs at full speed without animation delays

---

### Edge Cases

- What happens when training speed is set to maximum? Animation should be skippable or auto-disabled at high speeds.
- How does the display handle rapid training steps? Use throttling to ensure display updates are readable (not flashing).
- What happens if user hovers over a weight during training? Tooltip should update dynamically (already implemented).
- How does the system handle training completion (loss near zero)? Display should indicate "converged" or similar status.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a training progress summary panel showing step count, current loss, and current training sample
- **FR-002**: System MUST show the current training sample in format "[input values] → expects [output]" during training
- **FR-003**: System MUST display per-sample error showing actual output, expected output, and error difference
- **FR-004**: System MUST color-code error values (green for small errors, red for large errors)
- **FR-005**: System MUST highlight weights based on the magnitude of their change during training
- **FR-006**: System MUST provide visual indication of gradient direction (weight increasing vs decreasing)
- **FR-007**: System MUST support optional animated forward pass during training
- **FR-008**: System MUST allow users to toggle training animation on/off
- **FR-009**: System MUST throttle display updates to maintain readability during rapid training
- **FR-010**: System MUST preserve all existing training functionality (Step, Play, Pause, Reset, learning rate adjustment)
- **FR-011**: System MUST update training display within 100ms of each training step completion
- **FR-012**: System MUST clear or reset training display when network is reset

### Key Entities

- **TrainingSample**: Input values (array), expected output, used during training iteration
- **TrainingStep**: Step number, current sample, forward pass output, error, loss, weight deltas
- **WeightChange**: Weight ID, previous value, new value, delta, direction (increasing/decreasing), magnitude classification

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify which training sample is being processed within 1 second of step completion
- **SC-002**: Users can determine if network prediction is improving by viewing error display without additional calculations
- **SC-003**: Users can identify the 3 most-changed weights visually during any training step
- **SC-004**: Training speed is not noticeably degraded when visualizations are enabled (less than 10% slowdown)
- **SC-005**: 80% of users in testing can correctly explain what the error value means after observing 5 training steps
- **SC-006**: All training visualizations update synchronously - no stale or inconsistent data between display elements
- **SC-007**: Training progress summary is readable at all supported playback speeds
- **SC-008**: Animated training mode provides educational value without making training impractically slow (completes XOR training in under 60 seconds with animation enabled)

## Assumptions

- XOR training data consists of 4 fixed samples: [0,0]→0, [0,1]→1, [1,0]→1, [1,1]→0
- Training iterates through all 4 samples per "step" (one epoch = one step)
- Existing weight change highlighting infrastructure can be extended for magnitude and direction indicators
- The training panel on the left side of the UI has sufficient space for new display elements
- Users are assumed to have basic understanding that neural networks learn by adjusting weights based on errors
