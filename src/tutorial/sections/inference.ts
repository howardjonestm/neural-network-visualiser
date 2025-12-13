// T016: Section 4 (Inference) - Running predictions on trained network
// This section demonstrates expected vs actual output comparison
// 009: Enhanced with prominent prediction display

import type { TutorialStateManager } from '../state';
import type { PredictionResult } from '../types';

/**
 * InferenceSection manages the inference demonstration
 * Shows expected vs actual output comparison
 */
export class InferenceSection {
  private container: HTMLElement | null;
  private explanationContainer: HTMLElement | null;
  private tutorialState: TutorialStateManager | null = null;

  constructor(containerId: string = 'section-inference') {
    this.container = document.getElementById(containerId);
    this.explanationContainer = document.getElementById('inference-explanation');
    this.initializeContent();
  }

  /**
   * Initialize static content for the inference section
   * 009 T038: Added prominent prediction result display area
   */
  private initializeContent(): void {
    if (!this.explanationContainer) return;

    this.explanationContainer.innerHTML = `
      <div class="inference-intro">
        <p class="lead">
          <strong>Inference</strong> is using the trained network to make predictions
          on new inputs. Let's test how well the network learned XOR.
        </p>
      </div>
      <div id="inference-prediction-display" class="inference-prediction-display" style="display: none;">
        <!-- 009 T038: Prominent prediction result will be shown here -->
      </div>
      <div class="inference-explanation">
        <h3>How Inference Works</h3>
        <p>
          During inference, input values flow through the network's trained weights
          to produce an output. No learning happens - the weights stay fixed.
        </p>
        <details class="inference-steps-details">
          <summary>View Steps</summary>
          <ol>
            <li>Select an XOR input combination (e.g., [0, 1])</li>
            <li>Click "Run Demo" to see the forward pass</li>
            <li>Compare the network's prediction to the expected XOR output</li>
          </ol>
        </details>
        <p>
          A well-trained network should produce outputs close to the expected values:
          near 0 when inputs are the same, near 1 when they differ.
        </p>
      </div>
      <div class="xor-reference">
        <details>
          <summary>XOR Reference Table</summary>
          <table class="xor-mini-table">
            <thead>
              <tr>
                <th>Input</th>
                <th>Expected</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>[0, 0]</td><td>0</td></tr>
              <tr><td>[0, 1]</td><td>1</td></tr>
              <tr><td>[1, 0]</td><td>1</td></tr>
              <tr><td>[1, 1]</td><td>0</td></tr>
            </tbody>
          </table>
        </details>
      </div>
    `;
  }

  /**
   * 009 T038: Update prominent prediction display
   * Enhanced to be very visible and clear
   */
  updatePredictionDisplay(result: PredictionResult | null): void {
    const displayEl = document.getElementById('inference-prediction-display');
    if (!displayEl) return;

    if (!result) {
      displayEl.style.display = 'none';
      return;
    }

    const predictedClass = result.predicted >= 0.5 ? 1 : 0;
    const statusClass = result.isCorrect ? 'correct' : 'incorrect';
    displayEl.innerHTML = `
      <div class="inference-result-banner ${statusClass}">
        <div class="result-badge ${statusClass}">
          ${result.isCorrect ? '✓ CORRECT' : '✗ INCORRECT'}
        </div>
        <div class="result-main">
          <div class="result-input">Input: [${result.input[0]}, ${result.input[1]}]</div>
          <div class="result-output">
            <span class="output-raw">${result.predicted.toFixed(4)}</span>
            <span class="output-arrow">→</span>
            <span class="output-class ${statusClass}">${predictedClass}</span>
          </div>
          <div class="result-expected">Expected: <strong>${result.expected}</strong></div>
        </div>
      </div>
    `;
    displayEl.style.display = 'block';
  }

  /**
   * Initialize the section with tutorial state reference
   */
  initialize(tutorialState: TutorialStateManager): void {
    this.tutorialState = tutorialState;

    // Subscribe to state changes to update inference status
    tutorialState.subscribe((state) => {
      this.updateInferenceStatus(state.trainingCompleted);
    });
  }

  /**
   * T022: Update the inference status display
   * FR-013: Removed "Network Not Yet Trained" warning - users can always experiment
   */
  private updateInferenceStatus(_trainingCompleted: boolean): void {
    const statusEl = document.getElementById('inference-status');
    if (!statusEl) return;

    // T022: Always show ready status - no warning message per FR-013
    statusEl.innerHTML = `
      <div class="inference-status-badge inference-status-ready">
        <span class="status-icon">&#10003;</span>
        <span>Ready to Run Inference</span>
      </div>
      <p>Select an input and run the demo to see how the network predicts XOR.</p>
    `;
  }

  /**
   * Called when section becomes active (scrolled into view)
   */
  onActivate(): void {
    // Update status when section becomes visible
    if (this.tutorialState) {
      const state = this.tutorialState.getState();
      this.updateInferenceStatus(state.trainingCompleted);
    }
  }

  /**
   * Called when section is scrolled away from
   * FR-017: Demo should stop when scrolling away
   */
  onDeactivate(): void {
    // Demo cancellation is handled in main.ts onSectionDeactivate
  }

  /**
   * Get the section container element
   */
  getElement(): HTMLElement | null {
    return this.container;
  }
}
