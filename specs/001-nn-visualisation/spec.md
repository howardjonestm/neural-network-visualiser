# Feature Specification: Neural Network Visualisation

**Feature Branch**: `001-nn-visualisation`
**Created**: 2025-12-09
**Status**: Draft
**Input**: User description: "Build neural network visualisation in JavaScript with appropriate visualisation libraries"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Network Structure (Priority: P1)

A user visits the visualiser webpage and immediately sees a visual representation
of a simple neural network. The network displays input neurons, hidden layer
neurons, and output neurons as distinct visual elements. Connections between
neurons are visible as lines, with each connection representing a weight.

**Why this priority**: This is the foundational visual that all other features
build upon. Without seeing the network structure, no other learning can occur.
This delivers immediate value by showing users what a neural network "looks like."

**Independent Test**: Can be fully tested by loading the page and verifying that
neurons appear in distinct layers with visible connections between them. Delivers
the core educational value of showing network architecture.

**Acceptance Scenarios**:

1. **Given** a user loads the page for the first time, **When** the page finishes
   loading, **Then** they see a neural network diagram with clearly distinguishable
   input, hidden, and output layers within 3 seconds.

2. **Given** the network is displayed, **When** the user looks at the visualisation,
   **Then** each neuron is visually distinct (circle/node shape) and connections
   between layers are visible as lines.

3. **Given** the network is displayed, **When** the user counts the neurons,
   **Then** they can identify which layer each neuron belongs to through spatial
   arrangement (left-to-right flow from input to output).

---

### User Story 2 - Inspect Weights and Biases (Priority: P2)

A user can hover over or click on network elements to inspect their values. When
hovering over a connection line, the current weight value is displayed. When
hovering over a neuron, the bias value and current activation are shown.

**Why this priority**: After understanding network structure, users need to see
the actual numerical values that make the network function. This builds on P1
by adding the "what are the numbers" layer of understanding.

**Independent Test**: Can be tested by hovering over connections and neurons
and verifying that numerical values appear. Delivers understanding of weights
and biases as concrete numbers.

**Acceptance Scenarios**:

1. **Given** the network is displayed, **When** the user hovers over a connection
   line, **Then** a tooltip or label shows the weight value for that connection.

2. **Given** the network is displayed, **When** the user hovers over a neuron,
   **Then** they see the neuron's bias value and current activation value.

3. **Given** weight and bias values are displayed, **When** the user reads them,
   **Then** the values are formatted as readable numbers (e.g., "0.342" not
   scientific notation for typical ranges).

---

### User Story 3 - Watch Training in Action (Priority: P3)

A user can trigger training steps and watch weights adjust in real-time. They
can play/pause automatic training or step through one iteration at a time.
During training, connection line thickness or colour changes to reflect weight
magnitude, showing how the network learns.

**Why this priority**: This is the key educational payoff - seeing weights
actually change. Depends on P1 (structure) and benefits from P2 (inspecting
values) but delivers the "how weights get adjusted" understanding.

**Independent Test**: Can be tested by clicking train/step buttons and
observing visual changes in connection appearance. Delivers understanding
of learning as weight adjustment.

**Acceptance Scenarios**:

1. **Given** the network is displayed, **When** the user clicks a "Train Step"
   button, **Then** one forward pass and backpropagation cycle executes, and
   connection visuals update to reflect new weight values.

2. **Given** training is available, **When** the user clicks "Play", **Then**
   training runs continuously until "Pause" is clicked, with visible animation
   of weight changes.

3. **Given** training is running, **When** weights change, **Then** the visual
   representation of connections updates (via thickness, colour intensity, or
   similar visual encoding) to show weight magnitude changes.

4. **Given** the user is watching training, **When** they observe connections,
   **Then** they can see that some weights increase while others decrease,
   demonstrating that learning involves differential adjustment.

---

### User Story 4 - Adjust Learning Parameters (Priority: P4)

A user can modify the learning rate using a slider or input field and immediately
see how this affects training speed and stability. A higher learning rate shows
faster but potentially unstable weight changes; a lower rate shows slower,
smoother convergence.

**Why this priority**: Builds intuition about hyperparameters after users
understand the basic training process. Nice-to-have for deeper learning but
not essential for basic understanding.

**Independent Test**: Can be tested by changing learning rate value and
observing different training behaviour. Delivers intuition about learning
rate effects.

**Acceptance Scenarios**:

1. **Given** training controls are visible, **When** the user adjusts the
   learning rate slider, **Then** the displayed learning rate value updates
   immediately.

2. **Given** a higher learning rate is set, **When** training runs, **Then**
   weight changes per step are larger (visually noticeable bigger jumps).

3. **Given** a lower learning rate is set, **When** training runs, **Then**
   weight changes per step are smaller (smoother, more gradual visual changes).

---

### User Story 5 - Reset and Experiment (Priority: P5)

A user can reset the network to random initial weights and run training again.
This allows them to observe that different starting points lead to different
training trajectories, reinforcing that initialisation matters.

**Why this priority**: Supports experimentation and deeper exploration after
understanding the core concepts. Enables users to verify their mental models
through repeated observation.

**Independent Test**: Can be tested by resetting the network and verifying
weights return to new random values. Delivers understanding of initialisation
and reproducibility.

**Acceptance Scenarios**:

1. **Given** a trained network, **When** the user clicks "Reset", **Then**
   all weights and biases are re-initialised to new random values.

2. **Given** the network was reset, **When** training runs again, **Then**
   the user can observe a different training trajectory than the previous run.

---

### Edge Cases

- What happens when weights become very large (exploding gradients)? Visual
  encoding should cap at maximum thickness/intensity with an indicator that
  values exceed normal range.

- What happens when weights approach zero (vanishing)? Connections should
  remain visible but appear faded/thin rather than disappearing entirely.

- What happens if the user rapidly clicks train steps? System should queue
  or debounce to maintain smooth animation without freezing.

- What happens on page resize? Network visualisation should scale appropriately
  to remain visible and interactive within new viewport dimensions.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a feedforward neural network with at least
  3 layers (input, one hidden, output) on page load.

- **FR-002**: System MUST render each neuron as a distinct visual element
  positioned to clearly indicate layer membership.

- **FR-003**: System MUST render each weight as a visible connection between
  neurons, with visual encoding (thickness, colour, or opacity) representing
  weight magnitude.

- **FR-004**: System MUST show weight values on hover/interaction with
  connection elements.

- **FR-005**: System MUST show bias and activation values on hover/interaction
  with neuron elements.

- **FR-006**: System MUST provide a control to execute a single training step
  (forward pass + backpropagation).

- **FR-007**: System MUST provide play/pause controls for continuous training.

- **FR-008**: System MUST animate weight changes during training so users can
  observe the learning process.

- **FR-009**: System MUST provide a control to adjust learning rate with
  immediate effect on subsequent training steps.

- **FR-010**: System MUST provide a reset control that re-initialises all
  weights and biases to new random values.

- **FR-011**: System MUST maintain smooth animation during training visualisation.

- **FR-012**: System MUST function entirely in the browser without any server
  communication after initial page load.

- **FR-013**: System MUST support keyboard navigation for all interactive
  controls (play, pause, step, reset, learning rate adjustment).

- **FR-014**: System MUST provide sufficient colour contrast and not rely
  solely on colour to convey weight magnitude information.

### Key Entities

- **Neuron**: A computational unit with a bias value and activation output.
  Belongs to exactly one layer. Receives weighted inputs and produces output.

- **Layer**: An ordered collection of neurons. Types: input (receives external
  data), hidden (intermediate computation), output (produces final result).

- **Weight**: A numerical value on a connection between two neurons in adjacent
  layers. Adjusted during training to improve network performance.

- **Bias**: A numerical value added to a neuron's weighted sum before activation.
  Each non-input neuron has one bias.

- **Network**: The complete collection of layers, neurons, weights, and biases.
  Has a fixed architecture (layer sizes) but variable parameter values.

- **Training Step**: One complete cycle of forward propagation (computing
  outputs) and backpropagation (adjusting weights based on error).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify the three core components (neurons, weights,
  biases) within 30 seconds of viewing the visualisation.

- **SC-002**: Users can explain what happens during a training step after
  watching 5 training iterations.

- **SC-003**: Page loads and displays the network visualisation within 3
  seconds on standard broadband connections.

- **SC-004**: Training animation maintains smooth visual updates (no visible
  stuttering or freezing) during continuous playback.

- **SC-005**: Users can interact with the visualiser using only keyboard
  navigation without loss of core functionality.

- **SC-006**: The visualisation remains usable on viewports from 1024px to
  1920px width without horizontal scrolling or clipped content.

- **SC-007**: A user with no prior neural network knowledge can correctly
  answer "what is a weight?" after 2 minutes of interaction with the visualiser.

## Assumptions

- The demonstration network will use a simple, well-known architecture
  (e.g., XOR problem or simple pattern recognition) that converges reliably.

- Training data will be built-in/hard-coded for the demonstration rather
  than user-supplied.

- The network will be small enough (tens of neurons, not hundreds) to render
  clearly on screen without scrolling within the visualisation area.

- Users have modern browsers with JavaScript enabled; no legacy browser
  support is required.

- Initial random weight initialisation will use standard practices (e.g.,
  Xavier/He initialisation) to ensure reasonable training behaviour.
