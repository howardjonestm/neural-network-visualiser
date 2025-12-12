// T013-T029: Training Panel for displaying real-time training visualization
// Shows step count, loss, current sample, and error information

import type { TrainingStepResult } from '../network/types';
import type { TrainingSample } from '../network/types';

/**
 * Error severity classification for color coding
 */
export type ErrorSeverity = 'good' | 'moderate' | 'poor';

/**
 * Training panel state
 */
interface TrainingPanelState {
  stepCount: number;
  loss: number;
  previousLoss: number;
  currentSample: TrainingSample | null;
  currentOutput: number | null;
  currentError: number | null;
  isTraining: boolean;
  isConverged: boolean;
  /** T040: Animation mode state */
  isAnimated: boolean;
}

/**
 * T013-T016: TrainingPanel displays real-time training progress
 */
export class TrainingPanel {
  private container: HTMLElement | null;
  private state: TrainingPanelState;

  // UI element references
  private stepCountEl: HTMLElement | null = null;
  private lossValueEl: HTMLElement | null = null;
  private sampleDisplayEl: HTMLElement | null = null;
  private errorDisplayEl: HTMLElement | null = null;
  private statusEl: HTMLElement | null = null;
  /** T040: Animation toggle button */
  private animationToggleEl: HTMLButtonElement | null = null;

  /** T040: Callback for animation state change */
  private onAnimationChange?: (isAnimated: boolean) => void;

  constructor(containerId: string = 'training-info-container', options?: { onAnimationChange?: (isAnimated: boolean) => void }) {
    this.container = document.getElementById(containerId);
    this.onAnimationChange = options?.onAnimationChange;
    this.state = {
      stepCount: 0,
      loss: 1.0,
      previousLoss: 1.0,
      currentSample: null,
      currentOutput: null,
      currentError: null,
      isTraining: false,
      isConverged: false,
      isAnimated: false,
    };

    this.createUI();
  }

  /**
   * T014: Create the training panel UI elements
   */
  private createUI(): void {
    if (!this.container) {
      console.warn('Training info container not found');
      return;
    }

    this.container.innerHTML = `
      <div class="training-info">
        <div class="training-info-row">
          <span class="training-info-label">Step:</span>
          <span id="training-step-count" class="training-info-value">0</span>
        </div>
        <div class="training-info-row">
          <span class="training-info-label">Loss:</span>
          <span id="training-loss-value" class="training-info-value">1.000</span>
        </div>
        <div id="training-sample-display" class="training-sample-display">
          Ready to train
        </div>
        <div id="training-error-display" class="training-error-display" style="display: none;">
          <div class="training-error-row">
            <span class="training-error-label">Output:</span>
            <span id="training-output-value" class="training-error-value">-</span>
          </div>
          <div class="training-error-row">
            <span class="training-error-label">Expected:</span>
            <span id="training-expected-value" class="training-error-value">-</span>
          </div>
          <div class="training-error-row">
            <span class="training-error-label">Error:</span>
            <span id="training-error-value" class="training-error-value">-</span>
          </div>
        </div>
        <div id="training-status" class="training-status ready">Ready</div>
        <button id="animation-toggle" class="control-btn animation-toggle" aria-pressed="false">
          Animate Training
        </button>
      </div>
    `;

    // Cache element references
    this.stepCountEl = document.getElementById('training-step-count');
    this.lossValueEl = document.getElementById('training-loss-value');
    this.sampleDisplayEl = document.getElementById('training-sample-display');
    this.errorDisplayEl = document.getElementById('training-error-display');
    this.statusEl = document.getElementById('training-status');

    // T040: Setup animation toggle
    this.animationToggleEl = document.getElementById('animation-toggle') as HTMLButtonElement;
    this.animationToggleEl?.addEventListener('click', () => this.toggleAnimation());
  }

  /**
   * T040: Toggle animation mode
   */
  private toggleAnimation(): void {
    this.setAnimated(!this.state.isAnimated);
  }

  /**
   * T041: Set animation mode
   */
  setAnimated(isAnimated: boolean): void {
    this.state.isAnimated = isAnimated;

    if (this.animationToggleEl) {
      this.animationToggleEl.classList.toggle('active', isAnimated);
      this.animationToggleEl.setAttribute('aria-pressed', isAnimated.toString());
      this.animationToggleEl.textContent = isAnimated ? 'Animation On' : 'Animate Training';
    }

    this.onAnimationChange?.(isAnimated);
  }

  /**
   * T041: Get animation mode
   */
  getAnimated(): boolean {
    return this.state.isAnimated;
  }

  /**
   * T015: Update the step count and loss display
   */
  updateSummary(stepCount: number, loss: number): void {
    this.state.stepCount = stepCount;
    this.state.previousLoss = this.state.loss;
    this.state.loss = loss;

    // T050: Check for convergence
    this.state.isConverged = loss < 0.01;

    if (this.stepCountEl) {
      this.stepCountEl.textContent = stepCount.toString();
    }

    if (this.lossValueEl) {
      this.lossValueEl.textContent = loss.toFixed(3);
    }

    // Update status based on convergence
    this.updateStatus();
  }

  /**
   * T021: Update the current training sample display
   * Format: "[inputs] -> expects [output]"
   */
  updateSample(result: TrainingStepResult): void {
    this.state.currentSample = result.sample;
    this.state.currentOutput = result.output;
    this.state.currentError = result.error;
    this.state.isTraining = true;

    if (this.sampleDisplayEl) {
      this.sampleDisplayEl.innerHTML = `
        <span class="training-sample-inputs">[${result.sample.inputs.join(', ')}]</span>
        <span class="training-sample-arrow">-></span>
        <span>expects</span>
        <span class="training-sample-expected">${result.sample.expected[0]}</span>
      `;
    }

    // T028: Update error display with the sample result
    this.updateError(result);
  }

  /**
   * T026: Get error severity classification
   */
  getErrorSeverity(error: number): ErrorSeverity {
    const absError = Math.abs(error);
    if (absError < 0.1) {
      return 'good';
    } else if (absError < 0.3) {
      return 'moderate';
    } else {
      return 'poor';
    }
  }

  /**
   * T027: Update error display with color coding
   */
  private updateError(result: TrainingStepResult): void {
    if (!this.errorDisplayEl) return;

    // Show the error display
    this.errorDisplayEl.style.display = 'flex';

    const outputEl = document.getElementById('training-output-value');
    const expectedEl = document.getElementById('training-expected-value');
    const errorEl = document.getElementById('training-error-value');

    if (outputEl) {
      outputEl.textContent = result.output.toFixed(3);
    }
    if (expectedEl) {
      expectedEl.textContent = result.sample.expected[0].toString();
    }
    if (errorEl) {
      errorEl.textContent = result.error.toFixed(3);
    }

    // Apply severity color class to the container
    const severity = this.getErrorSeverity(result.error);
    this.errorDisplayEl.classList.remove('error-good-bg', 'error-moderate-bg', 'error-poor-bg');
    this.errorDisplayEl.classList.add(`error-${severity}-bg`);

    // Color the error value itself
    if (errorEl) {
      errorEl.classList.remove('error-good', 'error-moderate', 'error-poor');
      errorEl.classList.add(`error-${severity}`);
    }
  }

  /**
   * Update the training status indicator
   */
  private updateStatus(): void {
    if (!this.statusEl) return;

    this.statusEl.classList.remove('ready', 'training', 'converged');

    if (this.state.isConverged) {
      this.statusEl.textContent = 'Converged!';
      this.statusEl.classList.add('converged');
    } else if (this.state.isTraining) {
      this.statusEl.textContent = 'Training...';
      this.statusEl.classList.add('training');
    } else {
      this.statusEl.textContent = 'Ready';
      this.statusEl.classList.add('ready');
    }
  }

  /**
   * T016/T024: Reset the panel to initial state
   */
  reset(): void {
    this.state = {
      stepCount: 0,
      loss: 1.0,
      previousLoss: 1.0,
      currentSample: null,
      currentOutput: null,
      currentError: null,
      isTraining: false,
      isConverged: false,
      isAnimated: this.state.isAnimated, // Preserve animation setting across resets
    };

    if (this.stepCountEl) {
      this.stepCountEl.textContent = '0';
    }
    if (this.lossValueEl) {
      this.lossValueEl.textContent = '1.000';
    }
    if (this.sampleDisplayEl) {
      this.sampleDisplayEl.textContent = 'Ready to train';
    }
    if (this.errorDisplayEl) {
      this.errorDisplayEl.style.display = 'none';
      this.errorDisplayEl.classList.remove('error-good-bg', 'error-moderate-bg', 'error-poor-bg');
    }

    this.updateStatus();
  }

  /**
   * Get current panel state
   */
  getState(): TrainingPanelState {
    return { ...this.state };
  }
}
