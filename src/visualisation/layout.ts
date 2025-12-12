// Layout calculations for network visualization

import type { Network } from '../network/types';

export interface Point {
  x: number;
  y: number;
}

export interface NeuronPosition extends Point {
  neuronId: string;
  layerIndex: number;
}

export interface WeightLine {
  weightId: string;
  from: Point;
  to: Point;
}

export interface LayoutConfig {
  width: number;
  height: number;
  padding: number;
  neuronRadius: number;
}

const DEFAULT_CONFIG: LayoutConfig = {
  width: 800,
  height: 400,
  padding: 60,
  neuronRadius: 20,
};

/**
 * Calculate layout configuration based on viewport
 * Optimized for 5-layer networks with up to 4 neurons per layer
 */
export function getResponsiveConfig(containerWidth: number, containerHeight: number): LayoutConfig {
  // Scale for viewports between 1024px and 1920px
  // Wider layout to accommodate 5 layers with good spacing
  const width = Math.min(Math.max(containerWidth - 40, 700), 1000);
  const height = Math.min(Math.max(containerHeight - 100, 350), 550);

  // Scale neuron radius - slightly smaller for deeper networks
  // to prevent overlap with 4 neurons in a layer
  const neuronRadius = Math.min(Math.max(width / 50, 12), 20);

  return {
    width,
    height,
    padding: neuronRadius * 4,
    neuronRadius,
  };
}

/**
 * Calculate positions for all neurons in the network
 */
export function calculateNeuronPositions(
  network: Network,
  config: LayoutConfig = DEFAULT_CONFIG
): Map<string, NeuronPosition> {
  const positions = new Map<string, NeuronPosition>();
  const { width, height, padding } = config;

  const layerCount = network.layers.length;
  const usableWidth = width - 2 * padding;
  const usableHeight = height - 2 * padding;

  for (let layerIdx = 0; layerIdx < layerCount; layerIdx++) {
    const layer = network.layers[layerIdx];
    const neuronCount = layer.neurons.length;

    // X position: spread layers evenly across width
    const x = padding + (layerIdx / (layerCount - 1)) * usableWidth;

    for (let neuronIdx = 0; neuronIdx < neuronCount; neuronIdx++) {
      const neuron = layer.neurons[neuronIdx];

      // Y position: center neurons vertically within layer
      // If only 1 neuron, center it
      const y =
        neuronCount === 1
          ? height / 2
          : padding + (neuronIdx / (neuronCount - 1)) * usableHeight;

      positions.set(neuron.id, {
        x,
        y,
        neuronId: neuron.id,
        layerIndex: layerIdx,
      });
    }
  }

  return positions;
}

/**
 * Calculate line segments for all weights
 */
export function calculateWeightLines(
  network: Network,
  neuronPositions: Map<string, NeuronPosition>
): WeightLine[] {
  const lines: WeightLine[] = [];

  for (const weight of network.weights) {
    const fromPos = neuronPositions.get(weight.fromNeuronId);
    const toPos = neuronPositions.get(weight.toNeuronId);

    if (fromPos && toPos) {
      lines.push({
        weightId: weight.id,
        from: { x: fromPos.x, y: fromPos.y },
        to: { x: toPos.x, y: toPos.y },
      });
    }
  }

  return lines;
}

/**
 * Get label positions for each layer
 * T021: Shows "Hidden 1", "Hidden 2", "Hidden 3" for multiple hidden layers
 */
export function getLayerLabelPositions(
  network: Network,
  config: LayoutConfig = DEFAULT_CONFIG
): Array<{ label: string; type: string; index: number; x: number; y: number }> {
  const { width, padding } = config;
  const layerCount = network.layers.length;
  const usableWidth = width - 2 * padding;

  // Count hidden layers for numbering
  let hiddenCount = 0;

  return network.layers.map((layer, idx) => {
    let label: string;
    if (layer.type === 'hidden') {
      hiddenCount++;
      label = `Hidden ${hiddenCount}`;
    } else {
      label = layer.type.charAt(0).toUpperCase() + layer.type.slice(1);
    }

    return {
      label,
      type: layer.type,
      index: idx,
      x: padding + (idx / (layerCount - 1)) * usableWidth,
      y: padding / 2,
    };
  });
}

/**
 * Calculate weight thickness based on value
 * Returns value between min and max thickness
 */
export function getWeightThickness(
  value: number,
  minThickness: number = 1,
  maxThickness: number = 6
): number {
  // Use absolute value, scale logarithmically for better visual distribution
  const absValue = Math.abs(value);
  // Clamp to reasonable range and map to thickness
  const normalized = Math.min(absValue, 3) / 3; // Values beyond 3 are capped
  return minThickness + normalized * (maxThickness - minThickness);
}

/**
 * Determine weight color class based on sign
 */
export function getWeightColorClass(value: number): 'positive' | 'negative' {
  return value >= 0 ? 'positive' : 'negative';
}

/**
 * Calculate neuron fill opacity based on activation
 * @deprecated Use getNeuronFill() for solid color fills instead
 */
export function getNeuronOpacity(activation: number): number {
  // Activation is already 0-1 from sigmoid
  // Use a minimum opacity so neurons are always visible
  return 0.2 + activation * 0.8;
}

/**
 * T021-T022: Calculate neuron fill color based on activation
 * Uses HSL color space for smooth intensity transitions
 * Low activation = light color (85% lightness)
 * High activation = dark color (25% lightness)
 * @param activation - Neuron activation value (0-1 from sigmoid)
 * @returns HSL color string
 */
export function getNeuronFill(activation: number): string {
  // Clamp activation to valid range (should already be 0-1 from sigmoid)
  const clampedActivation = Math.max(0, Math.min(1, activation));

  // HSL values from CSS custom properties:
  // --neuron-hue: 220 (blue)
  // --neuron-saturation: 70%
  // --neuron-lightness-low: 85% (inactive/low activation)
  // --neuron-lightness-high: 25% (active/high activation)
  const hue = 220;
  const saturation = 70;
  const lightnessLow = 85;
  const lightnessHigh = 25;

  // Interpolate lightness: higher activation = darker (lower lightness)
  // Formula: 85 - activation * 60 (85% at 0, 25% at 1)
  const lightness = lightnessLow - clampedActivation * (lightnessLow - lightnessHigh);

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
