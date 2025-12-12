// Legend component for displaying network component explanations

import type { LegendItem, LegendCategory } from './types';
import { getLegendItemsByCategory } from './content';

export interface LegendOptions {
  containerId: string;
  defaultExpanded?: boolean;
}

export class Legend {
  private container: HTMLElement | null = null;
  private isExpanded: boolean = true;
  private options: LegendOptions;

  constructor(options: LegendOptions) {
    this.options = options;
    this.isExpanded = options.defaultExpanded ?? true;
    this.init();
  }

  private init(): void {
    this.container = document.getElementById(this.options.containerId);
    if (!this.container) {
      console.warn(`Legend container #${this.options.containerId} not found`);
      return;
    }

    this.render();
    this.bindEvents();
  }

  private render(): void {
    if (!this.container) return;

    const categories: LegendCategory[] = ['neurons', 'weights', 'layers', 'training'];

    this.container.innerHTML = `
      <div class="legend ${this.isExpanded ? 'expanded' : 'collapsed'}" role="complementary" aria-label="Network component legend">
        <button
          class="legend-toggle"
          aria-expanded="${this.isExpanded}"
          aria-controls="legend-content"
          title="${this.isExpanded ? 'Collapse legend' : 'Expand legend'}"
        >
          <span class="legend-toggle-icon">${this.isExpanded ? '◀' : '▶'}</span>
          <span class="legend-toggle-text">Legend</span>
        </button>
        <div id="legend-content" class="legend-content" ${this.isExpanded ? '' : 'hidden'}>
          <h2 class="legend-title">Network Components</h2>
          ${categories.map((category) => this.renderCategory(category)).join('')}
        </div>
      </div>
    `;
  }

  private renderCategory(category: LegendCategory): string {
    const items = getLegendItemsByCategory(category);
    const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

    return `
      <section class="legend-section" aria-labelledby="legend-${category}">
        <h3 id="legend-${category}" class="legend-section-title">${categoryTitle}</h3>
        <ul class="legend-items" role="list">
          ${items.map((item) => this.renderItem(item)).join('')}
        </ul>
      </section>
    `;
  }

  private renderItem(item: LegendItem): string {
    return `
      <li class="legend-item">
        <span class="legend-visual" aria-hidden="true">
          ${this.renderVisualSample(item)}
        </span>
        <span class="legend-label">${item.label}</span>
        <span class="legend-description">${item.description}</span>
      </li>
    `;
  }

  // T013, T014, T015: SVG visual samples
  private renderVisualSample(item: LegendItem): string {
    const { visualSample } = item;
    const props = visualSample.properties;

    switch (visualSample.type) {
      case 'circle':
        // T013: Neuron visual sample
        return `
          <svg width="24" height="24" viewBox="0 0 24 24" class="legend-svg">
            <circle
              cx="12"
              cy="12"
              r="8"
              fill="${props.fill}"
              stroke="${props.stroke}"
              stroke-width="${props.strokeWidth}"
            />
          </svg>
        `;

      case 'gradient':
        // T013: Activation gradient sample
        return `
          <svg width="48" height="24" viewBox="0 0 48 24" class="legend-svg legend-svg-wide">
            <defs>
              <linearGradient id="activation-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#1f2937;stop-opacity:${props.from}" />
                <stop offset="100%" style="stop-color:#1f2937;stop-opacity:${props.to}" />
              </linearGradient>
            </defs>
            <rect x="2" y="4" width="44" height="16" rx="4" fill="url(#activation-gradient)" stroke="#374151" stroke-width="1"/>
            <text x="5" y="15" font-size="8" fill="#f9fafb">Low</text>
            <text x="32" y="15" font-size="8" fill="#f9fafb">High</text>
          </svg>
        `;

      case 'line':
        // T014: Weight line samples
        if (props.gradient) {
          // Magnitude sample showing thickness variation
          return `
            <svg width="48" height="24" viewBox="0 0 48 24" class="legend-svg legend-svg-wide">
              <line x1="4" y1="12" x2="15" y2="12" stroke="#6b7280" stroke-width="${props.strokeWidthMin}" stroke-linecap="round"/>
              <line x1="20" y1="12" x2="31" y2="12" stroke="#6b7280" stroke-width="3" stroke-linecap="round"/>
              <line x1="36" y1="12" x2="47" y2="12" stroke="#6b7280" stroke-width="${props.strokeWidthMax}" stroke-linecap="round"/>
            </svg>
          `;
        }
        // Standard positive/negative weight lines
        return `
          <svg width="32" height="24" viewBox="0 0 32 24" class="legend-svg">
            <line x1="4" y1="12" x2="28" y2="12" stroke="${props.stroke}" stroke-width="${props.strokeWidth}" stroke-linecap="round"/>
          </svg>
        `;

      case 'color-swatch':
        // T015: Layer type indicators and training indicators
        return `
          <span class="legend-swatch" style="background-color: ${props.color}; color: #f9fafb;">
            ${props.label}
          </span>
        `;

      default:
        return '';
    }
  }

  private bindEvents(): void {
    if (!this.container) return;

    const toggle = this.container.querySelector('.legend-toggle');
    toggle?.addEventListener('click', () => this.toggle());

    // Keyboard support (T019)
    toggle?.addEventListener('keydown', (e) => {
      const event = e as KeyboardEvent;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.toggle();
      }
    });
  }

  // T019: Collapse/expand toggle
  toggle(): void {
    this.isExpanded = !this.isExpanded;
    this.render();
    this.bindEvents();
  }

  expand(): void {
    if (!this.isExpanded) {
      this.toggle();
    }
  }

  collapse(): void {
    if (this.isExpanded) {
      this.toggle();
    }
  }

  isOpen(): boolean {
    return this.isExpanded;
  }
}
