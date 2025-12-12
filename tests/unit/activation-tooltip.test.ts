// T020-T021: Unit tests for activation tooltip functions
import { describe, it, expect } from 'vitest';
import {
  createActivationTooltipData,
  mapToRange,
  formatActivationValue,
} from '../../src/education/activation-tooltip';
import type { Neuron } from '../../src/network/types';

// Helper to create a mock neuron
function createMockNeuron(overrides: Partial<Neuron> = {}): Neuron {
  return {
    id: 'h1_0',
    layerIndex: 1,
    positionInLayer: 0,
    bias: 0.5,
    activation: 0.731,
    preActivation: 1.0,
    delta: 0,
    ...overrides,
  };
}

describe('mapToRange', () => {
  // T021: Unit tests for curve position mapping

  it('maps zero to middle of output range', () => {
    const result = mapToRange(0, -6, 6, 0, 1);
    expect(result).toBe(0.5);
  });

  it('maps minimum input to minimum output', () => {
    const result = mapToRange(-6, -6, 6, 0, 1);
    expect(result).toBe(0);
  });

  it('maps maximum input to maximum output', () => {
    const result = mapToRange(6, -6, 6, 0, 1);
    expect(result).toBe(1);
  });

  it('clamps values below minimum', () => {
    const result = mapToRange(-10, -6, 6, 0, 1);
    expect(result).toBe(0);
  });

  it('clamps values above maximum', () => {
    const result = mapToRange(10, -6, 6, 0, 1);
    expect(result).toBe(1);
  });

  it('handles positive pre-activation values', () => {
    const result = mapToRange(3, -6, 6, 0, 1);
    expect(result).toBe(0.75);
  });

  it('handles negative pre-activation values', () => {
    const result = mapToRange(-3, -6, 6, 0, 1);
    expect(result).toBe(0.25);
  });

  it('handles different output ranges', () => {
    const result = mapToRange(0, -6, 6, 0, 60);
    expect(result).toBe(30);
  });
});

describe('createActivationTooltipData', () => {
  // T020: Unit tests for createActivationTooltipData()

  describe('for hidden neurons', () => {
    it('returns correct neuron type', () => {
      const neuron = createMockNeuron();
      const data = createActivationTooltipData(neuron, 'hidden');
      expect(data.neuronType).toBe('hidden');
    });

    it('returns sigmoid formula', () => {
      const neuron = createMockNeuron();
      const data = createActivationTooltipData(neuron, 'hidden');
      expect(data.formula).toBe('σ(x) = 1/(1+e⁻ˣ)');
    });

    it('returns correct pre-activation value', () => {
      const neuron = createMockNeuron({ preActivation: 2.5 });
      const data = createActivationTooltipData(neuron, 'hidden');
      expect(data.preActivation).toBe(2.5);
    });

    it('returns correct post-activation value', () => {
      const neuron = createMockNeuron({ activation: 0.9 });
      const data = createActivationTooltipData(neuron, 'hidden');
      expect(data.postActivation).toBe(0.9);
    });

    it('calculates correct curve position for zero pre-activation', () => {
      const neuron = createMockNeuron({ preActivation: 0, activation: 0.5 });
      const data = createActivationTooltipData(neuron, 'hidden');
      expect(data.curvePosition.x).toBe(0.5);
      expect(data.curvePosition.y).toBe(0.5);
    });

    it('calculates correct curve position for positive pre-activation', () => {
      const neuron = createMockNeuron({ preActivation: 3, activation: 0.95 });
      const data = createActivationTooltipData(neuron, 'hidden');
      expect(data.curvePosition.x).toBe(0.75);
      expect(data.curvePosition.y).toBe(0.95);
    });

    it('clamps extreme pre-activation values', () => {
      const neuron = createMockNeuron({ preActivation: 100, activation: 1.0 });
      const data = createActivationTooltipData(neuron, 'hidden');
      expect(data.curvePosition.x).toBe(1);
    });
  });

  describe('for output neurons', () => {
    it('returns correct neuron type', () => {
      const neuron = createMockNeuron({ id: 'o4_0', layerIndex: 4 });
      const data = createActivationTooltipData(neuron, 'output');
      expect(data.neuronType).toBe('output');
    });

    it('returns sigmoid formula', () => {
      const neuron = createMockNeuron();
      const data = createActivationTooltipData(neuron, 'output');
      expect(data.formula).toBe('σ(x) = 1/(1+e⁻ˣ)');
    });
  });

  describe('for input neurons', () => {
    it('returns correct neuron type', () => {
      const neuron = createMockNeuron({ id: 'i0_0', layerIndex: 0 });
      const data = createActivationTooltipData(neuron, 'input');
      expect(data.neuronType).toBe('input');
    });

    it('returns pass-through formula', () => {
      const neuron = createMockNeuron({ id: 'i0_0', layerIndex: 0 });
      const data = createActivationTooltipData(neuron, 'input');
      expect(data.formula).toBe('Pass-through (no activation)');
    });

    it('uses activation as both pre and post activation', () => {
      const neuron = createMockNeuron({
        id: 'i0_0',
        layerIndex: 0,
        activation: 1.0,
        preActivation: 0, // Should be ignored
      });
      const data = createActivationTooltipData(neuron, 'input');
      expect(data.preActivation).toBe(1.0);
      expect(data.postActivation).toBe(1.0);
    });

    it('sets curve position to center', () => {
      const neuron = createMockNeuron({ id: 'i0_0', layerIndex: 0 });
      const data = createActivationTooltipData(neuron, 'input');
      expect(data.curvePosition.x).toBe(0.5);
      expect(data.curvePosition.y).toBe(0.5);
    });
  });
});

describe('formatActivationValue', () => {
  it('formats normal values with 3 decimal places', () => {
    expect(formatActivationValue(0.731)).toBe('0.731');
    expect(formatActivationValue(0.5)).toBe('0.500');
  });

  it('uses scientific notation for very large values', () => {
    const result = formatActivationValue(1234.567);
    expect(result).toMatch(/^\d\.\d{2}e\+\d$/);
  });

  it('uses scientific notation for very small values', () => {
    const result = formatActivationValue(0.0001);
    expect(result).toMatch(/^\d\.\d{2}e-\d$/);
  });

  it('handles zero', () => {
    expect(formatActivationValue(0)).toBe('0.000');
  });

  it('handles negative values', () => {
    expect(formatActivationValue(-0.5)).toBe('-0.500');
  });

  it('returns N/A for non-finite values', () => {
    expect(formatActivationValue(NaN)).toBe('N/A');
    expect(formatActivationValue(Infinity)).toBe('N/A');
    expect(formatActivationValue(-Infinity)).toBe('N/A');
  });
});
