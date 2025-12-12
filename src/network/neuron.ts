// Neuron implementation with sigmoid activation

import type { Neuron, LayerType } from './types';

/**
 * Sigmoid activation function
 * Maps any real number to the range (0, 1)
 */
export function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

/**
 * Derivative of sigmoid function
 * Used for backpropagation: sigmoid'(x) = sigmoid(x) * (1 - sigmoid(x))
 */
export function sigmoidDerivative(activation: number): number {
  return activation * (1 - activation);
}

/**
 * Create a new neuron with the given properties
 */
export function createNeuron(
  id: string,
  layerIndex: number,
  positionInLayer: number,
  layerType: LayerType
): Neuron {
  return {
    id,
    layerIndex,
    positionInLayer,
    // Input neurons have no bias
    bias: layerType === 'input' ? 0 : 0,
    activation: 0,
    preActivation: 0,
    delta: 0,
  };
}

/**
 * Initialize neuron bias using Xavier initialization
 * For biases, we typically use a smaller range or zero
 */
export function initializeBias(
  neuron: Neuron,
  layerType: LayerType,
  fanIn: number,
  fanOut: number
): void {
  if (layerType === 'input') {
    neuron.bias = 0;
  } else {
    // Xavier/Glorot initialization for bias
    // Typically biases are initialized to 0 or small values
    const limit = Math.sqrt(6 / (fanIn + fanOut));
    neuron.bias = (Math.random() * 2 - 1) * limit * 0.1; // Small bias values
  }
}

/**
 * Compute neuron activation given weighted input sum
 */
export function activateNeuron(neuron: Neuron, weightedSum: number): void {
  neuron.preActivation = weightedSum + neuron.bias;
  neuron.activation = sigmoid(neuron.preActivation);
}

/**
 * Set input neuron activation (no computation, just assignment)
 */
export function setInputActivation(neuron: Neuron, value: number): void {
  neuron.activation = value;
  neuron.preActivation = value;
}

/**
 * Reset neuron state (activations and deltas, keep bias)
 */
export function resetNeuronState(neuron: Neuron): void {
  neuron.activation = 0;
  neuron.preActivation = 0;
  neuron.delta = 0;
}
