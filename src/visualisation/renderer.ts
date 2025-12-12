// D3-based SVG renderer for neural network visualization

import * as d3 from 'd3';
import type { Network, Neuron, Weight } from '../network/types';
import {
  calculateNeuronPositions,
  calculateWeightLines,
  getLayerLabelPositions,
  getWeightThickness,
  getWeightColorClass,
  getNeuronFill,
  getResponsiveConfig,
  type NeuronPosition,
  type WeightLine,
  type LayoutConfig,
} from './layout';
import type { WeightDelta } from './weight-delta';

export interface RendererOptions {
  containerId: string;
  onNeuronHover?: (neuron: Neuron | null, event: MouseEvent) => void;
  onWeightHover?: (weight: Weight | null, event: MouseEvent) => void;
  onWeightClick?: (weight: Weight, event: MouseEvent) => void;
}

export class NetworkRenderer {
  private svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>;
  private network: Network;
  private neuronPositions: Map<string, NeuronPosition> = new Map();
  private weightLines: WeightLine[] = [];
  private config: LayoutConfig;
  private options: RendererOptions;

  // D3 selections for update efficiency
  private weightsGroup!: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>;
  private neuronsGroup!: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>;
  private labelsGroup!: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>;

  constructor(network: Network, options: RendererOptions) {
    this.network = network;
    this.options = options;

    // Get container dimensions
    const container = document.getElementById(options.containerId);
    if (!container) {
      throw new Error(`Container #${options.containerId} not found`);
    }

    const rect = container.getBoundingClientRect();
    this.config = getResponsiveConfig(rect.width || 800, rect.height || 400);

    // Select SVG element
    this.svg = d3.select<SVGSVGElement, unknown>(`#${options.containerId}`);

    // Set SVG dimensions
    this.svg
      .attr('width', this.config.width)
      .attr('height', this.config.height)
      .attr('viewBox', `0 0 ${this.config.width} ${this.config.height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    // Calculate layout
    this.calculateLayout();

    // Initialize render groups
    this.initializeGroups();

    // Initial render
    this.render();
  }

  private calculateLayout(): void {
    this.neuronPositions = calculateNeuronPositions(this.network, this.config);
    this.weightLines = calculateWeightLines(this.network, this.neuronPositions);
  }

  private initializeGroups(): void {
    // Clear existing content
    this.svg.selectAll('*').remove();

    // T035: Add SVG defs for arrow markers (gradient direction indicators)
    const defs = this.svg.append('defs');

    // Arrow up marker (for increasing weights)
    defs.append('marker')
      .attr('id', 'arrow-up')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 5)
      .attr('refY', 10)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M 0 10 L 5 0 L 10 10 z')
      .attr('fill', '#22c55e');

    // Arrow down marker (for decreasing weights)
    defs.append('marker')
      .attr('id', 'arrow-down')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 5)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M 0 0 L 5 10 L 10 0 z')
      .attr('fill', '#ef4444');

    // Create groups in correct z-order (weights behind neurons)
    this.weightsGroup = this.svg.append('g').attr('class', 'weights-group');
    this.neuronsGroup = this.svg.append('g').attr('class', 'neurons-group');
    this.labelsGroup = this.svg.append('g').attr('class', 'labels-group');
  }

  /**
   * Render the network visualization
   */
  render(): void {
    this.renderWeights();
    this.renderNeurons();
    this.renderLabels();
  }

  /**
   * Update visualization after network state changes
   */
  update(): void {
    this.updateWeights();
    this.updateNeurons();
  }

  private renderWeights(): void {
    const self = this;

    this.weightsGroup
      .selectAll<SVGLineElement, WeightLine>('line.weight')
      .data(this.weightLines, (d) => d.weightId)
      .join('line')
      .attr('class', (d) => {
        const weight = this.getWeight(d.weightId);
        return `weight ${weight ? getWeightColorClass(weight.value) : 'positive'}`;
      })
      .attr('x1', (d) => d.from.x)
      .attr('y1', (d) => d.from.y)
      .attr('x2', (d) => d.to.x)
      .attr('y2', (d) => d.to.y)
      .attr('stroke-width', (d) => {
        const weight = this.getWeight(d.weightId);
        return weight ? getWeightThickness(weight.value) : 1;
      })
      .attr('tabindex', 0)
      .attr('role', 'graphics-symbol')
      .attr('aria-label', (d) => {
        const weight = this.getWeight(d.weightId);
        return `Weight connection, value: ${weight?.value.toFixed(3) ?? 'unknown'}`;
      })
      .on('mouseenter', function (event: MouseEvent, d: WeightLine) {
        const weight = self.getWeight(d.weightId);
        if (self.options.onWeightHover && weight) {
          self.options.onWeightHover(weight, event);
        }
      })
      .on('mouseleave', function (event: MouseEvent) {
        if (self.options.onWeightHover) {
          self.options.onWeightHover(null, event);
        }
      })
      .on('focus', function (event: FocusEvent, d: WeightLine) {
        const weight = self.getWeight(d.weightId);
        if (self.options.onWeightHover && weight) {
          self.options.onWeightHover(weight, event as unknown as MouseEvent);
        }
      })
      .on('blur', function (event: FocusEvent) {
        if (self.options.onWeightHover) {
          self.options.onWeightHover(null, event as unknown as MouseEvent);
        }
      })
      // T036: Click handler for weight history panel
      .on('click', function (event: MouseEvent, d: WeightLine) {
        const weight = self.getWeight(d.weightId);
        if (self.options.onWeightClick && weight) {
          self.options.onWeightClick(weight, event);
        }
      })
      // T042: Keyboard accessibility - Enter key triggers click
      .on('keydown', function (event: KeyboardEvent, d: WeightLine) {
        if (event.key === 'Enter') {
          const weight = self.getWeight(d.weightId);
          if (self.options.onWeightClick && weight) {
            self.options.onWeightClick(weight, event as unknown as MouseEvent);
          }
        }
      });
  }

  private updateWeights(): void {
    this.weightsGroup
      .selectAll<SVGLineElement, WeightLine>('line.weight')
      .attr('class', (d) => {
        const weight = this.getWeight(d.weightId);
        return `weight ${weight ? getWeightColorClass(weight.value) : 'positive'}`;
      })
      .transition()
      .duration(200)
      .attr('stroke-width', (d) => {
        const weight = this.getWeight(d.weightId);
        return weight ? getWeightThickness(weight.value) : 1;
      });
  }

  private renderNeurons(): void {
    const self = this;
    const positions = Array.from(this.neuronPositions.values());

    this.neuronsGroup
      .selectAll<SVGCircleElement, NeuronPosition>('circle.neuron')
      .data(positions, (d) => d.neuronId)
      .join('circle')
      .attr('class', 'neuron')
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y)
      .attr('r', this.config.neuronRadius)
      // T023, T025: Use solid fill color based on activation instead of fill-opacity
      .attr('fill', (d) => {
        const neuron = this.getNeuron(d.neuronId);
        return neuron ? getNeuronFill(neuron.activation) : getNeuronFill(0);
      })
      .attr('tabindex', 0)
      .attr('role', 'graphics-symbol')
      .attr('aria-label', (d) => {
        const neuron = this.getNeuron(d.neuronId);
        if (!neuron) return 'Neuron';
        const layer = this.network.layers[neuron.layerIndex];
        return `${layer.type} neuron, activation: ${neuron.activation.toFixed(3)}, bias: ${neuron.bias.toFixed(3)}`;
      })
      .on('mouseenter', function (event: MouseEvent, d: NeuronPosition) {
        const neuron = self.getNeuron(d.neuronId);
        if (self.options.onNeuronHover && neuron) {
          self.options.onNeuronHover(neuron, event);
        }
      })
      .on('mouseleave', function (event: MouseEvent) {
        if (self.options.onNeuronHover) {
          self.options.onNeuronHover(null, event);
        }
      })
      .on('focus', function (event: FocusEvent, d: NeuronPosition) {
        const neuron = self.getNeuron(d.neuronId);
        if (self.options.onNeuronHover && neuron) {
          self.options.onNeuronHover(neuron, event as unknown as MouseEvent);
        }
      })
      .on('blur', function (event: FocusEvent) {
        if (self.options.onNeuronHover) {
          self.options.onNeuronHover(null, event as unknown as MouseEvent);
        }
      });
  }

  private updateNeurons(): void {
    // T024: Transition fill color on activation change
    this.neuronsGroup
      .selectAll<SVGCircleElement, NeuronPosition>('circle.neuron')
      .transition()
      .duration(200)
      .attr('fill', (d) => {
        const neuron = this.getNeuron(d.neuronId);
        return neuron ? getNeuronFill(neuron.activation) : getNeuronFill(0);
      });
  }

  private renderLabels(): void {
    const labels = getLayerLabelPositions(this.network, this.config);

    // T021, T022: Render layer labels with type-specific styling
    this.labelsGroup
      .selectAll<SVGTextElement, { label: string; type: string; index: number; x: number; y: number }>('text.layer-label')
      .data(labels)
      .join('text')
      .attr('class', (d) => `layer-label ${d.type}`)
      .attr('x', (d) => d.x)
      .attr('y', (d) => d.y)
      .text((d) => d.label);

    // T022: Add layer index annotations above labels
    this.labelsGroup
      .selectAll<SVGTextElement, { label: string; type: string; index: number; x: number; y: number }>('text.layer-index')
      .data(labels)
      .join('text')
      .attr('class', 'layer-index')
      .attr('x', (d) => d.x)
      .attr('y', (d) => d.y - 12)
      .text((d) => `Layer ${d.index + 1}`);
  }

  /**
   * Handle window resize
   */
  resize(): void {
    const container = document.getElementById(this.options.containerId);
    if (!container) return;

    const rect = container.getBoundingClientRect();
    this.config = getResponsiveConfig(rect.width || 800, rect.height || 400);

    this.svg
      .attr('width', this.config.width)
      .attr('height', this.config.height)
      .attr('viewBox', `0 0 ${this.config.width} ${this.config.height}`);

    this.calculateLayout();
    this.render();
  }

  /**
   * Set a new network and re-render
   */
  setNetwork(network: Network): void {
    this.network = network;
    this.calculateLayout();
    this.render();
  }

  private getNeuron(id: string): Neuron | undefined {
    for (const layer of this.network.layers) {
      const neuron = layer.neurons.find((n) => n.id === id);
      if (neuron) return neuron;
    }
    return undefined;
  }

  private getWeight(id: string): Weight | undefined {
    return this.network.weights.find((w) => w.id === id);
  }

  /**
   * T011-T013, T035-T039: Highlight weight changes after a training step
   * Applies temporary CSS classes with fade-out animation and direction indicators
   * @param deltas - Map of weight IDs to delta information
   */
  highlightWeightChanges(deltas: Map<string, WeightDelta>): void {
    // Skip if no deltas
    if (deltas.size === 0) return;

    this.weightsGroup
      .selectAll<SVGLineElement, WeightLine>('line.weight')
      .each(function (d) {
        const delta = deltas.get(d.weightId);
        // T039: Only show indicators when magnitude is not 'none'
        if (!delta || delta.magnitude === 'none') return;

        const line = d3.select(this);

        // Remove any existing highlight classes
        line
          .classed('weight-increase', false)
          .classed('weight-decrease', false)
          .classed('magnitude-small', false)
          .classed('magnitude-medium', false)
          .classed('magnitude-large', false)
          // T036: Remove any existing direction classes
          .classed('weight-arrow-up', false)
          .classed('weight-arrow-down', false);

        // Apply direction class (increase or decrease)
        const isIncrease = delta.delta > 0;
        line.classed(isIncrease ? 'weight-increase' : 'weight-decrease', true);

        // T036: Apply direction arrow class based on direction
        if (delta.direction === 'increasing') {
          line.classed('weight-arrow-up', true);
          line.attr('marker-mid', 'url(#arrow-up)');
        } else if (delta.direction === 'decreasing') {
          line.classed('weight-arrow-down', true);
          line.attr('marker-mid', 'url(#arrow-down)');
        }

        // T013: Apply magnitude-based intensity class
        line.classed(`magnitude-${delta.magnitude}`, true);

        // T038: Update ARIA label with direction information
        const changeDirection = isIncrease ? 'increasing' : 'decreasing';
        const changeLabel = `Weight ${changeDirection} by ${Math.abs(delta.delta).toFixed(4)} (${delta.magnitude})`;
        line.attr('aria-label', changeLabel);

        // T034: Fade out after 800ms for better visibility (increased from 500ms)
        // Use setTimeout to remove classes after animation duration
        setTimeout(() => {
          line
            .classed('weight-increase', false)
            .classed('weight-decrease', false)
            .classed('magnitude-small', false)
            .classed('magnitude-medium', false)
            .classed('magnitude-large', false)
            // T036: Remove direction classes and markers
            .classed('weight-arrow-up', false)
            .classed('weight-arrow-down', false)
            .attr('marker-mid', null);

          // T044: Restore original ARIA label after animation
          const weight = deltas.get(d.weightId);
          if (weight) {
            line.attr('aria-label', `Weight connection, value: ${weight.currentValue.toFixed(3)}`);
          }
        }, 800);
      });
  }
}
