// T033-T034: Weight History Panel Component
// Displays historical values for a selected weight

import type { WeightDeltaTracker } from './weight-delta';

export interface WeightHistoryPanelOptions {
  containerId: string;
}

/**
 * T033: Panel that shows the last 10 training step values for a selected weight
 */
export class WeightHistoryPanel {
  private element: HTMLElement;
  private tracker: WeightDeltaTracker | null = null;
  private currentWeightId: string | null = null;
  private visible: boolean = false;

  constructor(options: WeightHistoryPanelOptions) {
    const container = document.getElementById(options.containerId);
    if (!container) {
      // Create the panel element if it doesn't exist
      this.element = document.createElement('div');
      this.element.id = options.containerId;
      this.element.className = 'weight-history-panel';
      document.body.appendChild(this.element);
    } else {
      this.element = container;
      this.element.className = 'weight-history-panel';
    }

    // Add close button
    this.element.innerHTML = `
      <div class="weight-history-header">
        <span class="weight-history-title">Weight History</span>
        <button class="weight-history-close" aria-label="Close history panel">&times;</button>
      </div>
      <div class="weight-history-content"></div>
    `;

    // Bind close button
    const closeBtn = this.element.querySelector('.weight-history-close');
    closeBtn?.addEventListener('click', () => this.hide());

    // Hide initially
    this.element.style.display = 'none';
  }

  /**
   * Set the tracker reference
   */
  setTracker(tracker: WeightDeltaTracker): void {
    this.tracker = tracker;
  }

  /**
   * Show history for a specific weight
   * @param weightId - The ID of the weight to show history for
   * @param position - Optional position for the panel
   */
  show(weightId: string, position?: { x: number; y: number }): void {
    if (!this.tracker) {
      console.warn('WeightHistoryPanel: No tracker set');
      return;
    }

    this.currentWeightId = weightId;
    this.visible = true;
    this.element.style.display = 'block';

    // Position the panel near the click
    if (position) {
      const panelWidth = 200;
      const panelHeight = 300;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Calculate position, flip if necessary
      let x = position.x + 10;
      let y = position.y + 10;

      if (x + panelWidth > viewportWidth - 20) {
        x = position.x - panelWidth - 10;
      }
      if (y + panelHeight > viewportHeight - 20) {
        y = position.y - panelHeight - 10;
      }

      x = Math.max(10, x);
      y = Math.max(10, y);

      this.element.style.left = `${x}px`;
      this.element.style.top = `${y}px`;
    }

    this.render();
  }

  /**
   * Hide the history panel
   */
  hide(): void {
    this.visible = false;
    this.currentWeightId = null;
    this.element.style.display = 'none';
  }

  /**
   * Toggle visibility for a weight
   */
  toggle(weightId: string, position?: { x: number; y: number }): void {
    if (this.visible && this.currentWeightId === weightId) {
      this.hide();
    } else {
      this.show(weightId, position);
    }
  }

  /**
   * Check if panel is visible
   */
  isVisible(): boolean {
    return this.visible;
  }

  /**
   * T034: Render history with color-coded delta display
   */
  private render(): void {
    if (!this.tracker || !this.currentWeightId) return;

    const contentEl = this.element.querySelector('.weight-history-content');
    if (!contentEl) return;

    const history = this.tracker.getHistory(this.currentWeightId);

    if (history.length === 0) {
      contentEl.innerHTML = `
        <div class="weight-history-empty">
          No history yet. Train the network to see weight changes.
        </div>
      `;
      return;
    }

    // Calculate deltas between consecutive values
    const entries: string[] = [];
    for (let i = 0; i < history.length; i++) {
      const value = history[i];
      const delta = i > 0 ? value - history[i - 1] : 0;
      const deltaClass = delta > 0 ? 'positive' : delta < 0 ? 'negative' : 'none';
      const deltaPrefix = delta >= 0 ? '+' : '';
      const step = history.length - history.length + i + 1; // Show as step 1, 2, 3...

      entries.push(`
        <div class="history-entry">
          <span class="history-step">${step}</span>
          <span class="history-value">${value.toFixed(4)}</span>
          ${i > 0 ? `<span class="history-delta ${deltaClass}">${deltaPrefix}${delta.toFixed(4)}</span>` : '<span class="history-delta none">-</span>'}
        </div>
      `);
    }

    // Update title with weight ID
    const titleEl = this.element.querySelector('.weight-history-title');
    if (titleEl) {
      titleEl.textContent = `Weight: ${this.currentWeightId}`;
    }

    contentEl.innerHTML = `
      <div class="history-header">
        <span class="history-col">Step</span>
        <span class="history-col">Value</span>
        <span class="history-col">Change</span>
      </div>
      ${entries.join('')}
    `;
  }
}
