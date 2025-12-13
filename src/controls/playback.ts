// Playback controls for training visualization

import type { Network, TrainingConfig, TrainingStepResult } from '../network/types';
import { trainStepWithDetails, computeLoss } from '../network/training';
import type { TrainStepResult } from '../network/training';
import type { NetworkRenderer } from '../visualisation/renderer';

export interface PlaybackCallbacks {
  onStep: (stepCount: number, loss: number) => void;
  onPlayPauseChange: (isPlaying: boolean) => void;
  onBeforeTrainStep?: () => void;
  onAfterTrainStep?: (result: TrainStepResult) => void;
  /** T007: Called for each sample processed during a training step */
  onSampleProcessed?: (result: TrainingStepResult) => void;
}

export class PlaybackControls {
  private network: Network;
  private renderer: NetworkRenderer;
  private config: TrainingConfig;
  private callbacks: PlaybackCallbacks;

  // UI Elements
  private playButton: HTMLButtonElement | null = null;
  private stepDisplay: HTMLElement | null = null;
  private lossDisplay: HTMLElement | null = null;

  // Animation state
  private animationFrameId: number | null = null;
  private lastFrameTime: number = 0;
  private targetFps: number = 30;
  private frameInterval: number = 1000 / 30;

  // Debouncing
  private isStepPending: boolean = false;

  constructor(
    network: Network,
    renderer: NetworkRenderer,
    config: TrainingConfig,
    callbacks: PlaybackCallbacks
  ) {
    this.network = network;
    this.renderer = renderer;
    this.config = config;
    this.callbacks = callbacks;

    this.init();
  }

  private init(): void {
    this.createUI();
    this.bindEvents();
    this.updateDisplay();
  }

  /**
   * T031: Simplified training controls - removed Step button per FR-020
   * 009 T021-T026: Horizontal Play/Reset layout, removed titles and duplicate stats
   */
  private createUI(): void {
    const container = document.getElementById('controls');
    if (!container) {
      console.warn('Controls container not found');
      return;
    }

    // 009 T021, T023: Simplified controls - no section title, horizontal buttons
    const playbackSection = document.createElement('div');
    playbackSection.className = 'control-section playback-controls';
    playbackSection.innerHTML = `
      <div class="training-controls-inline">
        <button id="play-btn" class="control-btn" aria-label="Play or pause continuous training">
          Play
        </button>
        <button id="reset-btn" class="control-btn" aria-label="Reset network to new random weights">
          Reset
        </button>
      </div>
      <div class="stats-display">
        <div class="stat">
          <span class="stat-label">Steps:</span>
          <span id="step-count" class="stat-value">0</span>
        </div>
        <div class="stat stat-loss">
          <span class="stat-label">Loss:</span>
          <span id="loss-value" class="stat-value">0.000</span>
          <span id="loss-trend" class="loss-trend" aria-live="polite"></span>
        </div>
      </div>
    `;

    container.appendChild(playbackSection);

    // Cache element references
    this.playButton = document.getElementById('play-btn') as HTMLButtonElement;
    this.stepDisplay = document.getElementById('step-count');
    this.lossDisplay = document.getElementById('loss-value');
  }

  private bindEvents(): void {
    // Play/Pause button
    this.playButton?.addEventListener('click', () => this.togglePlay());

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    // Ignore if user is typing in an input field
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    switch (event.code) {
      case 'Space':
        event.preventDefault();
        this.togglePlay();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.step();
        break;
    }
  }

  /**
   * Execute a single training step
   */
  step(): void {
    // Debounce rapid clicks
    if (this.isStepPending) return;
    this.isStepPending = true;

    // T009: Call onBeforeTrainStep hook (for weight delta capture)
    this.callbacks.onBeforeTrainStep?.();

    // T008: Use trainStepWithDetails to get per-sample results
    const result = trainStepWithDetails(
      this.network,
      this.config.learningRate,
      // T008: Call onSampleProcessed for each sample during training
      (sampleResult) => this.callbacks.onSampleProcessed?.(sampleResult)
    );

    this.config.stepCount++;
    this.config.currentLoss = result.loss;

    // T010: Call onAfterTrainStep hook (for weight delta computation)
    this.callbacks.onAfterTrainStep?.(result);

    // Update visualization
    this.renderer.update();
    this.updateDisplay();
    this.callbacks.onStep(this.config.stepCount, result.loss);

    // Release debounce after animation completes
    setTimeout(() => {
      this.isStepPending = false;
    }, 50);
  }

  /**
   * Toggle play/pause state
   */
  togglePlay(): void {
    if (this.config.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  /**
   * Start continuous training
   */
  play(): void {
    if (this.config.isPlaying) return;

    this.config.isPlaying = true;
    this.lastFrameTime = performance.now();
    this.animationLoop(this.lastFrameTime);
    this.updatePlayButton();
    this.callbacks.onPlayPauseChange(true);
  }

  /**
   * Pause continuous training
   */
  pause(): void {
    if (!this.config.isPlaying) return;

    this.config.isPlaying = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.updatePlayButton();
    this.callbacks.onPlayPauseChange(false);
  }

  /**
   * Animation loop for continuous training
   */
  private animationLoop(currentTime: number): void {
    if (!this.config.isPlaying) return;

    const elapsed = currentTime - this.lastFrameTime;

    if (elapsed >= this.frameInterval) {
      this.lastFrameTime = currentTime - (elapsed % this.frameInterval);

      // T009: Call onBeforeTrainStep hook (for weight delta capture)
      this.callbacks.onBeforeTrainStep?.();

      // T008: Use trainStepWithDetails to get per-sample results
      const result = trainStepWithDetails(
        this.network,
        this.config.learningRate,
        // T008: Call onSampleProcessed for each sample during training
        (sampleResult) => this.callbacks.onSampleProcessed?.(sampleResult)
      );

      this.config.stepCount++;
      this.config.currentLoss = result.loss;

      // T010: Call onAfterTrainStep hook (for weight delta computation)
      this.callbacks.onAfterTrainStep?.(result);

      // Update visualization
      this.renderer.update();
      this.updateDisplay();
      this.callbacks.onStep(this.config.stepCount, result.loss);
    }

    this.animationFrameId = requestAnimationFrame((t) => this.animationLoop(t));
  }

  /**
   * Update step and loss display
   */
  private updateDisplay(): void {
    if (this.stepDisplay) {
      this.stepDisplay.textContent = this.config.stepCount.toString();
    }
    if (this.lossDisplay) {
      this.lossDisplay.textContent = this.config.currentLoss.toFixed(3);
    }
  }

  /**
   * Update play button text
   */
  private updatePlayButton(): void {
    if (this.playButton) {
      this.playButton.textContent = this.config.isPlaying ? 'Pause' : 'Play';
      this.playButton.setAttribute(
        'aria-label',
        this.config.isPlaying ? 'Pause training' : 'Start continuous training'
      );
    }
  }

  /**
   * Set target frames per second
   */
  setFps(fps: number): void {
    this.targetFps = Math.max(1, Math.min(60, fps));
    this.frameInterval = 1000 / this.targetFps;
  }

  /**
   * Update network reference (after reset)
   */
  setNetwork(network: Network): void {
    this.network = network;
    // Recompute initial loss
    this.config.currentLoss = computeLoss(network);
    this.updateDisplay();
  }

  /**
   * Reset step counter and loss
   */
  resetStats(): void {
    this.config.stepCount = 0;
    this.config.currentLoss = computeLoss(this.network);
    this.updateDisplay();
  }

  /**
   * Get current training config
   */
  getConfig(): TrainingConfig {
    return this.config;
  }

  /**
   * Check if training is currently playing
   */
  isPlaying(): boolean {
    return this.config.isPlaying;
  }

  /**
   * Clean up event listeners
   */
  destroy(): void {
    this.pause();
    document.removeEventListener('keydown', (e) => this.handleKeyDown(e));
  }
}
