// Parameter controls for adjusting training settings

import type { TrainingConfig } from '../network/types';

export interface ParametersCallbacks {
  onLearningRateChange: (learningRate: number) => void;
}

export class ParametersControls {
  private config: TrainingConfig;
  private callbacks: ParametersCallbacks;

  // UI Elements
  private slider: HTMLInputElement | null = null;
  private valueDisplay: HTMLElement | null = null;

  // Learning rate bounds
  private readonly minRate = 0.01;
  private readonly maxRate = 2.0;
  private readonly defaultRate = 0.5;
  private readonly step = 0.01;

  constructor(config: TrainingConfig, callbacks: ParametersCallbacks) {
    this.config = config;
    this.callbacks = callbacks;

    this.init();
  }

  private init(): void {
    this.createUI();
    this.bindEvents();
    this.updateDisplay();
  }

  private createUI(): void {
    const container = document.getElementById('controls');
    if (!container) {
      console.warn('Controls container not found');
      return;
    }

    // Create parameters section
    const parametersSection = document.createElement('div');
    parametersSection.className = 'control-section parameters-controls';
    parametersSection.innerHTML = `
      <h3>Learning Rate</h3>
      <div class="slider-container">
        <input
          type="range"
          id="learning-rate-slider"
          min="${this.minRate}"
          max="${this.maxRate}"
          step="${this.step}"
          value="${this.config.learningRate}"
          aria-label="Adjust learning rate"
          aria-valuemin="${this.minRate}"
          aria-valuemax="${this.maxRate}"
          aria-valuenow="${this.config.learningRate}"
        />
        <span id="learning-rate-value" class="slider-value">${this.config.learningRate.toFixed(2)}</span>
      </div>
      <div class="parameter-hints">
        <span>Low: Slow, stable</span>
        <span>High: Fast, unstable</span>
      </div>
    `;

    container.appendChild(parametersSection);

    // Cache element references
    this.slider = document.getElementById('learning-rate-slider') as HTMLInputElement;
    this.valueDisplay = document.getElementById('learning-rate-value');
  }

  private bindEvents(): void {
    if (!this.slider) return;

    // Handle slider input (continuous updates)
    this.slider.addEventListener('input', () => this.handleSliderChange());

    // Handle keyboard navigation
    this.slider.addEventListener('keydown', (e) => this.handleKeyDown(e));
  }

  private handleSliderChange(): void {
    if (!this.slider) return;

    const value = parseFloat(this.slider.value);
    this.config.learningRate = value;
    this.updateDisplay();
    this.callbacks.onLearningRateChange(value);
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.slider) return;

    let value = parseFloat(this.slider.value);
    const largeStep = 0.1;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        // Default behavior handles small steps
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        // Default behavior handles small steps
        break;
      case 'PageDown':
        event.preventDefault();
        value = Math.max(this.minRate, value - largeStep);
        this.slider.value = value.toString();
        this.handleSliderChange();
        break;
      case 'PageUp':
        event.preventDefault();
        value = Math.min(this.maxRate, value + largeStep);
        this.slider.value = value.toString();
        this.handleSliderChange();
        break;
      case 'Home':
        event.preventDefault();
        this.slider.value = this.minRate.toString();
        this.handleSliderChange();
        break;
      case 'End':
        event.preventDefault();
        this.slider.value = this.maxRate.toString();
        this.handleSliderChange();
        break;
    }
  }

  private updateDisplay(): void {
    if (this.valueDisplay) {
      this.valueDisplay.textContent = this.config.learningRate.toFixed(2);
    }
    if (this.slider) {
      this.slider.setAttribute('aria-valuenow', this.config.learningRate.toString());
    }
  }

  /**
   * Reset learning rate to default
   */
  reset(): void {
    this.config.learningRate = this.defaultRate;
    if (this.slider) {
      this.slider.value = this.defaultRate.toString();
    }
    this.updateDisplay();
    this.callbacks.onLearningRateChange(this.defaultRate);
  }

  /**
   * Set learning rate programmatically
   */
  setLearningRate(rate: number): void {
    const clampedRate = Math.max(this.minRate, Math.min(this.maxRate, rate));
    this.config.learningRate = clampedRate;
    if (this.slider) {
      this.slider.value = clampedRate.toString();
    }
    this.updateDisplay();
  }

  /**
   * Get current learning rate
   */
  getLearningRate(): number {
    return this.config.learningRate;
  }
}
