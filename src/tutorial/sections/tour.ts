// T015, T031-T036: Section 3 (Tour) - Trained network exploration
// This section shows the trained network state with weight highlighting
// 009: Enhanced with signal pulse animation and cleaned up UI

import type { TutorialStateManager } from '../state';
import type { NetworkRenderer } from '../../visualisation/renderer';

/**
 * TourSection manages the trained network tour experience
 * Displays trained weights and allows exploration
 */
export class TourSection {
  private container: HTMLElement | null;
  private explanationContainer: HTMLElement | null;
  private tutorialState: TutorialStateManager | null = null;
  /** 009 T030-T032: Renderer for signal pulse animation */
  private renderer: NetworkRenderer | null = null;
  /** 009 T047-T048: Interval ID for periodic signal pulse */
  private signalPulseInterval: ReturnType<typeof setInterval> | null = null;

  constructor(containerId: string = 'section-tour') {
    this.container = document.getElementById(containerId);
    this.explanationContainer = document.getElementById('tour-explanation');
    this.initializeContent();
  }

  /**
   * T032: Initialize content for the tour section
   * 009 T028-T029: Removed "Network not yet trained" message and "Highlight strong weights" button
   */
  private initializeContent(): void {
    if (!this.explanationContainer) return;

    // 009 T028-T029: Simplified content - no warning messages, no highlight button
    this.explanationContainer.innerHTML = `
      <div class="tour-intro">
        <p class="lead">
          After training, the network has learned patterns in the weights that allow it
          to correctly predict XOR outputs.
        </p>
      </div>
      <div class="tour-details">
        <h3>Understanding the Trained Network</h3>
        <p>
          The visualization shows the final weight values. Thicker lines indicate
          stronger connections. <strong>Hover over any weight</strong> to see its exact value.
        </p>
        <div class="weight-legend">
          <div class="legend-item">
            <span class="legend-line positive"></span>
            <span>Positive weights (blue) amplify the signal</span>
          </div>
          <div class="legend-item">
            <span class="legend-line negative"></span>
            <span>Negative weights (orange) suppress the signal</span>
          </div>
          <div class="legend-item">
            <span class="legend-thickness"></span>
            <span>Line thickness shows weight magnitude</span>
          </div>
        </div>
        <div class="tour-explanation-text">
          <h4>How the Network Learned XOR</h4>
          <p>
            XOR is a <em>non-linearly separable</em> problem - you can't draw a single straight line
            to separate the inputs. The hidden layers have learned to create <strong>internal
            representations</strong> that transform the inputs into a form that the output layer
            can separate.
          </p>
          <p>
            The first hidden layer often learns to detect "at least one input is 1" and
            "both inputs are 1". The output layer then combines these to produce the XOR result.
          </p>
        </div>
      </div>
    `;
  }

  /**
   * T020: Initialize the section with tutorial state reference
   * Uses trainingIterations > 0 for robust trained state detection
   * 009 T031: Accept renderer for signal pulse animation
   */
  initialize(tutorialState: TutorialStateManager, renderer?: NetworkRenderer): void {
    this.tutorialState = tutorialState;
    if (renderer) {
      this.renderer = renderer;
    }

    // T020: Subscribe to state changes, use trainingIterations for robust detection
    tutorialState.subscribe((state) => {
      const isTrained = state.trainingIterations > 0;
      this.updateTourStatus(isTrained);
    });
  }

  /**
   * 009 T031: Set renderer for signal pulse (can be called after construction)
   */
  setRenderer(renderer: NetworkRenderer): void {
    this.renderer = renderer;
  }

  /**
   * T020: Update the tour status display based on training iterations (not just completion flag)
   * T021: Apply pulsating CSS class to trained network
   * 009 T028: Removed "Network not yet trained" conditional - always show trained state info
   */
  private updateTourStatus(isTrained: boolean): void {
    const svg = document.getElementById('network-svg');

    // T021: Apply pulsating animation to trained weights
    if (svg && isTrained) {
      svg.classList.add('weights-pulsating');
    } else if (svg) {
      svg.classList.remove('weights-pulsating');
    }
  }

  /**
   * 009 T030-T031: Start periodic signal pulse animation
   */
  private startSignalPulse(): void {
    // Don't start if already running or no renderer
    if (this.signalPulseInterval || !this.renderer) return;

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // 009 T047: Periodic pulse every 3 seconds
    this.signalPulseInterval = setInterval(() => {
      this.renderer?.animateForwardPass();
    }, 3000);

    // Trigger immediate first pulse
    this.renderer.animateForwardPass();
  }

  /**
   * 009 T032, T048: Stop signal pulse animation
   */
  private stopSignalPulse(): void {
    if (this.signalPulseInterval) {
      clearInterval(this.signalPulseInterval);
      this.signalPulseInterval = null;
    }
  }

  /**
   * Called when section becomes active (scrolled into view)
   * 009 T031: Start signal pulse animation when entering trained network section
   */
  onActivate(): void {
    // Update status when section becomes visible
    if (this.tutorialState) {
      const state = this.tutorialState.getState();
      this.updateTourStatus(state.trainingIterations > 0);

      // 009 T031: Start signal pulse if network is trained
      if (state.trainingIterations > 0) {
        this.startSignalPulse();
      }
    }
  }

  /**
   * Called when section is scrolled away from
   * 009 T032: Stop signal pulse when leaving section
   */
  onDeactivate(): void {
    // 009 T032: Stop signal pulse animation
    this.stopSignalPulse();
  }

  /**
   * Get the section container element
   */
  getElement(): HTMLElement | null {
    return this.container;
  }
}
