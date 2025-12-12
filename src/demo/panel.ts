// Calculation Panel
// Displays mathematical formulas during forward pass demonstration
// Shows accumulated calculations for all layers visited

import type { DemoStep, NeuronCalculation } from './types';

/**
 * T052: Create CalculationPanel component
 * Now accumulates calculations across all layers
 */
export class CalculationPanel {
  private container: HTMLElement;
  private headerEl: HTMLDivElement | null = null;
  private contentEl: HTMLDivElement | null = null;
  private layerSections: Map<number, HTMLDivElement> = new Map();

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container #${containerId} not found`);
    }
    this.container = container;
    this.init();
  }

  private init(): void {
    // Clear container
    this.container.innerHTML = '';

    // T056: Create header
    this.headerEl = document.createElement('div');
    this.headerEl.className = 'calculation-panel-header';
    this.headerEl.textContent = 'Calculations';
    this.container.appendChild(this.headerEl);

    // Content container for all layer sections
    this.contentEl = document.createElement('div');
    this.contentEl.className = 'calculation-panel-content';
    this.container.appendChild(this.contentEl);

    // Initially hidden
    this.hide();
  }

  /**
   * T055: Render calculations for current step
   * Accumulates calculations - adds new layer while keeping previous ones
   */
  render(step: DemoStep, _activeNeuronIndex: number = -1): void {
    if (!this.contentEl) return;

    // Check if we already have this layer
    let layerSection = this.layerSections.get(step.layerIndex);

    if (!layerSection) {
      // Create new layer section
      layerSection = this.createLayerSection(step);
      this.layerSections.set(step.layerIndex, layerSection);
      this.contentEl.appendChild(layerSection);
    } else {
      // Update existing section
      this.updateLayerSection(layerSection, step);
    }

    // Highlight active layer and scroll to it
    this.highlightLayer(step.layerIndex);

    this.show();
  }

  /**
   * Create a section for a layer's calculations
   */
  private createLayerSection(step: DemoStep): HTMLDivElement {
    const section = document.createElement('div');
    section.className = 'calculation-layer-section';
    section.setAttribute('data-layer', String(step.layerIndex));

    // Layer label
    const labelEl = document.createElement('div');
    labelEl.className = 'calculation-layer-label';
    labelEl.textContent = step.layerLabel;
    section.appendChild(labelEl);

    // Calculation list
    const listEl = document.createElement('ul');
    listEl.className = 'calculation-list';
    listEl.setAttribute('aria-label', `${step.layerLabel} calculations`);

    step.neurons.forEach((calc) => {
      const item = this.createCalculationItem(calc, false);
      listEl.appendChild(item);
    });

    section.appendChild(listEl);

    return section;
  }

  /**
   * Update an existing layer section
   */
  private updateLayerSection(section: HTMLDivElement, step: DemoStep): void {
    const listEl = section.querySelector('.calculation-list');
    if (!listEl) return;

    // Update calculations
    listEl.innerHTML = '';
    step.neurons.forEach((calc) => {
      const item = this.createCalculationItem(calc, false);
      listEl.appendChild(item);
    });
  }

  /**
   * Create a single calculation item
   */
  private createCalculationItem(
    calc: NeuronCalculation,
    isActive: boolean
  ): HTMLLIElement {
    const item = document.createElement('li');
    item.className = `calculation-item ${isActive ? 'active' : ''}`;

    // Neuron ID
    const neuronIdEl = document.createElement('div');
    neuronIdEl.className = 'calculation-neuron-id';
    neuronIdEl.textContent = this.formatNeuronId(calc.neuronId);

    // Formula
    const formulaEl = document.createElement('div');
    formulaEl.className = 'calculation-formula';
    formulaEl.textContent = calc.formula;

    item.appendChild(neuronIdEl);
    item.appendChild(formulaEl);

    return item;
  }

  /**
   * Format neuron ID for display
   */
  private formatNeuronId(id: string): string {
    // Convert "n_2_1" to "Neuron 2.1"
    const parts = id.split('_');
    if (parts.length >= 3) {
      return `Neuron ${parts[1]}.${parts[2]}`;
    }
    return id;
  }

  /**
   * T057: Highlight the current layer section
   */
  highlightLayer(layerIndex: number): void {
    // Remove active class from all sections
    this.layerSections.forEach((section) => {
      section.classList.remove('active');
    });

    // Add active class to current layer
    const activeSection = this.layerSections.get(layerIndex);
    if (activeSection) {
      activeSection.classList.add('active');
      // Scroll into view
      activeSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /**
   * Highlight a specific neuron calculation within current layer
   */
  highlightNeuron(layerIndex: number, neuronIndex: number): void {
    const section = this.layerSections.get(layerIndex);
    if (!section) return;

    const items = section.querySelectorAll('.calculation-item');
    items.forEach((item, idx) => {
      if (idx === neuronIndex) {
        item.classList.add('active');
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        item.classList.remove('active');
      }
    });
  }

  /**
   * Show the panel
   */
  show(): void {
    this.container.style.display = 'block';
  }

  /**
   * Hide the panel
   */
  hide(): void {
    this.container.style.display = 'none';
  }

  /**
   * Clear all accumulated calculations and hide the panel
   * Call this when starting a new demo
   */
  clear(): void {
    this.layerSections.clear();
    if (this.contentEl) {
      this.contentEl.innerHTML = '';
    }
    this.hide();
  }

  /**
   * Reset for new demo - clears accumulated layers
   */
  reset(): void {
    this.layerSections.clear();
    if (this.contentEl) {
      this.contentEl.innerHTML = '';
    }
  }

  /**
   * Update panel with new step data
   */
  updateStep(step: DemoStep): void {
    this.render(step);
  }
}

/**
 * Create and initialize calculation panel
 */
export function createCalculationPanel(containerId: string): CalculationPanel {
  return new CalculationPanel(containerId);
}
