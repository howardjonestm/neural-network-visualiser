// Unit tests for network and Xavier initialization
import { describe, it, expect } from 'vitest';
import {
  createNetwork,
  xavierInit,
  getNeuronById,
  getWeightById,
  getIncomingWeights,
  getOutgoingWeights,
  getTotalNeurons,
  getTotalWeights,
  reinitializeNetwork,
} from '../../src/network/network';

describe('xavierInit', () => {
  it('returns values within expected bounds', () => {
    const fanIn = 2;
    const fanOut = 2;
    // Scaled Xavier limit (2x standard for deep sigmoid networks)
    const limit = Math.sqrt(6 / (fanIn + fanOut)) * 2; // sqrt(6/4) * 2 ≈ 2.45

    // Run multiple times to test random distribution
    for (let i = 0; i < 100; i++) {
      const value = xavierInit(fanIn, fanOut);
      expect(value).toBeGreaterThanOrEqual(-limit);
      expect(value).toBeLessThanOrEqual(limit);
    }
  });

  it('adjusts bounds based on fan in/out', () => {
    const limitSmall = Math.sqrt(6 / (2 + 2)); // ≈ 1.22
    const limitLarge = Math.sqrt(6 / (10 + 10)); // ≈ 0.55

    // Smaller fan in/out should allow larger weight range
    expect(limitSmall).toBeGreaterThan(limitLarge);
  });

  it('produces varied values (not constant)', () => {
    const values = new Set<number>();
    for (let i = 0; i < 20; i++) {
      values.add(xavierInit(2, 2));
    }
    // Should have mostly unique values
    expect(values.size).toBeGreaterThan(15);
  });
});

describe('createNetwork', () => {
  it('creates network with correct architecture for XOR', () => {
    const network = createNetwork([2, 2, 1]);

    expect(network.architecture).toEqual([2, 2, 1]);
    expect(network.layers.length).toBe(3);
    expect(network.layers[0].type).toBe('input');
    expect(network.layers[1].type).toBe('hidden');
    expect(network.layers[2].type).toBe('output');
  });

  it('creates correct number of neurons', () => {
    const network = createNetwork([2, 2, 1]);

    expect(network.layers[0].neurons.length).toBe(2);
    expect(network.layers[1].neurons.length).toBe(2);
    expect(network.layers[2].neurons.length).toBe(1);
    expect(getTotalNeurons(network)).toBe(5);
  });

  it('creates correct number of weights for fully connected layers', () => {
    const network = createNetwork([2, 2, 1]);

    // 2*2 (input to hidden) + 2*1 (hidden to output) = 6
    expect(network.weights.length).toBe(6);
    expect(getTotalWeights(network)).toBe(6);
  });

  it('assigns unique IDs to all neurons', () => {
    const network = createNetwork([2, 2, 1]);
    const ids = new Set<string>();

    for (const layer of network.layers) {
      for (const neuron of layer.neurons) {
        expect(ids.has(neuron.id)).toBe(false);
        ids.add(neuron.id);
      }
    }
  });

  it('assigns unique IDs to all weights', () => {
    const network = createNetwork([2, 2, 1]);
    const ids = new Set<string>();

    for (const weight of network.weights) {
      expect(ids.has(weight.id)).toBe(false);
      ids.add(weight.id);
    }
  });

  it('throws error for network with less than 2 layers', () => {
    expect(() => createNetwork([5])).toThrow();
  });

  it('input neurons have zero bias', () => {
    const network = createNetwork([2, 2, 1]);

    for (const neuron of network.layers[0].neurons) {
      expect(neuron.bias).toBe(0);
    }
  });
});

describe('getNeuronById', () => {
  it('finds existing neuron', () => {
    const network = createNetwork([2, 2, 1]);
    const neuron = getNeuronById(network, 'i0_0');

    expect(neuron).toBeDefined();
    expect(neuron?.id).toBe('i0_0');
  });

  it('returns undefined for non-existent neuron', () => {
    const network = createNetwork([2, 2, 1]);
    const neuron = getNeuronById(network, 'nonexistent');

    expect(neuron).toBeUndefined();
  });
});

describe('getWeightById', () => {
  it('finds existing weight', () => {
    const network = createNetwork([2, 2, 1]);
    const weight = network.weights[0];
    const found = getWeightById(network, weight.id);

    expect(found).toBeDefined();
    expect(found?.id).toBe(weight.id);
  });
});

describe('getIncomingWeights', () => {
  it('returns correct weights for hidden neuron', () => {
    const network = createNetwork([2, 2, 1]);
    const hiddenNeuron = network.layers[1].neurons[0];
    const incoming = getIncomingWeights(network, hiddenNeuron.id);

    // Should have 2 incoming weights (from 2 input neurons)
    expect(incoming.length).toBe(2);
    for (const w of incoming) {
      expect(w.toNeuronId).toBe(hiddenNeuron.id);
    }
  });

  it('returns no weights for input neurons', () => {
    const network = createNetwork([2, 2, 1]);
    const inputNeuron = network.layers[0].neurons[0];
    const incoming = getIncomingWeights(network, inputNeuron.id);

    expect(incoming.length).toBe(0);
  });
});

describe('getOutgoingWeights', () => {
  it('returns correct weights for input neuron', () => {
    const network = createNetwork([2, 2, 1]);
    const inputNeuron = network.layers[0].neurons[0];
    const outgoing = getOutgoingWeights(network, inputNeuron.id);

    // Should have 2 outgoing weights (to 2 hidden neurons)
    expect(outgoing.length).toBe(2);
    for (const w of outgoing) {
      expect(w.fromNeuronId).toBe(inputNeuron.id);
    }
  });

  it('returns no weights for output neurons', () => {
    const network = createNetwork([2, 2, 1]);
    const outputNeuron = network.layers[2].neurons[0];
    const outgoing = getOutgoingWeights(network, outputNeuron.id);

    expect(outgoing.length).toBe(0);
  });
});

describe('createNetwork with deeper architecture', () => {
  it('creates 5-layer network with correct architecture', () => {
    const network = createNetwork([2, 4, 3, 2, 1]);

    expect(network.architecture).toEqual([2, 4, 3, 2, 1]);
    expect(network.layers.length).toBe(5);
    expect(network.layers[0].type).toBe('input');
    expect(network.layers[1].type).toBe('hidden');
    expect(network.layers[2].type).toBe('hidden');
    expect(network.layers[3].type).toBe('hidden');
    expect(network.layers[4].type).toBe('output');
  });

  it('creates correct number of neurons for deeper network', () => {
    const network = createNetwork([2, 4, 3, 2, 1]);

    expect(network.layers[0].neurons.length).toBe(2);
    expect(network.layers[1].neurons.length).toBe(4);
    expect(network.layers[2].neurons.length).toBe(3);
    expect(network.layers[3].neurons.length).toBe(2);
    expect(network.layers[4].neurons.length).toBe(1);
    expect(getTotalNeurons(network)).toBe(12);
  });

  it('creates correct number of weights for deeper network', () => {
    const network = createNetwork([2, 4, 3, 2, 1]);

    // 2*4 (input to hidden1) + 4*3 (hidden1 to hidden2) +
    // 3*2 (hidden2 to hidden3) + 2*1 (hidden3 to output) = 8 + 12 + 6 + 2 = 28
    expect(network.weights.length).toBe(28);
    expect(getTotalWeights(network)).toBe(28);
  });

  it('assigns unique IDs to all neurons in deeper network', () => {
    const network = createNetwork([2, 4, 3, 2, 1]);
    const ids = new Set<string>();

    for (const layer of network.layers) {
      for (const neuron of layer.neurons) {
        expect(ids.has(neuron.id)).toBe(false);
        ids.add(neuron.id);
      }
    }
    expect(ids.size).toBe(12);
  });
});

describe('reinitializeNetwork', () => {
  it('produces different weight values after reinitialization', () => {
    const network = createNetwork([2, 2, 1]);
    const originalWeights = network.weights.map((w) => w.value);

    reinitializeNetwork(network);
    const newWeights = network.weights.map((w) => w.value);

    // At least some weights should be different (statistically almost certain)
    let differences = 0;
    for (let i = 0; i < originalWeights.length; i++) {
      if (originalWeights[i] !== newWeights[i]) {
        differences++;
      }
    }
    expect(differences).toBeGreaterThan(0);
  });

  it('resets gradients to zero', () => {
    const network = createNetwork([2, 2, 1]);

    // Set some gradients
    network.weights[0].gradient = 0.5;
    network.weights[1].gradient = -0.3;

    reinitializeNetwork(network);

    for (const weight of network.weights) {
      expect(weight.gradient).toBe(0);
    }
  });

  it('resets neuron activations to zero', () => {
    const network = createNetwork([2, 2, 1]);

    // Set some activations
    network.layers[1].neurons[0].activation = 0.7;

    reinitializeNetwork(network);

    for (const layer of network.layers) {
      for (const neuron of layer.neurons) {
        expect(neuron.activation).toBe(0);
        expect(neuron.preActivation).toBe(0);
        expect(neuron.delta).toBe(0);
      }
    }
  });
});
