// Demo Calculator
// Generates DemoStep objects from network state after forward pass

import type { Network, Layer } from '../network/types';
import type { DemoStep, NeuronCalculation, XORInput } from './types';
import { forwardPass } from '../network/training';

/**
 * T011: Format a number to 3 decimal places
 */
function formatNumber(value: number): string {
  return value.toFixed(3);
}

/**
 * T011, T036-T037: Format a calculation for display
 * Shows clear input→weight→output flow
 * Format: "inputs × weights + bias = pre-activation → activation"
 * Example: "(0.500×1.234) + (0.300×-0.567) + bias(0.100) = 0.547 → σ = 0.633"
 */
export function formatCalculation(calc: NeuronCalculation): string {
  if (calc.inputs.length === 0) {
    // Input layer - just show the value
    return `Input value: ${formatNumber(calc.postActivation)}`;
  }

  // Build weighted sum terms with clearer grouping
  const terms = calc.inputs.map((input) => {
    const weightStr = formatNumber(input.weight);
    return `(${formatNumber(input.activation)}×${weightStr})`;
  });

  // Add bias term with label
  const biasStr = ` + bias(${formatNumber(calc.bias)})`;

  // Build full formula with clear structure
  // T037: Show calculation breakdown format
  const sumPart = terms.join(' + ') + biasStr;
  const preActResult = formatNumber(calc.preActivation);
  const activation = formatNumber(calc.postActivation);

  return `${sumPart} = ${preActResult} → σ = ${activation}`;
}

/**
 * Get layer label based on type and index
 */
function getLayerLabel(layer: Layer, hiddenIndex: number): string {
  switch (layer.type) {
    case 'input':
      return 'Input';
    case 'output':
      return 'Output';
    case 'hidden':
      return `Hidden ${hiddenIndex}`;
    default:
      return `Layer ${layer.index}`;
  }
}

/**
 * T010: Generate DemoStep array from network after forward pass
 */
export function generateDemoSteps(network: Network, input: XORInput): DemoStep[] {
  // Run forward pass to set all activations
  forwardPass(network, input);

  const steps: DemoStep[] = [];
  let hiddenIndex = 1;

  for (let layerIdx = 0; layerIdx < network.layers.length; layerIdx++) {
    const layer = network.layers[layerIdx];
    const prevLayer = layerIdx > 0 ? network.layers[layerIdx - 1] : null;

    const neurons: NeuronCalculation[] = [];

    for (const neuron of layer.neurons) {
      const inputs: { sourceId: string; activation: number; weight: number }[] = [];

      if (prevLayer) {
        // Collect inputs from previous layer
        for (const prevNeuron of prevLayer.neurons) {
          const weight = network.weights.find(
            (w) => w.fromNeuronId === prevNeuron.id && w.toNeuronId === neuron.id
          );
          if (weight) {
            inputs.push({
              sourceId: prevNeuron.id,
              activation: prevNeuron.activation,
              weight: weight.value,
            });
          }
        }
      }

      const neuronCalc: NeuronCalculation = {
        neuronId: neuron.id,
        inputs,
        bias: neuron.bias,
        weightedSum: neuron.preActivation,
        preActivation: neuron.preActivation,
        postActivation: neuron.activation,
        formula: '', // Will be set below
      };

      // Generate formula string
      neuronCalc.formula = formatCalculation(neuronCalc);

      neurons.push(neuronCalc);
    }

    // Determine layer label
    const layerLabel = getLayerLabel(layer, hiddenIndex);
    if (layer.type === 'hidden') {
      hiddenIndex++;
    }

    steps.push({
      layerIndex: layerIdx,
      layerType: layer.type,
      layerLabel,
      neurons,
      isComplete: false,
    });
  }

  return steps;
}

/**
 * Get the predicted output value from the last step
 */
export function getPrediction(steps: DemoStep[]): number {
  if (steps.length === 0) return 0;
  const outputStep = steps[steps.length - 1];
  if (outputStep.neurons.length === 0) return 0;
  return outputStep.neurons[0].postActivation;
}

/**
 * Check if prediction matches expected output
 */
export function isPredictionCorrect(
  steps: DemoStep[],
  expectedOutput: number,
  threshold: number = 0.5
): boolean {
  const prediction = getPrediction(steps);
  const predictedClass = prediction >= threshold ? 1 : 0;
  return predictedClass === expectedOutput;
}

/**
 * Get simplified calculation summary for a neuron
 */
export function getCalculationSummary(calc: NeuronCalculation): string {
  if (calc.inputs.length === 0) {
    return `= ${formatNumber(calc.postActivation)}`;
  }
  return `Σ = ${formatNumber(calc.preActivation)} → ${formatNumber(calc.postActivation)}`;
}
