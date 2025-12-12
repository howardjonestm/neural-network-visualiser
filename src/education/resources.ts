// T041, T046: Resources panel and LLM connection component

import type { LearningResource } from './types';
import { LEARNING_RESOURCES, LLM_CONTENT } from './content';

export interface ResourcesPanelOptions {
  containerId: string;
  defaultExpanded?: boolean;
}

export class ResourcesPanel {
  private container: HTMLElement | null = null;
  private isLLMExpanded: boolean = false;
  private isResourcesExpanded: boolean = false;
  private options: ResourcesPanelOptions;

  constructor(options: ResourcesPanelOptions) {
    this.options = options;
    this.isResourcesExpanded = options.defaultExpanded ?? false;
    this.init();
  }

  private init(): void {
    this.container = document.getElementById(this.options.containerId);
    if (!this.container) {
      console.warn(`Resources container #${this.options.containerId} not found`);
      return;
    }

    this.render();
    this.bindEvents();
  }

  private render(): void {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="resources-panel" role="complementary" aria-label="Learning resources">
        ${this.renderLLMSection()}
        ${this.renderResourcesSection()}
      </div>
    `;
  }

  // T041: LLM Connection expandable panel
  private renderLLMSection(): string {
    const content = LLM_CONTENT;

    return `
      <section class="resources-section llm-section" aria-labelledby="llm-heading">
        <button
          class="resources-section-toggle"
          aria-expanded="${this.isLLMExpanded}"
          aria-controls="llm-content"
          id="llm-toggle"
        >
          <span class="toggle-icon">${this.isLLMExpanded ? '▼' : '▶'}</span>
          <span class="toggle-text">${content.title}</span>
        </button>
        <div id="llm-content" class="resources-section-content" ${this.isLLMExpanded ? '' : 'hidden'}>
          ${content.sections.map((section) => this.renderContentSection(section)).join('')}
        </div>
      </section>
    `;
  }

  // T043: Key comparison points
  private renderContentSection(section: { heading: string; body: string; emphasis?: string }): string {
    return `
      <div class="content-section">
        <h4 class="content-heading">${section.heading}</h4>
        <p class="content-body">${section.body}</p>
        ${section.emphasis ? `<p class="content-emphasis">${section.emphasis}</p>` : ''}
      </div>
    `;
  }

  // T046: Resources panel with link cards
  private renderResourcesSection(): string {
    return `
      <section class="resources-section" aria-labelledby="resources-heading">
        <button
          class="resources-section-toggle"
          aria-expanded="${this.isResourcesExpanded}"
          aria-controls="resources-content"
          id="resources-toggle"
        >
          <span class="toggle-icon">${this.isResourcesExpanded ? '▼' : '▶'}</span>
          <span class="toggle-text">Learn More</span>
        </button>
        <div id="resources-content" class="resources-section-content" ${this.isResourcesExpanded ? '' : 'hidden'}>
          <ul class="resource-list" role="list">
            ${LEARNING_RESOURCES.map((resource) => this.renderResourceCard(resource)).join('')}
          </ul>
        </div>
      </section>
    `;
  }

  // T046, T048: Resource link cards with new tab
  private renderResourceCard(resource: LearningResource): string {
    const typeIcons: Record<string, string> = {
      video: '🎬',
      interactive: '🎮',
      article: '📰',
      book: '📚',
      reference: '📖',
    };

    const difficultyColors: Record<string, string> = {
      beginner: '#22c55e',
      intermediate: '#eab308',
      advanced: '#ef4444',
    };

    return `
      <li class="resource-card">
        <a
          href="${resource.url}"
          target="_blank"
          rel="noopener noreferrer"
          class="resource-link"
          tabindex="0"
        >
          <span class="resource-icon" aria-hidden="true">${typeIcons[resource.type] || '📄'}</span>
          <div class="resource-info">
            <span class="resource-title">${resource.title}</span>
            <span class="resource-description">${resource.description}</span>
            <span class="resource-meta">
              <span class="resource-type">${resource.type}</span>
              <span class="resource-difficulty" style="color: ${difficultyColors[resource.difficulty]}">${resource.difficulty}</span>
            </span>
          </div>
          <span class="resource-external" aria-label="Opens in new tab">↗</span>
        </a>
      </li>
    `;
  }

  private bindEvents(): void {
    if (!this.container) return;

    // LLM section toggle
    const llmToggle = this.container.querySelector('#llm-toggle');
    llmToggle?.addEventListener('click', () => this.toggleLLM());

    // Resources section toggle
    const resourcesToggle = this.container.querySelector('#resources-toggle');
    resourcesToggle?.addEventListener('click', () => this.toggleResources());

    // T051: Keyboard navigation
    const toggles = this.container.querySelectorAll('.resources-section-toggle');
    toggles.forEach((toggle) => {
      toggle.addEventListener('keydown', (e) => {
        const event = e as KeyboardEvent;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          (toggle as HTMLElement).click();
        }
      });
    });

    // Keyboard navigation for resource links
    const links = this.container.querySelectorAll('.resource-link');
    links.forEach((link) => {
      link.addEventListener('keydown', (e) => {
        const event = e as KeyboardEvent;
        if (event.key === 'Enter') {
          (link as HTMLAnchorElement).click();
        }
      });
    });
  }

  private toggleLLM(): void {
    this.isLLMExpanded = !this.isLLMExpanded;
    this.render();
    this.bindEvents();
  }

  private toggleResources(): void {
    this.isResourcesExpanded = !this.isResourcesExpanded;
    this.render();
    this.bindEvents();
  }

  expandLLM(): void {
    if (!this.isLLMExpanded) {
      this.toggleLLM();
    }
  }

  expandResources(): void {
    if (!this.isResourcesExpanded) {
      this.toggleResources();
    }
  }
}
