// Network implementation orchestrating layers and weights

import type { Network, Layer, Weight, Neuron } from './types';
import { createLayer, initializeLayerBiases } from './layer';

/**
 * Weight initialization for sigmoid networks
 * Uses a scaled Xavier initialization to avoid the "all outputs = 0.5" problem
 * with deep networks. The scaling factor helps the network start with more
 * diverse outputs, making it easier to escape local minima.
 */
export function xavierInit(fanIn: number, fanOut: number): number {
  // Standard Xavier limit
  const limit = Math.sqrt(6 / (fanIn + fanOut));
  // Scale up by 2x to help deep sigmoid networks avoid the 0.5 local minimum
  // This gives more variance in initial outputs
  return (Math.random() * 2 - 1) * limit * 2;
}

/**
 * Create a weight connecting two neurons
 */
function createWeight(fromNeuron: Neuron, toNeuron: Neuron, fanIn: number, fanOut: number): Weight {
  return {
    id: `w_${fromNeuron.id}_${toNeuron.id}`,
    fromNeuronId: fromNeuron.id,
    toNeuronId: toNeuron.id,
    value: xavierInit(fanIn, fanOut),
    gradient: 0,
  };
}

/**
 * Create weights between two adjacent layers (fully connected)
 */
function createWeightsBetweenLayers(
  fromLayer: Layer,
  toLayer: Layer
): Weight[] {
  const weights: Weight[] = [];
  const fanIn = fromLayer.size;
  const fanOut = toLayer.size;

  for (const fromNeuron of fromLayer.neurons) {
    for (const toNeuron of toLayer.neurons) {
      weights.push(createWeight(fromNeuron, toNeuron, fanIn, fanOut));
    }
  }

  return weights;
}

/**
 * Create a neural network with the given architecture
 * @param architecture Array of layer sizes, e.g., [2, 2, 1] for XOR
 */
export function createNetwork(architecture: number[]): Network {
  if (architecture.length < 2) {
    throw new Error('Network must have at least 2 layers (input and output)');
  }

  const layers: Layer[] = [];
  const weights: Weight[] = [];

  // Create layers
  for (let i = 0; i < architecture.length; i++) {
    const layer = createLayer(i, architecture[i], architecture.length);

    // Initialize biases (input layer biases stay 0)
    if (i > 0) {
      const fanIn = architecture[i - 1];
      const fanOut = architecture[i];
      initializeLayerBiases(layer, fanIn, fanOut);
    }

    layers.push(layer);
  }

  // Create weights between adjacent layers
  for (let i = 0; i < layers.length - 1; i++) {
    const layerWeights = createWeightsBetweenLayers(layers[i], layers[i + 1]);
    weights.push(...layerWeights);
  }

  return {
    layers,
    weights,
    architecture: [...architecture],
  };
}

/**
 * Get all weights coming into a specific neuron
 */
export function getIncomingWeights(network: Network, neuronId: string): Weight[] {
  return network.weights.filter((w) => w.toNeuronId === neuronId);
}

/**
 * Get all weights going out from a specific neuron
 */
export function getOutgoingWeights(network: Network, neuronId: string): Weight[] {
  return network.weights.filter((w) => w.fromNeuronId === neuronId);
}

/**
 * Find a neuron by ID
 */
export function getNeuronById(network: Network, id: string): Neuron | undefined {
  for (const layer of network.layers) {
    const neuron = layer.neurons.find((n) => n.id === id);
    if (neuron) return neuron;
  }
  return undefined;
}

/**
 * Find a weight by ID
 */
export function getWeightById(network: Network, id: string): Weight | undefined {
  return network.weights.find((w) => w.id === id);
}

/**
 * Re-initialize all weights and biases with new random values
 */
export function reinitializeNetwork(network: Network): void {
  // Re-initialize weights
  for (const weight of network.weights) {
    const fromNeuron = getNeuronById(network, weight.fromNeuronId);
    const toNeuron = getNeuronById(network, weight.toNeuronId);
    if (fromNeuron && toNeuron) {
      const fanIn = network.architecture[fromNeuron.layerIndex];
      const fanOut = network.architecture[toNeuron.layerIndex];
      weight.value = xavierInit(fanIn, fanOut);
      weight.gradient = 0;
    }
  }

  // Re-initialize biases and reset activations
  for (let i = 0; i < network.layers.length; i++) {
    const layer = network.layers[i];
    for (const neuron of layer.neurons) {
      neuron.activation = 0;
      neuron.preActivation = 0;
      neuron.delta = 0;

      if (i > 0) {
        const fanIn = network.architecture[i - 1];
        const fanOut = network.architecture[i];
        const limit = Math.sqrt(6 / (fanIn + fanOut));
        // Scale biases similarly to weights (2x) but keep them smaller (0.1 factor)
        neuron.bias = (Math.random() * 2 - 1) * limit * 2 * 0.1;
      }
    }
  }
}

/**
 * Get total neuron count
 */
export function getTotalNeurons(network: Network): number {
  return network.layers.reduce((sum, layer) => sum + layer.neurons.length, 0);
}

/**
 * Get total weight count
 */
export function getTotalWeights(network: Network): number {
  return network.weights.length;
}
