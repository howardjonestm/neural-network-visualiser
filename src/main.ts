// Neural Network Training Tutorial - Main Entry Point

import { createNetwork } from './network/network';
import { NetworkRenderer } from './visualisation/renderer';
import { Tooltip } from './visualisation/tooltip';
import { PlaybackControls } from './controls/playback';
import { ParametersControls } from './controls/parameters';
import { ResetControls } from './controls/reset';
import { HintManager } from './education/hints';
import { LossTrendDisplay } from './education/loss-indicator';
import type { Neuron, Weight, TrainingConfig, Network } from './network/types';
import { DEFAULT_TRAINING_CONFIG } from './network/types';
import { WeightDeltaTracker, type WeightDelta } from './visualisation/weight-delta';
import { WeightHistoryPanel } from './visualisation/weight-history-panel';
import { TrainingPanel } from './visualisation/training-panel';

// Tutorial module imports
import { createTutorialState, type TutorialStateManager } from './tutorial/state';
import { ScrollManager } from './tutorial/scroll-manager';
import type { SectionId } from './tutorial/types';
import { SECTION_IDS } from './tutorial/types';
import {
  ObjectivesSection,
  TrainingSection,
  TourSection,
  InferenceSection,
} from './tutorial/sections';

// Demo module imports
import {
  getDemoStateMachine,
  generateDemoSteps,
  getPrediction,
  createDemoButton,
  createInputSelector,
  createExpectedOutput,
  updateExpectedOutput,
  createStepControls,
  createStepIndicator,
  updateStepIndicator,
  createSpeedSelector,
  createPauseResumeButton,
  createPredictionDisplay,
  updatePredictionDisplay,
  updateDemoControls,
  animateLayer,
  jumpToStep,
  restoreAllElements,
  showInputValues,
  hideInputValues,
  cancelAnimation,
  resetAnimationState,
  startAutoAdvanceTimer,
  CalculationPanel,
  XOR_EXPECTED,
} from './demo';
import type { DemoState, DemoSpeed, XORInput } from './demo';
import { calculateNeuronPositions, getResponsiveConfig } from './visualisation/layout';
import * as d3 from 'd3';

// Application state
let network: Network;
let renderer: NetworkRenderer;
let tooltip: Tooltip;
let playbackControls: PlaybackControls;
let parametersControls: ParametersControls;
let resetControls: ResetControls;
let hintManager: HintManager;
let lossTrendDisplay: LossTrendDisplay;
let trainingConfig: TrainingConfig = { ...DEFAULT_TRAINING_CONFIG };

// T008: Weight delta tracker for training visualization
let weightDeltaTracker: WeightDeltaTracker;
let currentDeltas: Map<string, WeightDelta> = new Map();

// T015: Debounce state for rapid training visualization
let lastVisualizationTime = 0;
const MIN_VISUAL_INTERVAL = 100; // ms

// T033: Weight history panel
let weightHistoryPanel: WeightHistoryPanel;

// T017: Training panel for visualization
let trainingPanel: TrainingPanel;

// Tutorial state and scroll management
let tutorialState: TutorialStateManager;
let scrollManager: ScrollManager;

// Tutorial section instances
let objectivesSection: ObjectivesSection;
let trainingSection: TrainingSection;
let tourSection: TourSection;
let inferenceSection: InferenceSection;

// Track hovered element for dynamic tooltip updates during training
let hoveredNeuron: Neuron | null = null;
let hoveredWeight: Weight | null = null;
let lastHoverPosition: { x: number; y: number } = { x: 0, y: 0 };

// Demo state
let demoStateMachine = getDemoStateMachine();
let calculationPanel: CalculationPanel | null = null;
let demoElements: {
  demoBtn?: HTMLButtonElement;
  inputSelector?: HTMLSelectElement;
  expectedOutput?: HTMLSpanElement;
  nextBtn?: HTMLButtonElement;
  prevBtn?: HTMLButtonElement;
  stepIndicator?: HTMLSpanElement;
  speedSelector?: HTMLDivElement;
  pauseBtn?: HTMLButtonElement;
  predictionDisplay?: HTMLDivElement;
} = {};
let cancelAutoAdvance: (() => void) | null = null;
let wasTrainingPlaying = false;

/**
 * Initialize the application
 */
function init(): void {
  // Create XOR network with deeper architecture (5 layers)
  // 2 inputs, 4 hidden, 3 hidden, 2 hidden, 1 output
  network = createNetwork([2, 4, 3, 2, 1]);

  // Initialize tooltip
  tooltip = new Tooltip('tooltip');

  // Create renderer with hover and click handlers
  renderer = new NetworkRenderer(network, {
    containerId: 'network-svg',
    onNeuronHover: handleNeuronHover,
    onWeightHover: handleWeightHover,
    // T037: Wire click handler to show/hide history panel
    onWeightClick: handleWeightClick,
  });

  // Set up window resize handler
  window.addEventListener('resize', handleResize);

  // T008: Initialize weight delta tracker
  weightDeltaTracker = new WeightDeltaTracker(10);

  // T033: Initialize weight history panel
  weightHistoryPanel = new WeightHistoryPanel({ containerId: 'weight-history-panel' });
  weightHistoryPanel.setTracker(weightDeltaTracker);

  // T017: Initialize training panel
  trainingPanel = new TrainingPanel('training-info-container');

  // Initialize playback controls with weight delta hooks
  playbackControls = new PlaybackControls(network, renderer, trainingConfig, {
    onStep: handleTrainingStep,
    onPlayPauseChange: handlePlayPauseChange,
    // T009: Capture snapshot before training step
    onBeforeTrainStep: () => {
      weightDeltaTracker.captureSnapshot(network.weights);
    },
    // T010: Compute deltas after training step
    // T018: Update TrainingPanel summary after each step
    onAfterTrainStep: async (result) => {
      currentDeltas = weightDeltaTracker.computeDeltas(network.weights);

      // T014-T015: Call highlightWeightChanges() with debounce
      const now = Date.now();
      if (now - lastVisualizationTime >= MIN_VISUAL_INTERVAL) {
        renderer.highlightWeightChanges(currentDeltas);
        lastVisualizationTime = now;
      }

      // T018: Update training panel with step summary
      trainingPanel.updateSummary(trainingConfig.stepCount, result.loss);

      // Refresh tooltip if hovering over a weight or neuron during training
      refreshHoveredTooltip();
    },
    // T023: Update training panel with current sample
    onSampleProcessed: (sampleResult) => {
      trainingPanel.updateSample(sampleResult);
    },
  });

  // Initialize parameter controls
  parametersControls = new ParametersControls(trainingConfig, {
    onLearningRateChange: handleLearningRateChange,
  });

  // Initialize reset controls
  resetControls = new ResetControls(network, renderer, trainingConfig, playbackControls, {
    onReset: handleReset,
  });

  // Initialize hint manager
  hintManager = new HintManager({
    suppressDuringPlay: true,
    onHintDismiss: (hintId) => {
      console.log(`Hint dismissed: ${hintId}`);
    },
  });

  // Initialize loss trend display
  lossTrendDisplay = new LossTrendDisplay('loss-trend');

  // Initialize demo controls
  initializeDemoControls();

  // Initialize tutorial state and scroll manager
  initializeTutorial();

  console.log('Neural Network Training Tutorial initialized');
  console.log(`Network architecture: [${network.architecture.join(', ')}]`);
  console.log(`Total neurons: ${network.layers.reduce((sum, l) => sum + l.neurons.length, 0)}`);
  console.log(`Total weights: ${network.weights.length}`);
}

/**
 * T025-T026: Handle neuron hover - show activation tooltip for hidden/output neurons
 * Also tracks hovered neuron for dynamic updates during training
 */
function handleNeuronHover(neuron: Neuron | null, event: MouseEvent): void {
  // Track hovered state for dynamic updates
  hoveredNeuron = neuron;
  hoveredWeight = null; // Clear weight hover when hovering neuron

  if (neuron) {
    lastHoverPosition = { x: event.clientX, y: event.clientY };
    const layer = network.layers[neuron.layerIndex];

    // T025: Use activation tooltip for hidden/output neurons
    // T026: Use regular tooltip (shows pass-through) for input neurons
    tooltip.showActivation(neuron, layer.type, lastHoverPosition);
  } else {
    tooltip.hide();
  }
}

/**
 * T016: Handle weight hover - show tooltip with weight value and delta
 * Also tracks hovered weight for dynamic updates during training
 */
function handleWeightHover(weight: Weight | null, event: MouseEvent): void {
  // Track hovered state for dynamic updates
  hoveredWeight = weight;
  hoveredNeuron = null; // Clear neuron hover when hovering weight

  if (weight) {
    lastHoverPosition = { x: event.clientX, y: event.clientY };
    // T016: Pass current delta to tooltip if available
    const delta = currentDeltas.get(weight.id);
    tooltip.showWeight(weight, lastHoverPosition, delta);
  } else {
    tooltip.hide();
  }
}

/**
 * T037: Handle weight click - show/hide history panel
 */
function handleWeightClick(weight: Weight, event: MouseEvent): void {
  weightHistoryPanel.toggle(weight.id, { x: event.clientX, y: event.clientY });
}

/**
 * Refresh tooltip for currently hovered element during training
 * This allows values to update dynamically without moving the mouse
 */
function refreshHoveredTooltip(): void {
  if (hoveredNeuron) {
    // Find the current neuron data (may have updated activation/bias)
    const currentNeuron = findNeuronById(hoveredNeuron.id);
    if (currentNeuron) {
      const layer = network.layers[currentNeuron.layerIndex];
      tooltip.showActivation(currentNeuron, layer.type, lastHoverPosition);
    }
  } else if (hoveredWeight) {
    // Find the current weight data (may have updated value)
    const currentWeight = network.weights.find(w => w.id === hoveredWeight!.id);
    if (currentWeight) {
      const delta = currentDeltas.get(currentWeight.id);
      tooltip.showWeight(currentWeight, lastHoverPosition, delta);
    }
  }
}

/**
 * Find a neuron by ID in the network
 */
function findNeuronById(neuronId: string): Neuron | undefined {
  for (const layer of network.layers) {
    const neuron = layer.neurons.find(n => n.id === neuronId);
    if (neuron) return neuron;
  }
  return undefined;
}

// Debounce utility
let resizeTimeout: number | null = null;

/**
 * Handle window resize with debouncing
 */
function handleResize(): void {
  if (resizeTimeout !== null) {
    clearTimeout(resizeTimeout);
  }
  resizeTimeout = window.setTimeout(() => {
    renderer.resize();
    resizeTimeout = null;
  }, 150);
}

/**
 * Handle training step callback
 * T037: Track previousLoss for trend calculation
 */
function handleTrainingStep(stepCount: number, loss: number): void {
  // Update loss trend display
  lossTrendDisplay.update(loss, trainingConfig.previousLoss);

  // Update previous loss for next step
  trainingConfig.previousLoss = loss;

  // Log every 100 steps
  if (stepCount % 100 === 0) {
    console.log(`Step ${stepCount}: Loss = ${loss.toFixed(4)}`);
  }
}

/**
 * Handle play/pause state change
 */
function handlePlayPauseChange(isPlaying: boolean): void {
  // Suppress hints during continuous play
  hintManager.setPlayingState(isPlaying);
  console.log(`Training ${isPlaying ? 'started' : 'paused'}`);
}

/**
 * Handle learning rate change
 */
function handleLearningRateChange(learningRate: number): void {
  console.log(`Learning rate changed to ${learningRate.toFixed(2)}`);
}

/**
 * Handle network reset
 */
function handleReset(): void {
  console.log('Network reset with new random weights');
  // T070: Demo works with new weights after reset
  demoStateMachine.cancel();
  // T038: Clear weight delta tracker on reset
  weightDeltaTracker.clear();
  currentDeltas.clear();
  // T019: Reset training panel on network reset
  trainingPanel.reset();
}

/**
 * T024-T025: Initialize demo controls and wire to state machine
 */
function initializeDemoControls(): void {
  const demoContainer = document.getElementById('demo-controls');
  if (!demoContainer) {
    console.warn('Demo controls container not found');
    return;
  }

  // Create demo button (T014)
  demoElements.demoBtn = createDemoButton(demoContainer, handleDemoStart);

  // Create input selector (T026)
  demoElements.inputSelector = createInputSelector(
    demoContainer,
    handleInputChange,
    demoStateMachine.getState().selectedInput
  );

  // Create expected output display (T029)
  demoElements.expectedOutput = createExpectedOutput(
    demoContainer,
    demoStateMachine.getState().selectedInput
  );

  // Create step controls (T036)
  const stepControls = createStepControls(demoContainer, handleNextStep, handlePrevStep);
  demoElements.nextBtn = stepControls.nextBtn;
  demoElements.prevBtn = stepControls.prevBtn;

  // Create step indicator (T039)
  demoElements.stepIndicator = createStepIndicator(demoContainer);

  // Create speed selector (T045)
  demoElements.speedSelector = createSpeedSelector(
    demoContainer,
    handleSpeedChange,
    demoStateMachine.getState().speed
  );

  // Create pause/resume button (T048)
  demoElements.pauseBtn = createPauseResumeButton(
    demoContainer,
    handlePause,
    handleResume
  );

  // Create prediction display (T032)
  demoElements.predictionDisplay = createPredictionDisplay(demoContainer);

  // Initialize calculation panel (T052-T057)
  try {
    calculationPanel = new CalculationPanel('calculation-panel');
  } catch (e) {
    console.warn('Calculation panel container not found');
  }

  // Subscribe to state changes (T025)
  demoStateMachine.subscribe(handleDemoStateChange);

  // Initial control state update
  updateDemoControls(demoStateMachine.getState(), demoElements);
}

/**
 * Handle demo start button click (T024)
 */
function handleDemoStart(): void {
  const state = demoStateMachine.getState();

  // T068: Ignore if already running
  if (state.mode !== 'idle') {
    return;
  }

  // T060: Pause training if running
  if (playbackControls.isPlaying()) {
    wasTrainingPlaying = true;
    playbackControls.pause();
  } else {
    wasTrainingPlaying = false;
  }

  // Clear calculation panel for new demo
  if (calculationPanel) {
    calculationPanel.reset();
  }

  // Hide previous prediction display
  if (demoElements.predictionDisplay) {
    updatePredictionDisplay(demoElements.predictionDisplay, 0, 0, false);
  }

  // Generate demo steps for selected input
  const steps = generateDemoSteps(network, state.selectedInput);

  // Start the demo
  demoStateMachine.startDemo(steps);
}

/**
 * Handle input selection change (T033)
 */
function handleInputChange(input: XORInput): void {
  demoStateMachine.setInput(input);

  // Update expected output display
  if (demoElements.expectedOutput) {
    updateExpectedOutput(demoElements.expectedOutput, input);
  }
}

/**
 * Handle next step button click (T041)
 */
function handleNextStep(): void {
  const state = demoStateMachine.getState();

  // If in idle, start in step-through mode
  if (state.mode === 'idle') {
    // T060: Pause training if running
    if (playbackControls.isPlaying()) {
      wasTrainingPlaying = true;
      playbackControls.pause();
    } else {
      wasTrainingPlaying = false;
    }

    // Clear calculation panel for new demo
    if (calculationPanel) {
      calculationPanel.reset();
    }

    // Hide previous prediction display
    if (demoElements.predictionDisplay) {
      updatePredictionDisplay(demoElements.predictionDisplay, 0, 0, false);
    }

    const steps = generateDemoSteps(network, state.selectedInput);
    demoStateMachine.startStepThrough(steps);
  } else {
    demoStateMachine.nextStep();
  }
}

/**
 * Handle previous step button click (T041)
 */
function handlePrevStep(): void {
  demoStateMachine.prevStep();
}

/**
 * Handle speed change (T050)
 */
function handleSpeedChange(speed: DemoSpeed): void {
  demoStateMachine.setSpeed(speed);

  // T051: If running, restart auto-advance with new speed
  const state = demoStateMachine.getState();
  if (state.mode === 'running' && cancelAutoAdvance) {
    cancelAutoAdvance();
    cancelAutoAdvance = startAutoAdvanceTimer(speed, () => {
      return demoStateMachine.advanceStep();
    });
  }
}

/**
 * Handle pause button click (T050)
 */
function handlePause(): void {
  demoStateMachine.pause();

  // Stop auto-advance timer
  if (cancelAutoAdvance) {
    cancelAutoAdvance();
    cancelAutoAdvance = null;
  }
}

/**
 * Handle resume button click (T050)
 */
function handleResume(): void {
  demoStateMachine.resume();

  // Restart auto-advance timer
  const state = demoStateMachine.getState();
  cancelAutoAdvance = startAutoAdvanceTimer(state.speed, () => {
    return demoStateMachine.advanceStep();
  });
}

/**
 * Handle demo state changes (T025, T042, T058)
 */
function handleDemoStateChange(state: DemoState): void {
  // Update all control states
  updateDemoControls(state, demoElements);

  // Get SVG element directly and wrap with D3
  const svgElement = document.getElementById('network-svg') as SVGSVGElement | null;
  if (!svgElement) return;

  const svg = d3.select(svgElement) as d3.Selection<SVGSVGElement, unknown, null, undefined>;
  const neuronsGroup = svg.select<SVGGElement>('g.neurons') as d3.Selection<SVGGElement, unknown, d3.BaseType, unknown>;

  if (state.mode === 'idle') {
    // Demo ended or cancelled
    restoreAllElements(svg);
    hideInputValues(svg);
    cancelAnimation();

    // Stop auto-advance timer
    if (cancelAutoAdvance) {
      cancelAutoAdvance();
      cancelAutoAdvance = null;
    }

    // Keep calculation panel visible after demo ends (don't clear it)
    // It will be cleared when starting a new demo

    // Keep prediction display visible after demo ends

    // T061: Restore training if it was playing
    if (wasTrainingPlaying) {
      wasTrainingPlaying = false;
      playbackControls.play();
    }

    return;
  }

  // Get neuron positions for animation using same config as renderer
  const svgRect = svgElement.getBoundingClientRect();
  const layoutConfig = getResponsiveConfig(svgRect.width || 800, svgRect.height || 400);
  const neuronPositions = calculateNeuronPositions(network, layoutConfig);
  const currentStep = state.steps[state.currentStepIndex];

  if (!currentStep) return;

  // T031: Show input values on input neurons
  if (state.currentStepIndex === 0) {
    showInputValues(svg, network, neuronPositions, state.selectedInput);
  }

  // T042: Update visualization based on mode
  if (state.mode === 'step-through' || state.mode === 'paused') {
    // Immediate jump to step (T040)
    jumpToStep(svg, neuronsGroup, network, currentStep);
  } else if (state.mode === 'running') {
    // Animate the layer (T022)
    resetAnimationState();
    animateLayer(
      svg,
      neuronsGroup,
      network,
      currentStep,
      neuronPositions,
      state.speed
    ).then(() => {
      // Auto-advance if still running
      const newState = demoStateMachine.getState();
      if (newState.mode === 'running') {
        // Start auto-advance timer if not already started
        if (!cancelAutoAdvance) {
          cancelAutoAdvance = startAutoAdvanceTimer(newState.speed, () => {
            return demoStateMachine.advanceStep();
          });
        }
      }
    });
  }

  // T058: Update calculation panel
  if (calculationPanel) {
    calculationPanel.render(currentStep);
  }

  // Update step indicator
  if (demoElements.stepIndicator) {
    updateStepIndicator(
      demoElements.stepIndicator,
      state.currentStepIndex,
      state.totalSteps,
      currentStep.layerLabel
    );
  }

  // T032: Show prediction when we reach the last step (output layer)
  if (state.currentStepIndex === state.totalSteps - 1) {
    const prediction = getPrediction(state.steps);
    const expected = XOR_EXPECTED[state.selectedInput.join(',')];
    const predictedClass = prediction >= 0.5 ? 1 : 0;
    const isCorrect = predictedClass === expected;

    if (demoElements.predictionDisplay) {
      updatePredictionDisplay(demoElements.predictionDisplay, prediction, expected, true);
    }
    // 009: Also show prediction inside calculation panel
    if (calculationPanel) {
      calculationPanel.showPrediction(prediction, expected);
    }
    // 009: Show prediction overlay on the network visualization
    if (renderer) {
      renderer.showPredictionOverlay(prediction, expected);
    }
    // 009: Update inference section's prominent prediction display
    inferenceSection.updatePredictionDisplay({
      input: state.selectedInput,
      expected,
      predicted: prediction,
      isCorrect,
      threshold: 0.5
    });
  }
}

/**
 * T063-T067: Keyboard shortcuts for demo
 */
function handleDemoKeyboard(event: KeyboardEvent): void {
  // Don't handle if user is typing in an input
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) {
    return;
  }

  const state = demoStateMachine.getState();

  switch (event.key.toLowerCase()) {
    case 'd':
      // T063: Start demo
      if (state.mode === 'idle') {
        handleDemoStart();
      }
      break;

    case 'n':
      // T064: Next step
      if (state.mode !== 'idle') {
        handleNextStep();
      }
      break;

    case 'p':
      // T065: Previous step
      if (state.mode !== 'idle' && state.currentStepIndex > 0) {
        handlePrevStep();
      }
      break;

    case 'escape':
      // T066: Cancel demo
      if (state.mode !== 'idle') {
        demoStateMachine.cancel();
      }
      break;

    case ' ':
      // T067: Pause/resume
      if (state.mode === 'running') {
        event.preventDefault();
        handlePause();
      } else if (state.mode === 'paused') {
        event.preventDefault();
        handleResume();
      }
      break;
  }
}

// Add keyboard listener
document.addEventListener('keydown', handleDemoKeyboard);

/**
 * Initialize tutorial state management and scroll detection
 */
function initializeTutorial(): void {
  // Create tutorial state manager
  tutorialState = createTutorialState();

  // T017: Create section instances
  objectivesSection = new ObjectivesSection();
  trainingSection = new TrainingSection();
  tourSection = new TourSection();
  inferenceSection = new InferenceSection();

  // Initialize all sections with tutorial state
  // 009: Pass renderer to sections that need it for animations
  objectivesSection.initialize(tutorialState);
  trainingSection.initialize(tutorialState, renderer);
  tourSection.initialize(tutorialState, renderer);
  inferenceSection.initialize(tutorialState);

  // Create scroll manager with section callbacks
  scrollManager = new ScrollManager({
    onSectionActivate: handleSectionActivate,
    onSectionEnter: handleSectionEnter,
    onSectionExit: handleSectionExit,
  });

  // Register all tutorial sections with their activation callbacks
  const sectionInstances: Record<SectionId, { onActivate: () => void; onDeactivate: () => void }> = {
    objectives: objectivesSection,
    training: trainingSection,
    tour: tourSection,
    inference: inferenceSection,
  };

  SECTION_IDS.forEach((sectionId) => {
    const element = document.getElementById(`section-${sectionId}`);
    const section = sectionInstances[sectionId];
    if (element && section) {
      scrollManager.registerSection(
        element,
        sectionId,
        () => {
          section.onActivate();
          onSectionActivate(sectionId);
        },
        () => {
          section.onDeactivate();
          onSectionDeactivate(sectionId);
        }
      );
    }
  });

  // Wire up progress indicator buttons
  const progressNav = document.getElementById('tutorial-progress');
  if (progressNav) {
    progressNav.addEventListener('click', (event) => {
      const button = (event.target as HTMLElement).closest('.progress-btn');
      if (button) {
        const sectionId = button.getAttribute('data-section') as SectionId;
        if (sectionId) {
          scrollManager.scrollToSection(sectionId);
        }
      }
    });
  }

  // Subscribe to state changes to update progress indicator
  tutorialState.subscribe((state) => {
    updateProgressIndicator(state.currentSection);
  });

  console.log('Tutorial initialized with scroll detection');
}

/**
 * Handle section becoming the active (most visible) section
 */
function handleSectionActivate(sectionId: SectionId): void {
  tutorialState.setCurrentSection(sectionId);
  console.log(`Section activated: ${sectionId}`);
}

/**
 * Handle section entering the viewport
 */
function handleSectionEnter(sectionId: SectionId): void {
  console.log(`Section entered viewport: ${sectionId}`);
}

/**
 * Handle section exiting the viewport
 */
function handleSectionExit(sectionId: SectionId): void {
  console.log(`Section exited viewport: ${sectionId}`);
}

/**
 * Called when a section becomes active (via scroll manager callback)
 * FR-017: Stop active processes when scrolling away
 */
function onSectionActivate(sectionId: SectionId): void {
  // Section-specific activation logic can be added here
  console.log(`Section ${sectionId} activated`);
}

/**
 * Called when a section is deactivated (scrolled away from)
 * FR-017: Stop any active process when user scrolls away
 */
function onSectionDeactivate(sectionId: SectionId): void {
  // Stop training if running when scrolling away from training section
  if (sectionId === 'training' && playbackControls?.isPlaying()) {
    playbackControls.pause();
    tutorialState.stopTraining();
    console.log('Training paused - scrolled away from training section');
  }

  // Cancel demo if running when scrolling away from inference section
  if (sectionId === 'inference' && demoStateMachine.getState().mode !== 'idle') {
    demoStateMachine.cancel();
    console.log('Demo cancelled - scrolled away from inference section');
  }
}

/**
 * Update progress indicator to show current section
 */
function updateProgressIndicator(currentSection: SectionId): void {
  const buttons = document.querySelectorAll('.progress-btn');
  buttons.forEach((button) => {
    const sectionId = button.getAttribute('data-section');
    if (sectionId === currentSection) {
      button.setAttribute('aria-current', 'step');
    } else {
      button.removeAttribute('aria-current');
    }
  });
}

// Export for use by other modules
export {
  network,
  renderer,
  trainingConfig,
  playbackControls,
  parametersControls,
  resetControls,
  hintManager,
  lossTrendDisplay,
  demoStateMachine,
  calculationPanel,
  weightDeltaTracker,
  currentDeltas,
  weightHistoryPanel,
  trainingPanel,
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
