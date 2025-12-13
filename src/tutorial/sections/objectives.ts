// T012: Section 1 (Objectives) - XOR problem introduction and learning objectives
// This section introduces what neural networks are and the XOR problem

import type { TutorialStateManager } from '../state';

/**
 * ObjectivesSection manages the first tutorial section content
 * Displays XOR problem explanation and learning objectives
 */
export class ObjectivesSection {
  private container: HTMLElement | null;

  constructor(containerId: string = 'section-objectives') {
    this.container = document.getElementById(containerId);
  }

  /**
   * Initialize the section with tutorial state reference
   */
  initialize(_tutorialState: TutorialStateManager): void {
    // Content is static in HTML, no dynamic initialization needed
    // State reference kept for API consistency with other sections
  }

  /**
   * Called when section becomes active (scrolled into view)
   */
  onActivate(): void {
    // Section 1 has no interactive elements that need activation
    // The content is purely informational
  }

  /**
   * Called when section is scrolled away from
   */
  onDeactivate(): void {
    // No cleanup needed for static content
  }

  /**
   * Get the section container element
   */
  getElement(): HTMLElement | null {
    return this.container;
  }
}
