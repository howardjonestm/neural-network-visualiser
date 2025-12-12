// Unit tests for Demo module
// T012: State machine tests
// T013: Calculator accuracy tests

import { describe, it, expect, beforeEach } from 'vitest';
import { DemoStateMachine } from '../../src/demo/state';
import { generateDemoSteps, formatCalculation, getPrediction } from '../../src/demo/calculator';
import { createNetwork } from '../../src/network/network';
import type { NeuronCalculation } from '../../src/demo/types';

// T012: State Machine Tests
describe('DemoStateMachine', () => {
  let stateMachine: DemoStateMachine;

  beforeEach(() => {
    stateMachine = new DemoStateMachine();
  });

  it('starts in idle mode', () => {
    const state = stateMachine.getState();
    expect(state.mode).toBe('idle');
    expect(state.currentStepIndex).toBe(0);
  });

  it('transitions from idle to running on startDemo', () => {
    const mockSteps = [
      { layerIndex: 0, layerType: 'input' as const, layerLabel: 'Input', neurons: [], isComplete: false },
      { layerIndex: 1, layerType: 'hidden' as const, layerLabel: 'Hidden 1', neurons: [], isComplete: false },
    ];

    const success = stateMachine.startDemo(mockSteps);

    expect(success).toBe(true);
    expect(stateMachine.getState().mode).toBe('running');
    expect(stateMachine.getState().totalSteps).toBe(2);
  });

  it('prevents starting demo when already running', () => {
    const mockSteps = [
      { layerIndex: 0, layerType: 'input' as const, layerLabel: 'Input', neurons: [], isComplete: false },
    ];

    stateMachine.startDemo(mockSteps);
    const secondStart = stateMachine.startDemo(mockSteps);

    expect(secondStart).toBe(false);
  });

  it('transitions from running to paused on pause', () => {
    const mockSteps = [
      { layerIndex: 0, layerType: 'input' as const, layerLabel: 'Input', neurons: [], isComplete: false },
    ];

    stateMachine.startDemo(mockSteps);
    const paused = stateMachine.pause();

    expect(paused).toBe(true);
    expect(stateMachine.getState().mode).toBe('paused');
  });

  it('transitions from paused to running on resume', () => {
    const mockSteps = [
      { layerIndex: 0, layerType: 'input' as const, layerLabel: 'Input', neurons: [], isComplete: false },
    ];

    stateMachine.startDemo(mockSteps);
    stateMachine.pause();
    const resumed = stateMachine.resume();

    expect(resumed).toBe(true);
    expect(stateMachine.getState().mode).toBe('running');
  });

  it('transitions to idle on cancel from any state', () => {
    const mockSteps = [
      { layerIndex: 0, layerType: 'input' as const, layerLabel: 'Input', neurons: [], isComplete: false },
    ];

    stateMachine.startDemo(mockSteps);
    stateMachine.cancel();

    expect(stateMachine.getState().mode).toBe('idle');
  });

  it('advances step index during running mode', () => {
    const mockSteps = [
      { layerIndex: 0, layerType: 'input' as const, layerLabel: 'Input', neurons: [], isComplete: false },
      { layerIndex: 1, layerType: 'hidden' as const, layerLabel: 'Hidden 1', neurons: [], isComplete: false },
      { layerIndex: 2, layerType: 'output' as const, layerLabel: 'Output', neurons: [], isComplete: false },
    ];

    stateMachine.startDemo(mockSteps);
    expect(stateMachine.getState().currentStepIndex).toBe(0);

    stateMachine.advanceStep();
    expect(stateMachine.getState().currentStepIndex).toBe(1);

    stateMachine.advanceStep();
    expect(stateMachine.getState().currentStepIndex).toBe(2);
  });

  it('completes demo when advancing past final step', () => {
    const mockSteps = [
      { layerIndex: 0, layerType: 'input' as const, layerLabel: 'Input', neurons: [], isComplete: false },
      { layerIndex: 1, layerType: 'output' as const, layerLabel: 'Output', neurons: [], isComplete: false },
    ];

    stateMachine.startDemo(mockSteps);
    stateMachine.advanceStep(); // step 0 -> 1
    stateMachine.advanceStep(); // step 1 -> complete

    expect(stateMachine.getState().mode).toBe('idle');
  });

  it('notifies listeners on state change', () => {
    const mockSteps = [
      { layerIndex: 0, layerType: 'input' as const, layerLabel: 'Input', neurons: [], isComplete: false },
    ];

    let notifiedState = null;
    stateMachine.subscribe((state) => {
      notifiedState = state;
    });

    stateMachine.startDemo(mockSteps);

    expect(notifiedState).not.toBeNull();
    expect((notifiedState as any).mode).toBe('running');
  });

  it('allows unsubscribing from notifications', () => {
    const mockSteps = [
      { layerIndex: 0, layerType: 'input' as const, layerLabel: 'Input', neurons: [], isComplete: false },
    ];

    let callCount = 0;
    const unsubscribe = stateMachine.subscribe(() => {
      callCount++;
    });

    stateMachine.startDemo(mockSteps);
    expect(callCount).toBe(1);

    unsubscribe();
    stateMachine.cancel();
    expect(callCount).toBe(1); // Should not have been called again
  });

  it('transitions to step-through mode correctly', () => {
    const mockSteps = [
      { layerIndex: 0, layerType: 'input' as const, layerLabel: 'Input', neurons: [], isComplete: false },
      { layerIndex: 1, layerType: 'hidden' as const, layerLabel: 'Hidden 1', neurons: [], isComplete: false },
    ];

    stateMachine.startStepThrough(mockSteps);

    expect(stateMachine.getState().mode).toBe('step-through');
    expect(stateMachine.getState().currentStepIndex).toBe(0);
  });

  it('handles next/prev step in step-through mode', () => {
    const mockSteps = [
      { layerIndex: 0, layerType: 'input' as const, layerLabel: 'Input', neurons: [], isComplete: false },
      { layerIndex: 1, layerType: 'hidden' as const, layerLabel: 'Hidden 1', neurons: [], isComplete: false },
      { layerIndex: 2, layerType: 'output' as const, layerLabel: 'Output', neurons: [], isComplete: false },
    ];

    stateMachine.startStepThrough(mockSteps);

    stateMachine.nextStep();
    expect(stateMachine.getState().currentStepIndex).toBe(1);

    stateMachine.nextStep();
    expect(stateMachine.getState().currentStepIndex).toBe(2);

    stateMachine.prevStep();
    expect(stateMachine.getState().currentStepIndex).toBe(1);
  });

  it('prevents prevStep at first step', () => {
    const mockSteps = [
      { layerIndex: 0, layerType: 'input' as const, layerLabel: 'Input', neurons: [], isComplete: false },
      { layerIndex: 1, layerType: 'output' as const, layerLabel: 'Output', neurons: [], isComplete: false },
    ];

    stateMachine.startStepThrough(mockSteps);
    const result = stateMachine.prevStep();

    expect(result).toBe(false);
    expect(stateMachine.getState().currentStepIndex).toBe(0);
  });

  it('preserves selected input across state changes', () => {
    stateMachine.setInput([1, 0]);

    const mockSteps = [
      { layerIndex: 0, layerType: 'input' as const, layerLabel: 'Input', neurons: [], isComplete: false },
    ];

    stateMachine.startDemo(mockSteps);
    stateMachine.cancel();

    expect(stateMachine.getState().selectedInput).toEqual([1, 0]);
  });
});

// T013: Calculator Accuracy Tests
describe('generateDemoSteps', () => {
  it('creates correct number of steps for 5-layer network', () => {
    const network = createNetwork([2, 4, 3, 2, 1]);
    const steps = generateDemoSteps(network, [0, 1]);

    expect(steps.length).toBe(5);
  });

  it('labels layers correctly', () => {
    const network = createNetwork([2, 4, 3, 2, 1]);
    const steps = generateDemoSteps(network, [0, 1]);

    expect(steps[0].layerLabel).toBe('Input');
    expect(steps[1].layerLabel).toBe('Hidden 1');
    expect(steps[2].layerLabel).toBe('Hidden 2');
    expect(steps[3].layerLabel).toBe('Hidden 3');
    expect(steps[4].layerLabel).toBe('Output');
  });

  it('captures correct neuron count per layer', () => {
    const network = createNetwork([2, 4, 3, 2, 1]);
    const steps = generateDemoSteps(network, [0, 1]);

    expect(steps[0].neurons.length).toBe(2); // Input
    expect(steps[1].neurons.length).toBe(4); // Hidden 1
    expect(steps[2].neurons.length).toBe(3); // Hidden 2
    expect(steps[3].neurons.length).toBe(2); // Hidden 3
    expect(steps[4].neurons.length).toBe(1); // Output
  });

  it('captures input values for input layer neurons', () => {
    const network = createNetwork([2, 2, 1]);
    const steps = generateDemoSteps(network, [1, 0]);

    expect(steps[0].neurons[0].postActivation).toBe(1);
    expect(steps[0].neurons[1].postActivation).toBe(0);
  });

  it('generates formulas with 3 decimal precision', () => {
    const network = createNetwork([2, 2, 1]);
    const steps = generateDemoSteps(network, [0.5, 0.5]);

    // Check that hidden layer has formula with proper decimal format
    const hiddenNeuron = steps[1].neurons[0];
    expect(hiddenNeuron.formula).toMatch(/\d+\.\d{3}/); // Should contain 3 decimal numbers
  });

  it('input neuron calculations have empty inputs array', () => {
    const network = createNetwork([2, 2, 1]);
    const steps = generateDemoSteps(network, [1, 0]);

    expect(steps[0].neurons[0].inputs.length).toBe(0);
    expect(steps[0].neurons[1].inputs.length).toBe(0);
  });

  it('hidden/output neurons have correct input count', () => {
    const network = createNetwork([2, 3, 1]);
    const steps = generateDemoSteps(network, [1, 0]);

    // Hidden layer neurons should have 2 inputs (from input layer)
    expect(steps[1].neurons[0].inputs.length).toBe(2);

    // Output neuron should have 3 inputs (from hidden layer)
    expect(steps[2].neurons[0].inputs.length).toBe(3);
  });
});

describe('formatCalculation', () => {
  it('formats input layer calculation correctly', () => {
    const calc: NeuronCalculation = {
      neuronId: 'n_0_0',
      inputs: [],
      bias: 0,
      weightedSum: 1,
      preActivation: 1,
      postActivation: 1,
      formula: '',
    };

    const result = formatCalculation(calc);
    // T036-T037: Updated format includes "value" for clarity
    expect(result).toBe('Input value: 1.000');
  });

  it('formats hidden layer calculation with positive weights', () => {
    const calc: NeuronCalculation = {
      neuronId: 'n_1_0',
      inputs: [
        { sourceId: 'n_0_0', activation: 0.5, weight: 1.0 },
        { sourceId: 'n_0_1', activation: 0.3, weight: 0.8 },
      ],
      bias: 0.1,
      weightedSum: 0.84,
      preActivation: 0.84,
      postActivation: 0.698,
      formula: '',
    };

    const result = formatCalculation(calc);
    expect(result).toContain('0.500×1.000');
    expect(result).toContain('0.300×0.800');
    // T036-T037: Updated format shows bias explicitly labeled
    expect(result).toContain('bias(0.100)');
    // T036-T037: Updated format uses "σ =" instead of "σ("
    expect(result).toContain('σ =');
  });

  it('formats negative weights correctly', () => {
    const calc: NeuronCalculation = {
      neuronId: 'n_1_0',
      inputs: [
        { sourceId: 'n_0_0', activation: 0.5, weight: -0.5 },
      ],
      bias: 0.1,
      weightedSum: -0.15,
      preActivation: -0.15,
      postActivation: 0.463,
      formula: '',
    };

    const result = formatCalculation(calc);
    expect(result).toContain('-0.500');
  });
});

describe('getPrediction', () => {
  it('returns output neuron activation', () => {
    const network = createNetwork([2, 2, 1]);
    const steps = generateDemoSteps(network, [1, 0]);

    const prediction = getPrediction(steps);

    // Should be between 0 and 1 (sigmoid output)
    expect(prediction).toBeGreaterThanOrEqual(0);
    expect(prediction).toBeLessThanOrEqual(1);
  });

  it('returns 0 for empty steps', () => {
    expect(getPrediction([])).toBe(0);
  });
});
