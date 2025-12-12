// T003: Activation Tooltip Types and Functions
// Provides tooltip data for activation function education

import type { Neuron, LayerType } from '../network/types';

/**
 * T031: Educational explanation for biases (duplicated from tooltip.ts to avoid circular import)
 * Describes what biases do in a neural network
 */
const BIAS_EXPLANATION =
  'Bias shifts the activation threshold, allowing the neuron to fire even when inputs are zero.';

/**
 * Data prepared for rendering activation function tooltip
 */
export interface ActivationTooltipData {
  neuronId: string;
  neuronType: LayerType;
  formula: string;
  preActivation: number;
  postActivation: number;
  curvePosition: { x: number; y: number };
  // T031: Include bias for non-input neurons
  bias?: number;
}

/**
 * Map a value from one range to another
 * @param value - The value to map
 * @param inMin - Input range minimum
 * @param inMax - Input range maximum
 * @param outMin - Output range minimum
 * @param outMax - Output range maximum
 * @returns The mapped value, clamped to output range
 */
export function mapToRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  // Clamp input to valid range
  const clampedValue = Math.max(inMin, Math.min(inMax, value));

  // Linear interpolation
  const normalized = (clampedValue - inMin) / (inMax - inMin);
  return outMin + normalized * (outMax - outMin);
}

/**
 * Create tooltip data for a neuron's activation function
 * @param neuron - The neuron to create tooltip data for
 * @param layerType - The type of layer the neuron belongs to
 * @returns Tooltip data for rendering
 */
export function createActivationTooltipData(
  neuron: Neuron,
  layerType: LayerType
): ActivationTooltipData {
  const isInputNeuron = layerType === 'input';

  // Input neurons are pass-through (no activation function)
  const formula = isInputNeuron
    ? 'Pass-through (no activation)'
    : 'σ(x) = 1/(1+e⁻ˣ)';

  // For input neurons, pre and post activation are the same
  const preActivation = isInputNeuron ? neuron.activation : neuron.preActivation;
  const postActivation = neuron.activation;

  // Calculate curve position (normalized 0-1)
  // x maps from pre-activation range [-6, 6] to [0, 1]
  // y is the post-activation value (already 0-1 for sigmoid)
  const curveX = isInputNeuron ? 0.5 : mapToRange(preActivation, -6, 6, 0, 1);
  const curveY = isInputNeuron ? 0.5 : postActivation;

  return {
    neuronId: neuron.id,
    neuronType: layerType,
    formula,
    preActivation,
    postActivation,
    curvePosition: { x: curveX, y: curveY },
    // T031: Include bias for non-input neurons
    bias: isInputNeuron ? undefined : neuron.bias,
  };
}

/**
 * Format a number for display, using scientific notation for extreme values
 * @param value - The number to format
 * @returns Formatted string representation
 */
export function formatActivationValue(value: number): string {
  if (!Number.isFinite(value)) {
    return 'N/A';
  }

  const absValue = Math.abs(value);

  // Use scientific notation for very large or very small numbers
  if (absValue >= 1000 || (absValue < 0.001 && absValue !== 0)) {
    return value.toExponential(2);
  }

  return value.toFixed(3);
}

/**
 * Render HTML for activation tooltip
 * @param data - The tooltip data to render
 * @returns HTML string for the tooltip content
 */
export function renderActivationTooltip(data: ActivationTooltipData): string {
  const isInput = data.neuronType === 'input';

  // Mini sigmoid curve SVG (60x40)
  const curveWidth = 60;
  const curveHeight = 40;
  const markerX = data.curvePosition.x * curveWidth;
  const markerY = (1 - data.curvePosition.y) * curveHeight; // Invert Y for SVG coords

  const sigmoidPath = `M0,${curveHeight - 2} Q${curveWidth * 0.3},${curveHeight - 2} ${curveWidth * 0.5},${curveHeight * 0.5} Q${curveWidth * 0.7},2 ${curveWidth},2`;

  const curveHtml = isInput ? '' : `
    <div class="sigmoid-curve-container">
      <svg width="${curveWidth}" height="${curveHeight}" class="sigmoid-curve">
        <path d="${sigmoidPath}" fill="none" stroke="#6b7280" stroke-width="2"/>
        <circle cx="${markerX}" cy="${markerY}" r="4" fill="#3b82f6"/>
      </svg>
    </div>
  `;

  // T031: Add bias section for non-input neurons
  const biasHtml = !isInput && data.bias !== undefined ? `
    <div class="activation-values" style="margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid rgba(255,255,255,0.1);">
      <div class="activation-value">
        <span class="label">Bias:</span>
        <span class="value">${formatActivationValue(data.bias)}</span>
      </div>
    </div>
    <div class="tooltip-explanation">${BIAS_EXPLANATION}</div>
  ` : '';

  return `
    <div class="activation-tooltip">
      <div class="activation-formula">${data.formula}</div>
      ${!isInput ? `
        <div class="activation-values">
          <div class="activation-value">
            <span class="label">Input (x):</span>
            <span class="value">${formatActivationValue(data.preActivation)}</span>
          </div>
          <div class="activation-value">
            <span class="label">Output (σ):</span>
            <span class="value">${formatActivationValue(data.postActivation)}</span>
          </div>
        </div>
      ` : ''}
      ${curveHtml}
      ${biasHtml}
    </div>
  `;
}
