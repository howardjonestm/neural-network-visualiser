// Demo Animation
// Pulse animation for forward pass visualization

import * as d3 from 'd3';
import type { Network } from '../network/types';
import type { DemoStep, DemoSpeed, SignalPosition } from './types';
import { SPEED_CONFIGS } from './types';
import {
  calculateNeuronPositions,
  type NeuronPosition,
  type LayoutConfig,
} from '../visualisation/layout';

// Animation state
let animationCancelled = false;
let currentAnimationId: number | null = null;

/**
 * T017: Create pulse SVG element
 */
export function createPulseElement(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  position: SignalPosition,
  isPositive: boolean
): d3.Selection<SVGCircleElement, unknown, null, undefined> {
  const pulse = svg
    .append('circle')
    .attr('class', `demo-pulse ${isPositive ? 'positive' : 'negative'}`)
    .attr('cx', position.x)
    .attr('cy', position.y)
    .attr('r', 8)
    .attr('opacity', 0);

  return pulse;
}

/**
 * T018: Animate pulse along weight path
 */
export function animatePulse(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  from: SignalPosition,
  to: SignalPosition,
  duration: number,
  isPositive: boolean
): Promise<void> {
  return new Promise((resolve) => {
    if (animationCancelled) {
      console.log('animatePulse: cancelled');
      resolve();
      return;
    }

    const pulse = createPulseElement(svg, from, isPositive);
    console.log('Pulse element created:', pulse.node());

    pulse
      .transition()
      .duration(100)
      .attr('opacity', 1)
      .transition()
      .duration(duration)
      .ease(d3.easeLinear)
      .attr('cx', to.x)
      .attr('cy', to.y)
      .transition()
      .duration(100)
      .attr('opacity', 0)
      .on('end', () => {
        pulse.remove();
        resolve();
      });
  });
}

/**
 * T019: Highlight neuron for activation glow effect
 */
export function highlightNeuron(
  neuronsGroup: d3.Selection<SVGGElement, unknown, d3.BaseType, unknown>,
  neuronId: string,
  intensity: number = 1
): void {
  neuronsGroup
    .selectAll<SVGCircleElement, { neuronId: string }>('circle.neuron')
    .filter((d) => d.neuronId === neuronId)
    .classed('demo-active', true)
    .transition()
    .duration(200)
    .attr('stroke-width', 3 + intensity * 2)
    .attr('stroke', '#3b82f6');
}

/**
 * Clear neuron highlight
 */
export function clearNeuronHighlight(
  neuronsGroup: d3.Selection<SVGGElement, unknown, d3.BaseType, unknown>,
  neuronId: string
): void {
  neuronsGroup
    .selectAll<SVGCircleElement, { neuronId: string }>('circle.neuron')
    .filter((d) => d.neuronId === neuronId)
    .classed('demo-active', false)
    .transition()
    .duration(200)
    .attr('stroke-width', 2)
    .attr('stroke', '#374151');
}

/**
 * T020: Dim inactive elements to focus attention
 */
export function dimInactiveElements(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  activeLayerIndex: number,
  network: Network
): void {
  // Dim neurons not in active layer
  svg.selectAll<SVGCircleElement, { neuronId: string }>('circle.neuron').each(function (d) {
    const neuron = d3.select(this);
    let isActive = false;

    for (const layer of network.layers) {
      if (layer.index === activeLayerIndex || layer.index === activeLayerIndex - 1) {
        if (layer.neurons.some((n) => n.id === d.neuronId)) {
          isActive = true;
          break;
        }
      }
    }

    neuron
      .transition()
      .duration(200)
      .attr('opacity', isActive ? 1 : 0.3);
  });

  // Dim weights not connected to active layer
  svg.selectAll<SVGLineElement, { weightId: string }>('line.weight').each(function (d) {
    const weight = d3.select(this);
    const weightData = network.weights.find((w) => w.id === d.weightId);

    if (!weightData) return;

    // Check if weight connects to active layer
    let isActive = false;
    const toNeuron = network.layers
      .flatMap((l) => l.neurons)
      .find((n) => n.id === weightData.toNeuronId);

    if (toNeuron && toNeuron.layerIndex === activeLayerIndex) {
      isActive = true;
    }

    weight
      .transition()
      .duration(200)
      .attr('opacity', isActive ? 1 : 0.2);
  });
}

/**
 * Restore all elements to full opacity
 */
export function restoreAllElements(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>
): void {
  svg
    .selectAll('circle.neuron')
    .transition()
    .duration(200)
    .attr('opacity', 1)
    .attr('stroke-width', 2)
    .attr('stroke', '#374151');

  svg
    .selectAll('circle.neuron')
    .classed('demo-active', false);

  svg.selectAll('line.weight').transition().duration(200).attr('opacity', 1);
}

/**
 * T022: Animate a single layer (pulse + highlight)
 */
export async function animateLayer(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  neuronsGroup: d3.Selection<SVGGElement, unknown, d3.BaseType, unknown>,
  network: Network,
  step: DemoStep,
  neuronPositions: Map<string, NeuronPosition>,
  speed: DemoSpeed
): Promise<void> {
  if (animationCancelled) return;

  const config = SPEED_CONFIGS[speed];
  const layerIndex = step.layerIndex;

  // Dim inactive elements
  dimInactiveElements(svg, layerIndex, network);

  if (layerIndex === 0) {
    // Input layer - just highlight neurons
    for (const neuronCalc of step.neurons) {
      highlightNeuron(neuronsGroup, neuronCalc.neuronId, neuronCalc.postActivation);
    }
    await delay(config.layerDuration / 2);
    return;
  }

  // Animate pulses from each neuron in prev layer to each in current layer
  const pulsePromises: Promise<void>[] = [];

  for (const neuronCalc of step.neurons) {
    const toPos = neuronPositions.get(neuronCalc.neuronId);
    if (!toPos) continue;

    for (const input of neuronCalc.inputs) {
      if (animationCancelled) return;

      const fromPos = neuronPositions.get(input.sourceId);
      if (!fromPos) continue;

      const isPositive = input.weight >= 0;
      pulsePromises.push(
        animatePulse(
          svg,
          { x: fromPos.x, y: fromPos.y },
          { x: toPos.x, y: toPos.y },
          config.pulseDuration,
          isPositive
        )
      );
    }
  }

  // Wait for pulses to reach halfway before highlighting target neurons
  await delay(config.pulseDuration / 2);

  // Highlight target neurons
  for (const neuronCalc of step.neurons) {
    highlightNeuron(neuronsGroup, neuronCalc.neuronId, neuronCalc.postActivation);
  }

  // Wait for remaining animation
  await Promise.all(pulsePromises);
}

/**
 * T040: Jump to step immediately (for step-through mode)
 */
export function jumpToStep(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  neuronsGroup: d3.Selection<SVGGElement, unknown, d3.BaseType, unknown>,
  network: Network,
  step: DemoStep
): void {
  // Clear any previous highlights
  restoreAllElements(svg);

  // Dim inactive elements
  dimInactiveElements(svg, step.layerIndex, network);

  // Highlight neurons in current step
  for (const neuronCalc of step.neurons) {
    highlightNeuron(neuronsGroup, neuronCalc.neuronId, neuronCalc.postActivation);
  }
}

/**
 * T031: Show input values on input neurons
 */
export function showInputValues(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  network: Network,
  neuronPositions: Map<string, NeuronPosition>,
  inputValues: [number, number]
): void {
  // Remove any existing input labels
  svg.selectAll('.input-value-label').remove();

  const inputLayer = network.layers[0];
  inputLayer.neurons.forEach((neuron, idx) => {
    const pos = neuronPositions.get(neuron.id);
    if (!pos) return;

    svg
      .append('text')
      .attr('class', 'input-value-label')
      .attr('x', pos.x)
      .attr('y', pos.y + 35)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('fill', '#1f2937')
      .text(inputValues[idx]);
  });
}

/**
 * Remove input value labels
 */
export function hideInputValues(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>
): void {
  svg.selectAll('.input-value-label').remove();
}

/**
 * T023: Run complete demo animation
 */
export async function runDemo(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  neuronsGroup: d3.Selection<SVGGElement, unknown, d3.BaseType, unknown>,
  network: Network,
  steps: DemoStep[],
  speed: DemoSpeed,
  onStepComplete: (stepIndex: number) => void,
  shouldContinue: () => boolean
): Promise<void> {
  animationCancelled = false;

  const neuronPositions = calculateNeuronPositions(network);

  for (let i = 0; i < steps.length; i++) {
    if (animationCancelled || !shouldContinue()) {
      break;
    }

    await animateLayer(svg, neuronsGroup, network, steps[i], neuronPositions, speed);
    onStepComplete(i);

    // Pause between layers
    if (i < steps.length - 1) {
      await delay(SPEED_CONFIGS[speed].layerDuration - SPEED_CONFIGS[speed].pulseDuration);
    }
  }
}

/**
 * T044: Auto-advance timer for running mode
 */
export function startAutoAdvanceTimer(
  speed: DemoSpeed,
  onAdvance: () => boolean // returns false when should stop
): () => void {
  const config = SPEED_CONFIGS[speed];
  let timeoutId: number | null = null;

  const tick = () => {
    if (!onAdvance()) {
      return; // Stop if onAdvance returns false
    }
    timeoutId = window.setTimeout(tick, config.layerDuration);
  };

  timeoutId = window.setTimeout(tick, config.layerDuration);

  // Return cancel function
  return () => {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
}

/**
 * Cancel any running animation
 */
export function cancelAnimation(): void {
  animationCancelled = true;
  if (currentAnimationId !== null) {
    window.clearTimeout(currentAnimationId);
    currentAnimationId = null;
  }
}

/**
 * Reset animation state
 */
export function resetAnimationState(): void {
  animationCancelled = false;
  currentAnimationId = null;
}

/**
 * T069: Ensure minimum animation duration
 */
export function getMinimumDuration(speed: DemoSpeed): number {
  const config = SPEED_CONFIGS[speed];
  // Minimum 500ms per layer even at fast speed
  return Math.max(config.layerDuration, 500);
}

/**
 * Helper: delay function
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    if (animationCancelled) {
      resolve();
      return;
    }
    currentAnimationId = window.setTimeout(resolve, ms);
  });
}

/**
 * T042: Animate training sample forward pass
 * Simple pulse animation from input through to output layers
 */
export async function animateTrainingSample(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  network: Network,
  _inputValues: number[], // Used for future input highlighting
  config?: LayoutConfig
): Promise<void> {
  // Reset animation state FIRST before checking
  resetAnimationState();

  console.log('animateTrainingSample called', { animationCancelled, config });

  const neuronPositions = calculateNeuronPositions(network, config);
  console.log('Neuron positions calculated:', neuronPositions.size, 'positions');

  // Quick animation through layers
  const animDuration = 200; // Animation duration per layer

  for (let layerIdx = 0; layerIdx < network.layers.length - 1; layerIdx++) {
    if (animationCancelled) {
      console.log('Animation cancelled at layer', layerIdx);
      return;
    }

    const layer = network.layers[layerIdx];
    const nextLayer = network.layers[layerIdx + 1];
    const pulsePromises: Promise<void>[] = [];

    console.log(`Animating layer ${layerIdx} -> ${layerIdx + 1}: ${layer.neurons.length} -> ${nextLayer.neurons.length} neurons`);

    for (const fromNeuron of layer.neurons) {
      const fromPos = neuronPositions.get(fromNeuron.id);
      if (!fromPos) {
        console.log('No fromPos for', fromNeuron.id);
        continue;
      }

      for (const toNeuron of nextLayer.neurons) {
        const toPos = neuronPositions.get(toNeuron.id);
        if (!toPos) {
          console.log('No toPos for', toNeuron.id);
          continue;
        }

        // Find weight to determine color
        const weight = network.weights.find(
          w => w.fromNeuronId === fromNeuron.id && w.toNeuronId === toNeuron.id
        );
        const isPositive = weight ? weight.value >= 0 : true;

        console.log(`Creating pulse from (${fromPos.x}, ${fromPos.y}) to (${toPos.x}, ${toPos.y})`);

        pulsePromises.push(
          animatePulse(
            svg,
            { x: fromPos.x, y: fromPos.y },
            { x: toPos.x, y: toPos.y },
            animDuration,
            isPositive
          )
        );
      }
    }

    console.log(`Created ${pulsePromises.length} pulses for layer ${layerIdx}`);
    await Promise.all(pulsePromises);
  }
  console.log('animateTrainingSample complete');
}
