// Animation utilities for training visualization

import * as d3 from 'd3';
import type { Network } from '../network/types';
import { getWeightThickness, getWeightColorClass, getNeuronOpacity } from './layout';

export interface AnimationConfig {
  duration: number;
  easing: (t: number) => number;
}

const DEFAULT_CONFIG: AnimationConfig = {
  duration: 200,
  easing: d3.easeCubicOut,
};

/**
 * Animate weight changes (thickness and color transitions)
 */
export function animateWeights(
  weightsGroup: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>,
  network: Network,
  config: AnimationConfig = DEFAULT_CONFIG
): void {
  weightsGroup
    .selectAll<SVGLineElement, { weightId: string }>('line.weight')
    .each(function (d) {
      const weight = network.weights.find((w) => w.id === d.weightId);
      if (!weight) return;

      const line = d3.select(this);
      const colorClass = getWeightColorClass(weight.value);
      const thickness = getWeightThickness(weight.value);

      // Update class for color
      line
        .attr('class', `weight ${colorClass}`)
        .transition()
        .duration(config.duration)
        .ease(config.easing)
        .attr('stroke-width', thickness);
    });
}

/**
 * Animate neuron activation changes (fill opacity transitions)
 */
export function animateNeurons(
  neuronsGroup: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>,
  network: Network,
  config: AnimationConfig = DEFAULT_CONFIG
): void {
  neuronsGroup
    .selectAll<SVGCircleElement, { neuronId: string }>('circle.neuron')
    .each(function (d) {
      // Find neuron by ID
      let neuron = null;
      for (const layer of network.layers) {
        neuron = layer.neurons.find((n) => n.id === d.neuronId);
        if (neuron) break;
      }
      if (!neuron) return;

      const circle = d3.select(this);
      const opacity = getNeuronOpacity(neuron.activation);

      circle
        .transition()
        .duration(config.duration)
        .ease(config.easing)
        .attr('fill-opacity', opacity);
    });
}

/**
 * Animate both weights and neurons together
 */
export function animateNetwork(
  weightsGroup: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>,
  neuronsGroup: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>,
  network: Network,
  config: AnimationConfig = DEFAULT_CONFIG
): void {
  animateWeights(weightsGroup, network, config);
  animateNeurons(neuronsGroup, network, config);
}

/**
 * Flash effect for neurons during forward pass visualization
 */
export function flashNeuron(
  neuronsGroup: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>,
  neuronId: string,
  config: AnimationConfig = DEFAULT_CONFIG
): void {
  neuronsGroup
    .selectAll<SVGCircleElement, { neuronId: string }>('circle.neuron')
    .filter((d) => d.neuronId === neuronId)
    .transition()
    .duration(config.duration / 2)
    .attr('stroke-width', 4)
    .transition()
    .duration(config.duration / 2)
    .attr('stroke-width', 2);
}

/**
 * Create animation config with custom duration
 */
export function createAnimationConfig(duration: number): AnimationConfig {
  return {
    duration,
    easing: d3.easeCubicOut,
  };
}

/**
 * T023: Animate data flow direction during forward pass
 * Creates a wave effect through the network layers
 */
export function animateDataFlow(
  neuronsGroup: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>,
  network: Network,
  config: AnimationConfig = DEFAULT_CONFIG
): void {
  const layerDelay = config.duration / (network.layers.length - 1);

  network.layers.forEach((layer, layerIdx) => {
    layer.neurons.forEach((neuron) => {
      neuronsGroup
        .selectAll<SVGCircleElement, { neuronId: string }>('circle.neuron')
        .filter((d) => d.neuronId === neuron.id)
        .transition()
        .delay(layerIdx * layerDelay)
        .duration(config.duration / 2)
        .attr('stroke-width', 4)
        .attr('stroke', '#3b82f6')
        .transition()
        .duration(config.duration / 2)
        .attr('stroke-width', 2)
        .attr('stroke', '#374151');
    });
  });
}
