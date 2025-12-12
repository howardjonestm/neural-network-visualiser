// Layer implementation containing neurons

import type { Layer, LayerType, Neuron } from './types';
import { createNeuron, initializeBias } from './neuron';

/**
 * Determine layer type based on position
 */
export function getLayerType(index: number, totalLayers: number): LayerType {
  if (index === 0) return 'input';
  if (index === totalLayers - 1) return 'output';
  return 'hidden';
}

/**
 * Create a new layer with neurons
 */
export function createLayer(
  index: number,
  size: number,
  totalLayers: number
): Layer {
  const type = getLayerType(index, totalLayers);
  const neurons: Neuron[] = [];

  // Create neurons with appropriate IDs
  const prefix = type === 'input' ? 'i' : type === 'hidden' ? 'h' : 'o';

  for (let i = 0; i < size; i++) {
    const id = `${prefix}${index}_${i}`;
    neurons.push(createNeuron(id, index, i, type));
  }

  return {
    index,
    type,
    neurons,
    size,
  };
}

/**
 * Initialize all neuron biases in the layer
 */
export function initializeLayerBiases(
  layer: Layer,
  fanIn: number,
  fanOut: number
): void {
  for (const neuron of layer.neurons) {
    initializeBias(neuron, layer.type, fanIn, fanOut);
  }
}

/**
 * Get a neuron from the layer by position
 */
export function getNeuronAt(layer: Layer, position: number): Neuron | undefined {
  return layer.neurons[position];
}

/**
 * Reset all neurons in the layer
 */
export function resetLayer(layer: Layer): void {
  for (const neuron of layer.neurons) {
    neuron.activation = 0;
    neuron.preActivation = 0;
    neuron.delta = 0;
  }
}
