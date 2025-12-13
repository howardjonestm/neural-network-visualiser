// T019-T020: Key Terms Module
// Defines educational terms and provides popup display functionality

import type { KeyTerm, SectionId } from './types';

/**
 * T019: Predefined key terms from FR-006
 */
export const KEY_TERMS: KeyTerm[] = [
  {
    id: 'neuron',
    term: 'Neuron',
    shortDefinition: 'A basic computational unit that receives inputs, applies weights and bias, then outputs a value.',
    extendedExplanation: 'Like biological neurons, artificial neurons process incoming signals. Each neuron computes a weighted sum of its inputs, adds a bias, and applies an activation function to produce its output.',
    relatedTerms: ['layer', 'activation', 'weight'],
    firstAppearance: 'objectives',
  },
  {
    id: 'weight',
    term: 'Weight',
    shortDefinition: 'A learnable parameter that determines the strength of a connection between neurons.',
    extendedExplanation: 'Weights are the primary parameters that the network learns during training. Positive weights amplify signals, negative weights suppress them, and their magnitude affects how strongly one neuron influences another.',
    mathFormula: 'output = Σ(input × weight) + bias',
    relatedTerms: ['neuron', 'backpropagation'],
    firstAppearance: 'training',
  },
  {
    id: 'layer',
    term: 'Layer',
    shortDefinition: 'A group of neurons at the same depth in the network, processing information together.',
    extendedExplanation: 'Neural networks are organized into layers: an input layer receives data, hidden layers process it, and an output layer produces predictions. Deeper networks (more layers) can learn more complex patterns.',
    relatedTerms: ['neuron', 'forward-pass'],
    firstAppearance: 'objectives',
  },
  {
    id: 'activation',
    term: 'Activation',
    shortDefinition: 'The output value of a neuron after applying a non-linear activation function.',
    extendedExplanation: 'Activation functions introduce non-linearity, allowing networks to learn complex patterns. Common functions include sigmoid (outputs 0-1), ReLU (outputs 0 or positive), and tanh (outputs -1 to 1).',
    mathFormula: 'activation = sigmoid(Σ(input × weight) + bias)',
    relatedTerms: ['neuron', 'forward-pass'],
    firstAppearance: 'training',
  },
  {
    id: 'loss',
    term: 'Loss',
    shortDefinition: 'A measure of how wrong the network\'s prediction is compared to the expected output.',
    extendedExplanation: 'Loss quantifies prediction error. During training, the goal is to minimize loss. Lower loss means the network is making better predictions. Common loss functions include mean squared error and cross-entropy.',
    mathFormula: 'MSE = (predicted - expected)²',
    relatedTerms: ['backpropagation', 'forward-pass'],
    firstAppearance: 'training',
  },
  {
    id: 'forward-pass',
    term: 'Forward Pass',
    shortDefinition: 'The process of computing a prediction by passing input through the network layer by layer.',
    extendedExplanation: 'During a forward pass, data flows from the input layer through each hidden layer to the output. At each neuron, inputs are weighted, summed with bias, and transformed by an activation function.',
    relatedTerms: ['layer', 'activation', 'inference'],
    firstAppearance: 'training',
  },
  {
    id: 'backpropagation',
    term: 'Backpropagation',
    shortDefinition: 'An algorithm that calculates how to adjust each weight to reduce prediction error.',
    extendedExplanation: 'Backpropagation works backwards from the output, calculating how much each weight contributed to the error. Using calculus (chain rule), it determines the gradient for each weight, indicating how to adjust it for improvement.',
    mathFormula: 'new_weight = old_weight - learning_rate × gradient',
    relatedTerms: ['weight', 'loss', 'learning-rate'],
    firstAppearance: 'training',
  },
  {
    id: 'inference',
    term: 'Inference',
    shortDefinition: 'Using a trained network to make predictions on new inputs without further learning.',
    extendedExplanation: 'After training, the network\'s weights are fixed. Inference is simply running a forward pass to get predictions. Unlike training, no weight updates occur during inference.',
    relatedTerms: ['forward-pass', 'training'],
    firstAppearance: 'inference',
  },
];

/**
 * Get a key term by its ID
 */
export function getKeyTerm(id: string): KeyTerm | undefined {
  return KEY_TERMS.find(term => term.id === id);
}

/**
 * Get all key terms that first appear in a specific section
 */
export function getTermsForSection(sectionId: SectionId): KeyTerm[] {
  return KEY_TERMS.filter(term => term.firstAppearance === sectionId);
}

/**
 * T020: KeyTermPopup manages the display of key term definitions
 */
export class KeyTermPopup {
  private container: HTMLElement | null = null;
  private currentTermId: string | null = null;
  private isVisible: boolean = false;

  constructor() {
    this.createContainer();
  }

  /**
   * Create the popup container element
   */
  private createContainer(): void {
    // Check if already exists
    let container = document.getElementById('key-term-popup');
    if (!container) {
      container = document.createElement('div');
      container.id = 'key-term-popup';
      container.className = 'key-term-popup';
      container.setAttribute('role', 'tooltip');
      container.setAttribute('aria-hidden', 'true');
      document.body.appendChild(container);
    }
    this.container = container;
  }

  /**
   * Show the popup for a specific term at a position
   */
  show(termId: string, position: { x: number; y: number }): void {
    const term = getKeyTerm(termId);
    if (!term || !this.container) return;

    this.currentTermId = termId;
    this.isVisible = true;

    // Build popup content
    this.container.innerHTML = `
      <div class="key-term-header">
        <span class="key-term-title">${term.term}</span>
        <button class="key-term-close" aria-label="Close definition">&times;</button>
      </div>
      <div class="key-term-body">
        <p class="key-term-definition">${term.shortDefinition}</p>
        ${term.extendedExplanation ? `
          <details class="key-term-details">
            <summary>Learn more</summary>
            <p>${term.extendedExplanation}</p>
          </details>
        ` : ''}
        ${term.mathFormula ? `
          <div class="key-term-formula">
            <code>${term.mathFormula}</code>
          </div>
        ` : ''}
        ${term.relatedTerms && term.relatedTerms.length > 0 ? `
          <div class="key-term-related">
            <span class="related-label">Related:</span>
            ${term.relatedTerms.map(id => {
              const related = getKeyTerm(id);
              return related ? `<button class="related-term-btn" data-term-id="${id}">${related.term}</button>` : '';
            }).join('')}
          </div>
        ` : ''}
      </div>
    `;

    // Position the popup
    this.positionAt(position);

    // Show with animation
    this.container.classList.add('visible');
    this.container.setAttribute('aria-hidden', 'false');

    // Wire up close button
    const closeBtn = this.container.querySelector('.key-term-close');
    closeBtn?.addEventListener('click', () => this.hide());

    // Wire up related term buttons
    const relatedBtns = this.container.querySelectorAll('.related-term-btn');
    relatedBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const newTermId = (e.target as HTMLElement).dataset.termId;
        if (newTermId) {
          this.show(newTermId, position);
        }
      });
    });
  }

  /**
   * Position the popup near a point, staying within viewport
   */
  private positionAt(position: { x: number; y: number }): void {
    if (!this.container) return;

    const padding = 16;
    const popupRect = this.container.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = position.x + 10;
    let top = position.y + 10;

    // Keep within horizontal bounds
    if (left + popupRect.width > viewportWidth - padding) {
      left = position.x - popupRect.width - 10;
    }
    if (left < padding) {
      left = padding;
    }

    // Keep within vertical bounds
    if (top + popupRect.height > viewportHeight - padding) {
      top = position.y - popupRect.height - 10;
    }
    if (top < padding) {
      top = padding;
    }

    this.container.style.left = `${left}px`;
    this.container.style.top = `${top}px`;
  }

  /**
   * Hide the popup
   */
  hide(): void {
    if (!this.container) return;

    this.isVisible = false;
    this.currentTermId = null;
    this.container.classList.remove('visible');
    this.container.setAttribute('aria-hidden', 'true');
  }

  /**
   * Check if popup is currently visible
   */
  isShowing(): boolean {
    return this.isVisible;
  }

  /**
   * Get the currently displayed term ID
   */
  getCurrentTermId(): string | null {
    return this.currentTermId;
  }

  /**
   * Toggle visibility for a term
   */
  toggle(termId: string, position: { x: number; y: number }): void {
    if (this.isVisible && this.currentTermId === termId) {
      this.hide();
    } else {
      this.show(termId, position);
    }
  }
}

/**
 * Create a clickable key term element that triggers the popup
 */
export function createKeyTermTrigger(
  termId: string,
  displayText?: string,
  popup?: KeyTermPopup
): HTMLElement {
  const term = getKeyTerm(termId);
  if (!term) {
    const span = document.createElement('span');
    span.textContent = displayText || termId;
    return span;
  }

  const button = document.createElement('button');
  button.className = 'key-term-trigger';
  button.textContent = displayText || term.term;
  button.setAttribute('aria-label', `Learn about ${term.term}`);
  button.dataset.termId = termId;

  if (popup) {
    button.addEventListener('click', (e) => {
      const rect = button.getBoundingClientRect();
      popup.toggle(termId, { x: rect.right, y: rect.top });
      e.stopPropagation();
    });
  }

  return button;
}
