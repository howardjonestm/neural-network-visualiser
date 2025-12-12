// Training logic: forward propagation, backpropagation, and weight updates

import type { Network, TrainingSample, TrainingStepResult } from './types';
import { XOR_DATA } from './types';
import { sigmoid, sigmoidDerivative } from './neuron';

/**
 * Perform forward propagation through the network
 * Sets activation values for all neurons based on inputs
 */
export function forwardPass(network: Network, inputs: number[]): number[] {
  // Set input layer activations
  const inputLayer = network.layers[0];
  for (let i = 0; i < inputLayer.neurons.length; i++) {
    inputLayer.neurons[i].activation = inputs[i];
    inputLayer.neurons[i].preActivation = inputs[i];
  }

  // Propagate through hidden and output layers
  for (let layerIdx = 1; layerIdx < network.layers.length; layerIdx++) {
    const layer = network.layers[layerIdx];
    const prevLayer = network.layers[layerIdx - 1];

    for (const neuron of layer.neurons) {
      // Sum weighted inputs
      let sum = neuron.bias;

      for (const prevNeuron of prevLayer.neurons) {
        // Find weight connecting prevNeuron to neuron
        const weight = network.weights.find(
          (w) => w.fromNeuronId === prevNeuron.id && w.toNeuronId === neuron.id
        );
        if (weight) {
          sum += prevNeuron.activation * weight.value;
        }
      }

      neuron.preActivation = sum;
      neuron.activation = sigmoid(sum);
    }
  }

  // Return output layer activations
  const outputLayer = network.layers[network.layers.length - 1];
  return outputLayer.neurons.map((n) => n.activation);
}

/**
 * Perform backpropagation to compute gradients
 * Updates delta values on neurons and gradient values on weights
 */
export function backwardPass(network: Network, expected: number[]): void {
  // Compute output layer deltas
  const outputLayer = network.layers[network.layers.length - 1];
  for (let i = 0; i < outputLayer.neurons.length; i++) {
    const neuron = outputLayer.neurons[i];
    const error = neuron.activation - expected[i];
    neuron.delta = error * sigmoidDerivative(neuron.activation);
  }

  // Backpropagate through hidden layers (reverse order)
  for (let layerIdx = network.layers.length - 2; layerIdx > 0; layerIdx--) {
    const layer = network.layers[layerIdx];
    const nextLayer = network.layers[layerIdx + 1];

    for (const neuron of layer.neurons) {
      // Sum of weighted deltas from next layer
      let deltaSum = 0;

      for (const nextNeuron of nextLayer.neurons) {
        const weight = network.weights.find(
          (w) => w.fromNeuronId === neuron.id && w.toNeuronId === nextNeuron.id
        );
        if (weight) {
          deltaSum += weight.value * nextNeuron.delta;
        }
      }

      neuron.delta = deltaSum * sigmoidDerivative(neuron.activation);
    }
  }

  // Compute weight gradients
  for (const weight of network.weights) {
    // Find source and target neurons
    let fromNeuron = null;
    let toNeuron = null;

    for (const layer of network.layers) {
      for (const neuron of layer.neurons) {
        if (neuron.id === weight.fromNeuronId) fromNeuron = neuron;
        if (neuron.id === weight.toNeuronId) toNeuron = neuron;
      }
    }

    if (fromNeuron && toNeuron) {
      // Gradient = activation of source * delta of target
      weight.gradient = fromNeuron.activation * toNeuron.delta;
    }
  }
}

/**
 * Update weights using computed gradients
 */
export function updateWeights(network: Network, learningRate: number): void {
  for (const weight of network.weights) {
    weight.value -= learningRate * weight.gradient;
  }

  // Update biases for non-input neurons
  for (let layerIdx = 1; layerIdx < network.layers.length; layerIdx++) {
    for (const neuron of network.layers[layerIdx].neurons) {
      neuron.bias -= learningRate * neuron.delta;
    }
  }
}

/**
 * Compute mean squared error loss over all training samples
 */
export function computeLoss(network: Network, data: TrainingSample[] = XOR_DATA): number {
  let totalError = 0;

  for (const sample of data) {
    const outputs = forwardPass(network, sample.inputs);
    for (let i = 0; i < outputs.length; i++) {
      const error = outputs[i] - sample.expected[i];
      totalError += error * error;
    }
  }

  return totalError / data.length;
}

/**
 * T006: Result of a training step including per-sample details
 */
export interface TrainStepResult {
  loss: number;
  sampleResults: TrainingStepResult[];
}

/**
 * Perform a single training step over all XOR samples
 * Returns the loss after the step (legacy signature for backward compatibility)
 */
export function trainStep(network: Network, learningRate: number): number {
  const result = trainStepWithDetails(network, learningRate);
  return result.loss;
}

/**
 * T006: Perform a single training step with per-sample result tracking
 * Returns detailed results for each sample processed
 */
export function trainStepWithDetails(
  network: Network,
  learningRate: number,
  onSampleProcessed?: (result: TrainingStepResult) => void
): TrainStepResult {
  const sampleResults: TrainingStepResult[] = [];

  // Train on each sample
  for (let i = 0; i < XOR_DATA.length; i++) {
    const sample = XOR_DATA[i];

    // Forward pass to get output
    const outputs = forwardPass(network, sample.inputs);
    const output = outputs[0]; // Single output for XOR

    // Compute error and loss for this sample
    const error = output - sample.expected[0];
    const loss = error * error;

    const result: TrainingStepResult = {
      sample,
      sampleIndex: i,
      output,
      error,
      loss,
    };

    sampleResults.push(result);

    // Notify callback if provided
    onSampleProcessed?.(result);

    // Backward pass and weight update
    backwardPass(network, sample.expected);
    updateWeights(network, learningRate);
  }

  // Compute total loss (average of sample losses)
  const totalLoss = sampleResults.reduce((sum, r) => sum + r.loss, 0) / sampleResults.length;

  return {
    loss: totalLoss,
    sampleResults,
  };
}

/**
 * Get XOR training data
 */
export function getTrainingData(): TrainingSample[] {
  return XOR_DATA;
}
