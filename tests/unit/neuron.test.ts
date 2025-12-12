// Unit tests for neuron and sigmoid function
import { describe, it, expect } from 'vitest';
import { sigmoid, sigmoidDerivative, createNeuron, activateNeuron } from '../../src/network/neuron';

describe('sigmoid', () => {
  it('returns 0.5 for input 0', () => {
    expect(sigmoid(0)).toBeCloseTo(0.5, 5);
  });

  it('returns approximately 1 for large positive input', () => {
    expect(sigmoid(100)).toBeCloseTo(1, 5);
  });

  it('returns approximately 0 for large negative input', () => {
    expect(sigmoid(-100)).toBeCloseTo(0, 5);
  });

  it('returns values between 0 and 1 for any input', () => {
    const testValues = [-10, -5, -1, 0, 1, 5, 10];
    for (const x of testValues) {
      const result = sigmoid(x);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(1);
    }
  });

  it('is monotonically increasing', () => {
    const values = [-10, -5, -1, 0, 1, 5, 10];
    for (let i = 0; i < values.length - 1; i++) {
      expect(sigmoid(values[i])).toBeLessThan(sigmoid(values[i + 1]));
    }
  });
});

describe('sigmoidDerivative', () => {
  it('returns maximum value at activation 0.5', () => {
    const derivAt05 = sigmoidDerivative(0.5);
    expect(derivAt05).toBeCloseTo(0.25, 5);
  });

  it('returns 0 at activation 0', () => {
    expect(sigmoidDerivative(0)).toBeCloseTo(0, 5);
  });

  it('returns 0 at activation 1', () => {
    expect(sigmoidDerivative(1)).toBeCloseTo(0, 5);
  });

  it('is always non-negative for valid activations', () => {
    const activations = [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1];
    for (const a of activations) {
      expect(sigmoidDerivative(a)).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('createNeuron', () => {
  it('creates a neuron with correct properties', () => {
    const neuron = createNeuron('h0_1', 1, 1, 'hidden');
    expect(neuron.id).toBe('h0_1');
    expect(neuron.layerIndex).toBe(1);
    expect(neuron.positionInLayer).toBe(1);
    expect(neuron.activation).toBe(0);
    expect(neuron.preActivation).toBe(0);
    expect(neuron.delta).toBe(0);
  });

  it('creates input neuron with zero bias', () => {
    const neuron = createNeuron('i0_0', 0, 0, 'input');
    expect(neuron.bias).toBe(0);
  });
});

describe('activateNeuron', () => {
  it('computes activation correctly', () => {
    const neuron = createNeuron('h1_0', 1, 0, 'hidden');
    neuron.bias = 0;
    activateNeuron(neuron, 0); // weightedSum = 0, bias = 0
    expect(neuron.preActivation).toBe(0);
    expect(neuron.activation).toBeCloseTo(0.5, 5);
  });

  it('applies bias correctly', () => {
    const neuron = createNeuron('h1_0', 1, 0, 'hidden');
    neuron.bias = 1;
    activateNeuron(neuron, 0); // weightedSum = 0, bias = 1, preActivation = 1
    expect(neuron.preActivation).toBe(1);
    expect(neuron.activation).toBeCloseTo(sigmoid(1), 5);
  });
});
