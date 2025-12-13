# Feature Specification: Interactive Neural Network Training Tutorial

**Feature Branch**: `007-nn-training-tutorial`
**Created**: 2025-12-13
**Status**: Draft
**Input**: User description: "Turn neural-network-visualiser into interactive scroll-based tutorial that guides users through training a neural network to predict XOR outcomes, with four progressive sections covering objectives, training process, trained network tour, and inference demonstration"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Complete Tutorial Journey (Priority: P1)

A learner visits the tutorial to understand how neural networks work. They scroll through the entire experience, starting with an introduction to XOR and neural network objectives, progressing through guided training steps where they see weights being set, then touring the trained network, and finally observing inference in action with expected vs actual outputs.

**Why this priority**: This is the core value proposition - the complete educational journey from novice to understanding. Without the full scroll-based progression, the tutorial cannot deliver its pedagogical goals.

**Independent Test**: Can be fully tested by scrolling from top to bottom and verifying each section appears in sequence with appropriate content and interactivity.

**Acceptance Scenarios**:

1. **Given** a user opens the tutorial, **When** the page loads, **Then** they see Section 1 (Objectives) explaining that we're training a neural network to predict XOR outcomes
2. **Given** a user is in Section 1, **When** they scroll down, **Then** Section 2 (Training) smoothly comes into view with the neural network visualization
3. **Given** a user completes all sections, **When** they reach the bottom, **Then** they have encountered explanations of all key terms: weights, neurons, layers, activation, loss, forward pass, backpropagation, inference, expected vs predicted output

---

### User Story 2 - Guided Training Experience (Priority: P1)

A learner reaches the training section and is guided through iterating a few training steps with animation active. Key terms are explained as they become relevant. The "animate training" button is removed in favour of guided step-by-step progression with explanatory text, followed by the ability to run full training while observing loss reduction.

**Why this priority**: The training section is the heart of the tutorial - users must understand how training works through guided interaction before running it themselves.

**Independent Test**: Can be fully tested by reaching Section 2 and following the guided training steps, verifying explanations appear and animations play correctly.

**Acceptance Scenarios**:

1. **Given** a user reaches Section 2, **When** the neural network comes into view, **Then** they see that weights are not yet set (randomized/untrained state) with explanatory text
2. **Given** a user is in the training section, **When** they trigger a training step, **Then** they see animated weight updates with accompanying explanation of what's happening
3. **Given** a user wants to see the mathematics, **When** they request more detail, **Then** they can view the calculations for weights and activations without being overwhelmed
4. **Given** a user has completed guided steps, **When** they choose to run full training, **Then** they can observe loss decreasing with explanation of its significance

---

### User Story 3 - Trained Network Tour (Priority: P2)

After training completes, the learner scrolls to Section 3 which provides a tour of the trained network. This section highlights that weights are now set, training is complete, and allows exploration of the trained state.

**Why this priority**: Understanding the difference between untrained and trained states reinforces learning but depends on completing the training section first.

**Independent Test**: Can be fully tested by completing Section 2 and scrolling to Section 3, verifying the trained network display and explanatory content.

**Acceptance Scenarios**:

1. **Given** a user has completed training in Section 2, **When** they scroll to Section 3, **Then** they see the network with trained weights highlighted
2. **Given** a user is viewing the trained network, **When** they explore the visualization, **Then** explanatory text confirms that training is complete and weights have been optimized
3. **Given** a user hovers over network elements, **When** viewing trained weights, **Then** they can see the final weight values that were learned

---

### User Story 4 - Inference Demonstration (Priority: P2)

In Section 4, the learner sees inference in action. The tutorial shows the expected XOR output for given inputs, then demonstrates the network's actual prediction, emphasizing how reduced loss brings predicted values closer to expected values.

**Why this priority**: Inference demonstration proves the value of training and connects back to the XOR objective stated in Section 1, but requires all prior sections.

**Independent Test**: Can be fully tested by reaching Section 4 and observing the inference demonstration with expected vs actual comparisons.

**Acceptance Scenarios**:

1. **Given** a user reaches Section 4, **When** viewing an XOR input combination, **Then** they see the expected output prominently displayed
2. **Given** a user triggers inference, **When** the network processes the input, **Then** they see the actual predicted value alongside the expected value
3. **Given** predicted and expected values are displayed, **When** the user observes the difference, **Then** explanatory text emphasizes how loss reduction during training minimized this gap

---

### User Story 5 - Scroll Navigation and Progress (Priority: P3)

Users can scroll freely forward and backward through the tutorial. A progress indicator shows their position. The tutorial smoothly transitions between sections as the user scrolls.

**Why this priority**: Navigation enhances usability but the core educational content can be delivered without sophisticated scroll indicators.

**Independent Test**: Can be fully tested by scrolling up and down through all sections and observing smooth transitions.

**Acceptance Scenarios**:

1. **Given** a user is anywhere in the tutorial, **When** they scroll up, **Then** they return to previous sections with content still visible
2. **Given** a user scrolls through sections, **When** they change scroll direction, **Then** the transition is smooth without jarring jumps
3. **Given** a user is navigating, **When** they look for their position, **Then** a progress indicator shows which section they are in

---

### Edge Cases

- When a user scrolls very quickly through sections, active processes are stopped and the user arrives at the scrolled-to section (no gating or blocking)
- When users scroll back to Section 2 after completing training, the system shows the trained state (network cannot be "un-trained" within the session)
- If a user navigates directly to Section 4 without completing training, they can view the section but see untrained network results with an explanatory note indicating training has not been completed
- How does the tutorial behave on devices with limited scroll capability or touch-only interfaces?
- What happens if the user resizes the browser window while in a specific section?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST present content in a scroll-based linear progression through four distinct sections
- **FR-002**: System MUST display Section 1 (Objectives) explaining that the goal is to train a neural network to predict XOR outcomes
- **FR-003**: System MUST display Section 2 (Training) with the neural network visualization and guided training steps
- **FR-004**: System MUST remove the existing "animate training" button from the interface
- **FR-005**: System MUST provide guided step-through training with animations showing weight updates
- **FR-006**: System MUST explain key terms (weights, neurons, layers, activation, loss, forward pass, backpropagation) as they become relevant during the tutorial
- **FR-007**: System MUST show the network in an untrained/randomized state when Section 2 first comes into view
- **FR-008**: System MUST allow users to view mathematics behind weight calculations without overwhelming the primary experience
- **FR-009**: System MUST allow users to run full training after completing guided steps
- **FR-010**: System MUST display loss and explain its significance during training
- **FR-011**: System MUST display Section 3 (Trained Network Tour) highlighting that weights are now set
- **FR-012**: System MUST display Section 4 (Inference) demonstrating expected vs actual output values
- **FR-013**: System MUST explain how loss reduction brings predicted values closer to expected values
- **FR-014**: System MUST support scrolling in both directions to navigate between sections
- **FR-015**: System MUST provide smooth transitions between tutorial sections during scroll
- **FR-016**: System MUST use scroll for section navigation and click/tap for in-section interactions (training steps, inference triggers)
- **FR-017**: System MUST stop any active process (e.g., running training) when user scrolls away from that section

### Key Entities

- **Tutorial Section**: A distinct phase of the learning journey (Objectives, Training, Trained Tour, Inference) with associated content, visualizations, and interactions
- **Key Term**: An educational concept (weight, neuron, layer, activation, loss, etc.) with definition and contextual explanation
- **Training Step**: A discrete iteration of the training process that can be animated and explained
- **Scroll Progress**: The user's current position within the tutorial, used to trigger section transitions and content reveals

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete the full tutorial experience (all 4 sections) through scroll navigation
- **SC-002**: Users encounter explanations for at least 5 key neural network terms during the tutorial
- **SC-003**: The guided training section provides at least 3 animated step-through examples before offering full training
- **SC-004**: Users can view mathematical details for weight calculations on demand
- **SC-005**: The inference section clearly displays both expected XOR output and actual network prediction for comparison
- **SC-006**: Users can navigate backward to any previous section by scrolling up
- **SC-007**: 90% of users can identify the difference between untrained and trained network states after completing the tutorial
- **SC-008**: Tutorial content progressively reveals as user scrolls, building context before introducing new concepts

## Clarifications

### Session 2025-12-13

- Q: When a user scrolls back to Section 2 after completing training, what state should they see? → A: Always show trained state (current network state, cannot "un-train")
- Q: What happens if a user scrolls directly to Section 4 without completing training? → A: Allow viewing but show untrained network results with explanatory note
- Q: How should users progress through sections and interact with training/inference? → A: Scroll navigates between sections; click triggers in-section interactions (training steps, inference); scrolling away from a section stops any active process

## Assumptions

- The existing neural network visualization, training logic, and demo functionality will be preserved and integrated into the tutorial structure
- Standard scroll-based navigation patterns (similar to popular interactive storytelling sites) will be familiar to users
- Mathematical detail views will be opt-in (collapsed by default) to avoid overwhelming casual learners
- The tutorial targets users with no prior neural network knowledge
- Modern browser support for scroll events and smooth transitions is sufficient for the target audience
