// T026-T034, T038: Hint/callout system with localStorage persistence

import type { Hint, HintState } from './types';
import { HINTS, getHintById } from './content';

const STORAGE_KEY = 'nn-viz-hints';

export interface HintManagerOptions {
  onHintShow?: (hint: Hint) => void;
  onHintDismiss?: (hintId: string) => void;
  suppressDuringPlay?: boolean;
}

export class HintManager {
  private state: HintState;
  private options: HintManagerOptions;
  private activeHint: HTMLElement | null = null;
  private interactionTracked: Set<string> = new Set();
  private isPlaying: boolean = false;

  constructor(options: HintManagerOptions = {}) {
    this.options = options;
    this.state = this.loadState();
    this.init();
  }

  private init(): void {
    // Show load-triggered hints after a short delay
    setTimeout(() => {
      this.showLoadHints();
    }, 500);
  }

  // T026: localStorage persistence
  private loadState(): HintState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      console.warn('Failed to load hint state from localStorage');
    }
    return {
      dismissedHints: {},
      lastResetDate: null,
    };
  }

  private saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      console.warn('Failed to save hint state to localStorage');
    }
  }

  // T030: Show load-triggered hints
  private showLoadHints(): void {
    if (this.isPlaying && this.options.suppressDuringPlay) return;

    const loadHints = HINTS.filter(
      (hint) =>
        hint.triggerEvent === 'load' && !this.state.dismissedHints[hint.id]
    );

    // Show first load hint
    if (loadHints.length > 0) {
      this.showHint(loadHints[0]);
    }
  }

  // T027: Hint positioning logic
  private calculatePosition(
    hint: Hint,
    targetRect: DOMRect
  ): { top: number; left: number; arrowPosition: string } {
    const padding = 12;
    const arrowSize = 8;
    const hintWidth = 280;
    const hintHeight = 100; // Estimated

    let top: number;
    let left: number;
    let arrowPosition: string;

    switch (hint.position) {
      case 'top':
        top = targetRect.top - hintHeight - arrowSize - padding;
        left = targetRect.left + targetRect.width / 2 - hintWidth / 2;
        arrowPosition = 'bottom';
        break;
      case 'bottom':
        top = targetRect.bottom + arrowSize + padding;
        left = targetRect.left + targetRect.width / 2 - hintWidth / 2;
        arrowPosition = 'top';
        break;
      case 'left':
        top = targetRect.top + targetRect.height / 2 - hintHeight / 2;
        left = targetRect.left - hintWidth - arrowSize - padding;
        arrowPosition = 'right';
        break;
      case 'right':
      default:
        top = targetRect.top + targetRect.height / 2 - hintHeight / 2;
        left = targetRect.right + arrowSize + padding;
        arrowPosition = 'left';
        break;
    }

    // Keep within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left < padding) left = padding;
    if (left + hintWidth > viewportWidth - padding) {
      left = viewportWidth - hintWidth - padding;
    }
    if (top < padding) top = padding;
    if (top + hintHeight > viewportHeight - padding) {
      top = viewportHeight - hintHeight - padding;
    }

    return { top, left, arrowPosition };
  }

  // Show a hint
  showHint(hint: Hint): void {
    if (this.isPlaying && this.options.suppressDuringPlay) return;
    if (this.activeHint) {
      this.hideActiveHint();
    }

    const target = document.querySelector(hint.targetSelector);
    if (!target) {
      console.warn(`Hint target not found: ${hint.targetSelector}`);
      return;
    }

    const targetRect = target.getBoundingClientRect();
    const { top, left, arrowPosition } = this.calculatePosition(hint, targetRect);

    // T028: Create hint element
    const hintEl = document.createElement('div');
    hintEl.className = `hint hint-arrow-${arrowPosition}`;
    hintEl.setAttribute('role', 'tooltip');
    hintEl.setAttribute('aria-live', 'polite');
    hintEl.innerHTML = `
      <div class="hint-header">
        <span class="hint-title">${hint.title}</span>
        <button class="hint-dismiss" aria-label="Dismiss hint" title="Dismiss">×</button>
      </div>
      <p class="hint-content">${hint.content}</p>
    `;

    hintEl.style.position = 'fixed';
    hintEl.style.top = `${top}px`;
    hintEl.style.left = `${left}px`;
    hintEl.style.zIndex = '1001';

    document.body.appendChild(hintEl);
    this.activeHint = hintEl;

    // T029: Bind dismiss button
    const dismissBtn = hintEl.querySelector('.hint-dismiss');
    dismissBtn?.addEventListener('click', () => {
      this.dismissHint(hint.id);
    });

    // Also allow clicking outside to dismiss
    setTimeout(() => {
      document.addEventListener('click', this.handleOutsideClick, { once: true });
    }, 100);

    this.options.onHintShow?.(hint);
  }

  private handleOutsideClick = (event: MouseEvent): void => {
    if (this.activeHint && !this.activeHint.contains(event.target as Node)) {
      this.hideActiveHint();
    }
  };

  private hideActiveHint(): void {
    if (this.activeHint) {
      this.activeHint.remove();
      this.activeHint = null;
    }
    document.removeEventListener('click', this.handleOutsideClick);
  }

  // T029: Dismiss hint functionality
  dismissHint(hintId: string): void {
    const hint = getHintById(hintId);
    if (hint?.showOnce) {
      this.state.dismissedHints[hintId] = true;
      this.saveState();
    }
    this.hideActiveHint();
    this.options.onHintDismiss?.(hintId);

    // Show next load hint if any
    const nextLoadHints = HINTS.filter(
      (h) =>
        h.triggerEvent === 'load' && !this.state.dismissedHints[h.id]
    );
    if (nextLoadHints.length > 0) {
      setTimeout(() => this.showHint(nextLoadHints[0]), 300);
    }
  }

  // T031-T034: Handle first-interaction hints
  trackFirstInteraction(elementId: string): void {
    if (this.interactionTracked.has(elementId)) return;
    if (this.isPlaying && this.options.suppressDuringPlay) return;

    this.interactionTracked.add(elementId);

    // Find hint for this element
    const hint = HINTS.find(
      (h) =>
        h.triggerEvent === 'first-interaction' &&
        h.targetSelector === `#${elementId}` &&
        !this.state.dismissedHints[h.id]
    );

    if (hint) {
      this.showHint(hint);
    }
  }

  // T38: Reset all hints
  resetHints(): void {
    this.state = {
      dismissedHints: {},
      lastResetDate: new Date().toISOString(),
    };
    this.saveState();
    this.interactionTracked.clear();
    this.hideActiveHint();

    // Show initial hints again
    setTimeout(() => {
      this.showLoadHints();
    }, 300);
  }

  // T054: Suppress hints during play mode
  setPlayingState(isPlaying: boolean): void {
    this.isPlaying = isPlaying;
    if (isPlaying && this.options.suppressDuringPlay) {
      this.hideActiveHint();
    }
  }

  // Check if any hints remain
  hasRemainingHints(): boolean {
    return HINTS.some((hint) => !this.state.dismissedHints[hint.id]);
  }

  // Get dismissed hint count
  getDismissedCount(): number {
    return Object.keys(this.state.dismissedHints).length;
  }
}
