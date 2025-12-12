// Tooltip component for displaying values on hover

import type { Neuron, Weight, LayerType } from '../network/types';
import type { WeightDelta } from './weight-delta';
import {
  createActivationTooltipData,
  renderActivationTooltip,
} from '../education/activation-tooltip';

export interface TooltipPosition {
  x: number;
  y: number;
}

/**
 * T028: Educational explanation for weights
 * Describes what weights do in a neural network
 */
export const WEIGHT_EXPLANATION =
  'Weights determine how much influence one neuron has on another. ' +
  'Larger absolute values mean stronger connections. ' +
  'Positive weights excite; negative weights inhibit.';

/**
 * T029: Educational explanation for biases
 * Describes what biases do in a neural network
 */
export const BIAS_EXPLANATION =
  'Bias shifts the activation threshold. ' +
  'It allows the neuron to fire even when inputs are zero, ' +
  'giving the network more flexibility to learn patterns.';

/**
 * Format number for display (3 decimal places, avoid scientific notation)
 */
export function formatNumber(value: number): string {
  // Handle very small numbers that might be in scientific notation
  if (Math.abs(value) < 0.001 && value !== 0) {
    return value.toFixed(6);
  }
  return value.toFixed(3);
}

/**
 * T017: Format delta value with +/- prefix and color coding
 */
export function formatDelta(delta: number): string {
  const prefix = delta >= 0 ? '+' : '';
  const colorClass = delta > 0 ? 'delta-positive' : delta < 0 ? 'delta-negative' : '';
  const formattedValue = formatNumber(delta);
  return `<span class="${colorClass}">${prefix}${formattedValue}</span>`;
}

/**
 * Tooltip manager class
 */
export class Tooltip {
  private element: HTMLElement;
  private visible: boolean = false;

  constructor(elementId: string = 'tooltip') {
    const el = document.getElementById(elementId);
    if (!el) {
      throw new Error(`Tooltip element #${elementId} not found`);
    }
    this.element = el;
  }

  /**
   * Show tooltip with neuron information
   */
  showNeuron(neuron: Neuron, layerType: string, position: TooltipPosition): void {
    const content = [
      `<strong>${layerType} Neuron</strong>`,
      `ID: ${neuron.id}`,
      `Activation: ${formatNumber(neuron.activation)}`,
    ];

    // Input neurons don't have meaningful bias
    if (layerType !== 'Input') {
      content.push(`Bias: ${formatNumber(neuron.bias)}`);
    }

    this.element.innerHTML = content.join('<br>');
    this.show(position);
  }

  /**
   * T025: Show tooltip with activation function information
   * Uses the activation tooltip renderer for hidden/output neurons
   */
  showActivation(neuron: Neuron, layerType: LayerType, position: TooltipPosition): void {
    const data = createActivationTooltipData(neuron, layerType);
    const html = renderActivationTooltip(data);
    this.element.innerHTML = html;
    this.show(position);
  }

  /**
   * T016, T030, T032-T033: Show tooltip with weight information, optional delta, magnitude, and explanation
   */
  showWeight(weight: Weight, position: TooltipPosition, delta?: WeightDelta): void {
    const content = [
      `<strong>Weight</strong>`,
      `Value: ${formatNumber(weight.value)}`,
    ];

    // T016, T032-T033: Show delta and magnitude if available
    if (delta && delta.magnitude !== 'none') {
      content.push(`Change: ${formatDelta(delta.delta)}`);
      content.push(`Magnitude: <strong>${delta.magnitude}</strong>`);
      content.push(`Direction: ${delta.direction}`);
    }

    content.push(`From: ${weight.fromNeuronId}`);
    content.push(`To: ${weight.toNeuronId}`);

    // T030: Add educational explanation
    content.push(`<div class="tooltip-explanation">${WEIGHT_EXPLANATION}</div>`);

    this.element.innerHTML = content.join('<br>');
    this.show(position);
  }

  /**
   * Hide the tooltip
   */
  hide(): void {
    this.visible = false;
    this.element.classList.remove('visible');
    this.element.setAttribute('aria-hidden', 'true');
  }

  /**
   * Position and show the tooltip
   */
  private show(position: TooltipPosition): void {
    this.visible = true;

    // Position tooltip near cursor but offset to not cover element
    const offsetX = 10;
    const offsetY = 10;

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Get tooltip dimensions
    this.element.style.visibility = 'hidden';
    this.element.classList.add('visible');
    const tooltipRect = this.element.getBoundingClientRect();

    // Calculate position, flipping if necessary
    let x = position.x + offsetX;
    let y = position.y + offsetY;

    // Flip horizontally if tooltip would go off right edge
    if (x + tooltipRect.width > viewportWidth - 10) {
      x = position.x - tooltipRect.width - offsetX;
    }

    // Flip vertically if tooltip would go off bottom edge
    if (y + tooltipRect.height > viewportHeight - 10) {
      y = position.y - tooltipRect.height - offsetY;
    }

    // Ensure tooltip doesn't go off left or top edge
    x = Math.max(10, x);
    y = Math.max(10, y);

    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
    this.element.style.visibility = 'visible';
    this.element.setAttribute('aria-hidden', 'false');
  }

  /**
   * Check if tooltip is currently visible
   */
  isVisible(): boolean {
    return this.visible;
  }
}
