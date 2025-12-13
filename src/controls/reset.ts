// Reset control for reinitializing the network

import type { Network, TrainingConfig } from '../network/types';
import { reinitializeNetwork } from '../network/network';
import { computeLoss } from '../network/training';
import type { NetworkRenderer } from '../visualisation/renderer';
import type { PlaybackControls } from './playback';

export interface ResetCallbacks {
  onReset: () => void;
}

export class ResetControls {
  private network: Network;
  private renderer: NetworkRenderer;
  private config: TrainingConfig;
  private playbackControls: PlaybackControls;
  private callbacks: ResetCallbacks;

  // UI Elements
  private resetButton: HTMLButtonElement | null = null;

  constructor(
    network: Network,
    renderer: NetworkRenderer,
    config: TrainingConfig,
    playbackControls: PlaybackControls,
    callbacks: ResetCallbacks
  ) {
    this.network = network;
    this.renderer = renderer;
    this.config = config;
    this.playbackControls = playbackControls;
    this.callbacks = callbacks;

    this.init();
  }

  private init(): void {
    this.createUI();
    this.bindEvents();
  }

  /**
   * T033: Simplified reset controls - removed keyboard shortcut notice per FR-022
   * 009 T022, T024: Reset button now created by PlaybackControls in horizontal layout
   */
  private createUI(): void {
    // 009 T024: Reset button is now created by PlaybackControls alongside Play button
    // Just get reference to the existing button
    this.resetButton = document.getElementById('reset-btn') as HTMLButtonElement;
  }

  private bindEvents(): void {
    // Reset button click
    this.resetButton?.addEventListener('click', () => this.reset());

    // Keyboard shortcut
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

    if (event.key === 'r' || event.key === 'R') {
      event.preventDefault();
      this.reset();
    }
  }

  /**
   * Reset the network with new random weights
   */
  reset(): void {
    // Pause training if playing
    this.playbackControls.pause();

    // Reinitialize network weights
    reinitializeNetwork(this.network);

    // Reset training stats
    this.config.stepCount = 0;
    this.config.currentLoss = computeLoss(this.network);

    // Update playback controls display
    this.playbackControls.resetStats();

    // Re-render visualization
    this.renderer.update();

    // Notify callback
    this.callbacks.onReset();

    // Visual feedback
    if (this.resetButton) {
      this.resetButton.classList.add('active');
      setTimeout(() => {
        this.resetButton?.classList.remove('active');
      }, 150);
    }
  }

  /**
   * Update network reference (if network is replaced)
   */
  setNetwork(network: Network): void {
    this.network = network;
  }
}
