// Unit tests for training module

import { describe, it, expect, beforeEach } from 'vitest';
import { createNetwork } from '../../src/network/network';
import {
  forwardPass,
  backwardPass,
  updateWeights,
  computeLoss,
  trainStep,
  getTrainingData,
} from '../../src/network/training';
import type { Network } from '../../src/network/types';

describe('Training Module', () => {
  let network: Network;

  beforeEach(() => {
    network = createNetwork([2, 2, 1]);
  });

  describe('forwardPass', () => {
    it('should set input layer activations from inputs', () => {
      forwardPass(network, [0.5, 0.8]);

      const inputLayer = network.layers[0];
      expect(inputLayer.neurons[0].activation).toBe(0.5);
      expect(inputLayer.neurons[1].activation).toBe(0.8);
    });

    it('should return output layer activations', () => {
      const outputs = forwardPass(network, [1, 0]);

      expect(outputs).toHaveLength(1);
      expect(outputs[0]).toBeGreaterThanOrEqual(0);
      expect(outputs[0]).toBeLessThanOrEqual(1);
    });

    it('should produce values between 0 and 1 for all neurons', () => {
      forwardPass(network, [1, 1]);

      for (const layer of network.layers) {
        for (const neuron of layer.neurons) {
          expect(neuron.activation).toBeGreaterThanOrEqual(0);
          expect(neuron.activation).toBeLessThanOrEqual(1);
        }
      }
    });

    it('should produce different outputs for different inputs', () => {
      const output1 = forwardPass(network, [0, 0])[0];
      const output2 = forwardPass(network, [1, 1])[0];

      // With random initialization, different inputs should give different outputs
      // (statistically almost certain, not guaranteed)
      expect(output1).not.toBe(output2);
    });

    it('should set preActivation values', () => {
      forwardPass(network, [0.5, 0.5]);

      // Hidden and output layers should have preActivation set
      for (let i = 1; i < network.layers.length; i++) {
        for (const neuron of network.layers[i].neurons) {
          expect(typeof neuron.preActivation).toBe('number');
          expect(Number.isNaN(neuron.preActivation)).toBe(false);
        }
      }
    });
  });

  describe('backwardPass', () => {
    it('should compute deltas for output layer', () => {
      forwardPass(network, [1, 0]);
      backwardPass(network, [1]);

      const outputLayer = network.layers[network.layers.length - 1];
      for (const neuron of outputLayer.neurons) {
        expect(typeof neuron.delta).toBe('number');
        expect(Number.isNaN(neuron.delta)).toBe(false);
      }
    });

    it('should compute deltas for hidden layers', () => {
      forwardPass(network, [1, 0]);
      backwardPass(network, [1]);

      // Check hidden layer (index 1)
      const hiddenLayer = network.layers[1];
      for (const neuron of hiddenLayer.neurons) {
        expect(typeof neuron.delta).toBe('number');
        expect(Number.isNaN(neuron.delta)).toBe(false);
      }
    });

    it('should compute gradients for all weights', () => {
      forwardPass(network, [1, 0]);
      backwardPass(network, [1]);

      for (const weight of network.weights) {
        expect(typeof weight.gradient).toBe('number');
        expect(Number.isNaN(weight.gradient)).toBe(false);
      }
    });

    it('should produce larger deltas when error is larger', () => {
      // First pass with target close to output
      forwardPass(network, [0.5, 0.5]);
      const currentOutput = network.layers[network.layers.length - 1].neurons[0].activation;

      // Backup network state
      const network2 = createNetwork([2, 2, 1]);
      // Copy weights
      for (let i = 0; i < network.weights.length; i++) {
        network2.weights[i].value = network.weights[i].value;
      }
      // Copy biases
      for (let l = 0; l < network.layers.length; l++) {
        for (let n = 0; n < network.layers[l].neurons.length; n++) {
          network2.layers[l].neurons[n].bias = network.layers[l].neurons[n].bias;
        }
      }

      forwardPass(network, [0.5, 0.5]);
      backwardPass(network, [currentOutput]); // Small error
      const smallErrorDelta = Math.abs(
        network.layers[network.layers.length - 1].neurons[0].delta
      );

      forwardPass(network2, [0.5, 0.5]);
      backwardPass(network2, [1 - currentOutput]); // Large error
      const largeErrorDelta = Math.abs(
        network2.layers[network2.layers.length - 1].neurons[0].delta
      );

      expect(largeErrorDelta).toBeGreaterThan(smallErrorDelta);
    });
  });

  describe('updateWeights', () => {
    it('should modify weight values', () => {
      const originalWeights = network.weights.map((w) => w.value);

      forwardPass(network, [1, 0]);
      backwardPass(network, [1]);
      updateWeights(network, 0.5);

      let changed = false;
      for (let i = 0; i < network.weights.length; i++) {
        if (network.weights[i].value !== originalWeights[i]) {
          changed = true;
          break;
        }
      }

      expect(changed).toBe(true);
    });

    it('should modify bias values', () => {
      const originalBiases: number[] = [];
      for (let l = 1; l < network.layers.length; l++) {
        for (const neuron of network.layers[l].neurons) {
          originalBiases.push(neuron.bias);
        }
      }

      forwardPass(network, [1, 0]);
      backwardPass(network, [1]);
      updateWeights(network, 0.5);

      const newBiases: number[] = [];
      for (let l = 1; l < network.layers.length; l++) {
        for (const neuron of network.layers[l].neurons) {
          newBiases.push(neuron.bias);
        }
      }

      let changed = false;
      for (let i = 0; i < originalBiases.length; i++) {
        if (newBiases[i] !== originalBiases[i]) {
          changed = true;
          break;
        }
      }

      expect(changed).toBe(true);
    });

    it('should apply learning rate to weight updates', () => {
      forwardPass(network, [1, 0]);
      backwardPass(network, [1]);

      const gradient = network.weights[0].gradient;
      const originalValue = network.weights[0].value;
      const learningRate = 0.1;

      updateWeights(network, learningRate);

      const expectedValue = originalValue - learningRate * gradient;
      expect(network.weights[0].value).toBeCloseTo(expectedValue, 10);
    });
  });

  describe('computeLoss', () => {
    it('should return a non-negative number', () => {
      const loss = computeLoss(network);
      expect(loss).toBeGreaterThanOrEqual(0);
    });

    it('should return loss averaged over samples', () => {
      const loss = computeLoss(network);
      // MSE should be reasonable (between 0 and 1 for XOR with sigmoid)
      expect(loss).toBeLessThan(2);
    });

    it('should decrease after training steps', () => {
      const initialLoss = computeLoss(network);

      // Train for several steps
      for (let i = 0; i < 100; i++) {
        trainStep(network, 0.5);
      }

      const finalLoss = computeLoss(network);
      expect(finalLoss).toBeLessThan(initialLoss);
    });
  });

  describe('trainStep', () => {
    it('should return the loss after training', () => {
      const loss = trainStep(network, 0.5);
      expect(typeof loss).toBe('number');
      expect(loss).toBeGreaterThanOrEqual(0);
    });

    it('should train on all XOR samples', () => {
      const trainingData = getTrainingData();
      expect(trainingData).toHaveLength(4);

      // After training, the network should improve
      const initialLoss = computeLoss(network);
      // Use more iterations to ensure loss decreases reliably
      for (let i = 0; i < 200; i++) {
        trainStep(network, 0.5);
      }
      const finalLoss = computeLoss(network);

      expect(finalLoss).toBeLessThan(initialLoss);
    });
  });

  describe('getTrainingData', () => {
    it('should return XOR truth table', () => {
      const data = getTrainingData();

      expect(data).toHaveLength(4);

      // Check XOR truth table
      const findSample = (i1: number, i2: number) =>
        data.find((s) => s.inputs[0] === i1 && s.inputs[1] === i2);

      expect(findSample(0, 0)?.expected[0]).toBe(0);
      expect(findSample(0, 1)?.expected[0]).toBe(1);
      expect(findSample(1, 0)?.expected[0]).toBe(1);
      expect(findSample(1, 1)?.expected[0]).toBe(0);
    });
  });

  describe('XOR Learning', () => {
    it('should learn XOR function with sufficient training', () => {
      // XOR learning can be sensitive to initial weights, so we retry with fresh network if needed
      const maxAttempts = 3;
      let success = false;

      for (let attempt = 0; attempt < maxAttempts && !success; attempt++) {
        // Create fresh network for each attempt
        const testNetwork = createNetwork([2, 2, 1]);

        // Train for many iterations with higher learning rate
        for (let i = 0; i < 10000; i++) {
          trainStep(testNetwork, 0.5);
        }

        // Test XOR outputs - check if all predictions are correct
        const testCase = (inputs: number[], expected: number): boolean => {
          const output = forwardPass(testNetwork, inputs)[0];
          // Check if output rounds to expected value
          return Math.round(output) === expected;
        };

        success =
          testCase([0, 0], 0) &&
          testCase([0, 1], 1) &&
          testCase([1, 0], 1) &&
          testCase([1, 1], 0);
      }

      expect(success).toBe(true);
    });
  });
});
