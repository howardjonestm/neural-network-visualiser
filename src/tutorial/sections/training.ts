// T014, T022-T028: Section 2 (Training) - Guided step-through training with animations
// This section provides interactive training experience with key term explanations
// 009: Enhanced with synchronized animations for each training step

import type { TutorialStateManager } from '../state';
import { isHintDismissed, dismissHint } from '../state';
import type { TrainingGuidedStep, TrainingStep } from '../types';
import { KeyTermPopup } from '../key-terms';
import type { NetworkRenderer } from '../../visualisation/renderer';

/**
 * T016, T017: Predefined guided training steps
 * T017: Removed termsIntroduced per FR-009
 */
const GUIDED_STEPS: TrainingGuidedStep[] = [
  {
    stepNumber: 1,
    description: 'Forward Pass',
    explanation: `
      <p>The <strong>forward pass</strong> is how the network makes predictions. Data flows from inputs through each layer to produce an output.</p>
      <p>Watch as the input values propagate through the network. Each neuron combines its inputs (multiplied by weights), adds a bias, and applies an activation function.</p>
    `,
    termsIntroduced: [], // T017: Removed per FR-009
    animationDuration: 2500,
    showMathOption: true,
  },
  {
    stepNumber: 2,
    description: 'Calculate Loss',
    explanation: `
      <p>After the forward pass, we compare the network's output to the expected value. The <strong>loss</strong> measures how wrong the prediction is.</p>
      <p>For XOR, we use Mean Squared Error: the squared difference between predicted and expected output. Lower loss means better predictions.</p>
    `,
    termsIntroduced: [], // T017: Removed per FR-009
    animationDuration: 2500,
    showMathOption: true,
  },
  {
    stepNumber: 3,
    description: 'Backpropagation',
    explanation: `
      <p><strong>Backpropagation</strong> calculates how to adjust each weight to reduce the loss. It works backwards from the output, determining each weight's contribution to the error.</p>
      <p>Watch as the error signal flows backward through the network. Each weight is adjusted proportionally to how much it contributed to the error.</p>
    `,
    termsIntroduced: [], // T017: Removed per FR-009
    animationDuration: 2500,
    showMathOption: true,
  },
];

/**
 * 009 T008-T013: Map step index to TrainingStep type for animation triggering
 */
const STEP_TO_ANIMATION: TrainingStep[] = [
  'forward-pass',
  'calculate-loss',
  'backpropagation',
];

/**
 * TrainingSection manages the guided training experience
 * Provides step-through training with animations and explanations
 * 009: Enhanced with synchronized animations for each training step
 */
export class TrainingSection {
  private container: HTMLElement | null;
  private explanationContainer: HTMLElement | null;
  private tutorialState: TutorialStateManager | null = null;
  private keyTermPopup: KeyTermPopup;
  private currentGuidedStep: number = 0;
  /** 009 T008: Reference to renderer for triggering animations */
  private renderer: NetworkRenderer | null = null;
  /** 009 T041-T045: Hint element reference and timeout */
  private hintElement: HTMLElement | null = null;
  private hintTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(containerId: string = 'section-training') {
    this.container = document.getElementById(containerId);
    this.explanationContainer = document.getElementById('training-explanation');
    this.keyTermPopup = new KeyTermPopup();
    this.initializeContent();
  }

  /**
   * T024: Initialize content with untrained state explanation
   */
  private initializeContent(): void {
    if (!this.explanationContainer) return;

    this.explanationContainer.innerHTML = `
      <div class="training-intro">
        <p class="lead">
          Now we'll train the network to learn XOR. Training involves showing the network
          examples and adjusting <strong class="key-term-inline" data-term="weight">weights</strong> to reduce prediction error.
        </p>
        <div class="untrained-notice">
          <span class="notice-icon">&#9432;</span>
          <p>
            The network currently has <strong>random weights</strong> and cannot solve XOR correctly.
            Through training, it will learn the patterns needed to make accurate predictions.
          </p>
        </div>
      </div>

      <div id="guided-steps-container" class="guided-steps-container">
        <h3>Understanding Training</h3>
        <p class="guided-intro">
          Let's walk through one training iteration to understand how the network learns.
          Each step below explains a key part of the process.
        </p>

        <div id="guided-step-content" class="guided-step-content">
          <!-- Current step content will be rendered here -->
        </div>

        <div class="guided-step-controls">
          <button id="guided-prev-btn" class="guided-nav-btn" disabled>
            <span>&larr;</span> Previous
          </button>
          <span id="guided-step-indicator" class="guided-step-indicator">
            Step 1 of ${GUIDED_STEPS.length}
          </span>
          <button id="guided-next-btn" class="guided-nav-btn">
            Next <span>&rarr;</span>
          </button>
        </div>
      </div>

      <div id="run-training-container" class="run-training-container" style="display: none;">
        <h3>Run Full Training</h3>
        <p>
          Now that you understand the training process, let's run many iterations to train the network.
          Watch the <strong class="key-term-inline" data-term="loss">loss</strong> decrease as the network learns.
        </p>
        <div class="loss-explanation">
          <h4>Understanding Loss</h4>
          <p>
            <strong>Loss</strong> measures prediction error. A loss near <strong>1.0</strong> means the network is guessing randomly.
            As training progresses, loss should decrease toward <strong>0.0</strong>, indicating accurate predictions.
          </p>
          <ul class="loss-guide">
            <li><span class="loss-indicator loss-high"></span> High loss (&gt; 0.3): Network is still learning basic patterns</li>
            <li><span class="loss-indicator loss-medium"></span> Medium loss (0.1 - 0.3): Making progress, predictions improving</li>
            <li><span class="loss-indicator loss-low"></span> Low loss (&lt; 0.1): Network has learned XOR well</li>
          </ul>
        </div>
        <p class="training-tip">
          Use the Training Controls panel on the left to start training.
          Click the play button to begin, and watch the loss value decrease.
        </p>
      </div>

    `;

    // Wire up key term triggers
    this.wireKeyTermTriggers();

    // Render initial guided step
    this.renderGuidedStep(0);

    // Wire up navigation buttons
    this.wireGuidedNavigation();
  }

  /**
   * Wire up key term trigger elements
   */
  private wireKeyTermTriggers(): void {
    const triggers = this.explanationContainer?.querySelectorAll('.key-term-inline');
    triggers?.forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        const termId = (trigger as HTMLElement).dataset.term;
        if (termId) {
          const rect = (trigger as HTMLElement).getBoundingClientRect();
          this.keyTermPopup.toggle(termId, { x: rect.right, y: rect.top });
          e.stopPropagation();
        }
      });
    });
  }

  /**
   * T016-T018: Render a guided step
   * T017: Removed key terms section per FR-009
   * T018: Simplified navigation - only Next/Previous per FR-008, FR-010
   * 009 T008-T013: Trigger corresponding animation when step changes
   */
  private renderGuidedStep(stepIndex: number): void {
    const step = GUIDED_STEPS[stepIndex];
    if (!step) return;

    const contentEl = document.getElementById('guided-step-content');
    const indicatorEl = document.getElementById('guided-step-indicator');
    const prevBtn = document.getElementById('guided-prev-btn') as HTMLButtonElement;
    const nextBtn = document.getElementById('guided-next-btn') as HTMLButtonElement;

    if (contentEl) {
      // T017: Key terms section removed per FR-009
      // 009 T018-T020: Math section now inline per step
      const mathContent = this.getMathContentForStep(step.stepNumber);
      contentEl.innerHTML = `
        <div class="guided-step">
          <div class="guided-step-header">
            <span class="step-number">${step.stepNumber}</span>
            <span class="step-title">${step.description}</span>
          </div>
          <div class="guided-step-explanation">
            ${step.explanation}
          </div>
          ${step.showMathOption ? `
          <details class="math-details step-math">
            <summary>
              <span class="math-icon">&#8721;</span> Show Math
            </summary>
            <div class="math-content">
              ${mathContent}
            </div>
          </details>
          ` : ''}
        </div>
      `;
    }

    if (indicatorEl) {
      indicatorEl.textContent = `Step ${stepIndex + 1} of ${GUIDED_STEPS.length}`;
    }

    // T018: Update navigation buttons - only Next/Previous, no completion markers
    if (prevBtn) {
      prevBtn.disabled = stepIndex === 0;
    }
    if (nextBtn) {
      // T018: Removed completion marker, just show Next for all steps
      nextBtn.innerHTML = stepIndex === GUIDED_STEPS.length - 1
        ? 'Next <span>&rarr;</span>'
        : 'Next <span>&rarr;</span>';
    }

    this.currentGuidedStep = stepIndex;

    // 009 T008-T013: Trigger animation for this step
    this.triggerStepAnimation(stepIndex);
  }

  /**
   * 009 T014-T016: Get math content HTML for a specific step
   * T014: Forward Pass - Sigmoid and weighted sum formulas
   * T015: Calculate Loss - MSE formula
   * T016: Backpropagation - Weight update and learning rate
   */
  private getMathContentForStep(stepNumber: number): string {
    switch (stepNumber) {
      case 1: // Forward Pass
        return `
          <div class="math-section">
            <h4>Neuron Output Calculation</h4>
            <p>Each neuron computes a weighted sum plus bias:</p>
            <code class="math-formula">z = Σ(input<sub>i</sub> × weight<sub>i</sub>) + bias</code>
            <p>Then applies the <strong>sigmoid activation function</strong>:</p>
            <div class="formula">
              <code class="math-formula">σ(z) = <span class="fraction"><span class="numerator">1</span><span class="denominator">1 + e<sup>−z</sup></span></span></code>
            </div>
            <p class="math-note">
              The sigmoid function σ squashes any value to the range (0, 1),
              making it ideal for XOR's binary outputs.
            </p>
          </div>
        `;
      case 2: // Calculate Loss
        return `
          <div class="math-section">
            <h4>Mean Squared Error (MSE)</h4>
            <p>The loss for a single sample:</p>
            <code class="math-formula">L = (predicted − expected)²</code>
            <p>For the full dataset (4 XOR samples):</p>
            <div class="formula">
              <code class="math-formula">L<sub>total</sub> = <span class="fraction"><span class="numerator">1</span><span class="denominator">4</span></span> × Σ(y<sub>i</sub> − ŷ<sub>i</sub>)²</code>
            </div>
            <p class="math-note">
              Squaring ensures all errors are positive and penalizes larger errors more heavily.
            </p>
          </div>
        `;
      case 3: // Backpropagation
        return `
          <div class="math-section">
            <h4>Weight Update Rule</h4>
            <p>Each weight is updated using <strong>gradient descent</strong>:</p>
            <div class="formula">
              <code class="math-formula">w<sub>new</sub> = w<sub>old</sub> − η × <span class="fraction"><span class="numerator">∂L</span><span class="denominator">∂w</span></span></code>
            </div>
            <p>Where:</p>
            <ul class="math-list">
              <li><strong class="greek">η</strong> (eta) is the <strong>learning rate</strong></li>
              <li><strong>∂L/∂w</strong> is the gradient (partial derivative of loss with respect to weight)</li>
            </ul>
          </div>
          <div class="math-section">
            <h4>Learning Rate Trade-offs</h4>
            <ul class="math-list">
              <li><strong>High η (&gt; 0.5)</strong>: Fast learning, but may overshoot and oscillate</li>
              <li><strong>Low η (&lt; 0.1)</strong>: Stable convergence, but slow learning</li>
              <li><strong>Recommended: 0.1 – 0.5</strong> for small networks like this XOR example</li>
            </ul>
          </div>
        `;
      default:
        return '';
    }
  }

  /**
   * 009 T008-T013: Trigger the appropriate animation for the current training step
   * T012: Cancel any active animations before starting new ones
   * T013: Animations replay when user revisits a step
   */
  private triggerStepAnimation(stepIndex: number): void {
    if (!this.renderer) return;

    const trainingStep = STEP_TO_ANIMATION[stepIndex];
    if (!trainingStep) return;

    // T012: Cancel any active animations before starting new step
    this.renderer.cancelAnimations();

    // Update tutorial state with current step
    if (this.tutorialState) {
      this.tutorialState.setCurrentTrainingStep(trainingStep);
    }

    // T009-T011: Trigger the appropriate animation based on step
    switch (trainingStep) {
      case 'forward-pass':
        // T009: Wire Forward Pass step to animateForwardPass
        this.renderer.animateForwardPass();
        break;
      case 'calculate-loss':
        // T010: Wire Calculate Loss step to animateLossHighlight
        this.renderer.animateLossHighlight();
        break;
      case 'backpropagation':
        // T011: Wire Backpropagation step to animateBackpropagation
        this.renderer.animateBackpropagation();
        break;
    }
  }

  /**
   * Wire up guided step navigation buttons
   */
  private wireGuidedNavigation(): void {
    const prevBtn = document.getElementById('guided-prev-btn');
    const nextBtn = document.getElementById('guided-next-btn');

    prevBtn?.addEventListener('click', () => {
      if (this.currentGuidedStep > 0) {
        this.renderGuidedStep(this.currentGuidedStep - 1);
      }
    });

    nextBtn?.addEventListener('click', () => {
      if (this.currentGuidedStep < GUIDED_STEPS.length - 1) {
        this.renderGuidedStep(this.currentGuidedStep + 1);
        this.tutorialState?.incrementGuidedStep();
      } else {
        // Completed all guided steps
        this.completeGuidedSteps();
      }
    });
  }

  /**
   * T026: Show the Run Full Training section after guided steps complete
   */
  private completeGuidedSteps(): void {
    const guidedContainer = document.getElementById('guided-steps-container');
    const runTrainingContainer = document.getElementById('run-training-container');

    if (guidedContainer) {
      guidedContainer.innerHTML = `
        <div class="guided-complete">
          <span class="complete-icon">&#10003;</span>
          <p>You've learned the three main phases of neural network training!</p>
          <button id="review-steps-btn" class="review-btn">Review Steps</button>
        </div>
      `;

      // Wire review button
      document.getElementById('review-steps-btn')?.addEventListener('click', () => {
        this.resetGuidedSteps();
      });
    }

    if (runTrainingContainer) {
      runTrainingContainer.style.display = 'block';
    }

    // Notify tutorial state
    if (this.tutorialState) {
      this.tutorialState.incrementGuidedStep();
    }
  }

  /**
   * Reset guided steps for review
   */
  private resetGuidedSteps(): void {
    this.currentGuidedStep = 0;
    this.initializeContent();
  }

  /**
   * Initialize the section with tutorial state reference
   * 009 T008: Accept renderer reference for animation triggering
   */
  initialize(tutorialState: TutorialStateManager, renderer?: NetworkRenderer): void {
    this.tutorialState = tutorialState;
    if (renderer) {
      this.renderer = renderer;
    }

    // Subscribe to state changes to track training completion
    tutorialState.subscribe((state) => {
      if (state.trainingCompleted) {
        this.showTrainingComplete();
      }
    });
  }

  /**
   * 009 T008: Set the renderer for animation triggering (can be called after construction)
   */
  setRenderer(renderer: NetworkRenderer): void {
    this.renderer = renderer;
  }

  /**
   * Show training complete message
   */
  private showTrainingComplete(): void {
    const runTrainingContainer = document.getElementById('run-training-container');
    if (runTrainingContainer) {
      const existingComplete = runTrainingContainer.querySelector('.training-complete');
      if (!existingComplete) {
        const completeDiv = document.createElement('div');
        completeDiv.className = 'training-complete';
        completeDiv.innerHTML = `
          <span class="complete-icon">&#10003;</span>
          <p><strong>Training Complete!</strong> The network has learned to solve XOR.</p>
          <p>Scroll down to explore the trained network and run inference.</p>
        `;
        runTrainingContainer.appendChild(completeDiv);
      }
    }
  }

  /**
   * Called when section becomes active (scrolled into view)
   * 009 T042: Show hint after 2s delay if not dismissed
   */
  onActivate(): void {
    // Hide key term popup when section activates
    this.keyTermPopup.hide();

    // 009 T041-T043: Show interaction hint after delay
    this.scheduleInteractionHint();
  }

  /**
   * 009 T041-T045: Create and show interaction hint
   */
  private scheduleInteractionHint(): void {
    // T043: Check if already dismissed
    if (isHintDismissed()) return;

    // T042: 2 second delay before showing
    this.hintTimeout = setTimeout(() => {
      this.showInteractionHint();
    }, 2000);
  }

  /**
   * 009 T041, T045: Create and display the interaction hint
   */
  private showInteractionHint(): void {
    if (this.hintElement) return; // Already showing

    // Create hint element
    this.hintElement = document.createElement('div');
    this.hintElement.className = 'interaction-hint';
    this.hintElement.innerHTML = `
      <div class="interaction-hint-header">
        <span class="interaction-hint-title">
          <span>💡</span> Tip
        </span>
        <button class="interaction-hint-dismiss" aria-label="Dismiss hint">&times;</button>
      </div>
      <div class="interaction-hint-content">
        <strong>Click or hover on weights and neurons</strong> to see their values change in real-time as the network trains!
      </div>
    `;

    // Position near the network visualization
    const networkSvg = document.getElementById('network-svg');
    if (networkSvg) {
      const rect = networkSvg.getBoundingClientRect();
      this.hintElement.style.top = `${rect.top + 50}px`;
      this.hintElement.style.left = `${rect.left + 20}px`;
    }

    document.body.appendChild(this.hintElement);

    // T044: Wire dismiss button
    const dismissBtn = this.hintElement.querySelector('.interaction-hint-dismiss');
    dismissBtn?.addEventListener('click', () => this.hideInteractionHint(true));
  }

  /**
   * 009 T044: Hide and optionally persist dismissal
   */
  private hideInteractionHint(persist: boolean = false): void {
    if (this.hintTimeout) {
      clearTimeout(this.hintTimeout);
      this.hintTimeout = null;
    }

    if (this.hintElement) {
      this.hintElement.remove();
      this.hintElement = null;
    }

    if (persist) {
      dismissHint();
    }
  }

  /**
   * Called when section is scrolled away from
   * FR-017: Training should stop when scrolling away
   * 009: Hide interaction hint when leaving
   */
  onDeactivate(): void {
    // Training pause is handled in main.ts onSectionDeactivate
    if (this.tutorialState) {
      this.tutorialState.stopTraining();
    }
    // Hide key term popup
    this.keyTermPopup.hide();

    // 009: Hide interaction hint (don't persist - user just scrolled away)
    this.hideInteractionHint(false);
  }

  /**
   * Get the section container element
   */
  getElement(): HTMLElement | null {
    return this.container;
  }
}
