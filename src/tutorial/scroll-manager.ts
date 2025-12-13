// Scroll Manager
// IntersectionObserver-based scroll detection for tutorial sections

import type { SectionId, SectionCallback, TutorialSection } from './types';
import { SECTION_IDS } from './types';

/**
 * Configuration options for ScrollManager
 */
export interface ScrollManagerOptions {
  /** Callback when a section enters the viewport */
  onSectionEnter?: SectionCallback;
  /** Callback when a section exits the viewport */
  onSectionExit?: SectionCallback;
  /** Callback when a section becomes the active (primary) section */
  onSectionActivate?: SectionCallback;
  /** IntersectionObserver threshold values (default: [0, 0.5, 1.0]) */
  threshold?: number[];
  /** IntersectionObserver root margin (default: "-10% 0px") */
  rootMargin?: string;
}

/**
 * Manages scroll-based section detection using IntersectionObserver.
 * Tracks which sections are visible and which is the "active" section.
 */
export class ScrollManager {
  private observer: IntersectionObserver;
  private sections: Map<SectionId, TutorialSection> = new Map();
  private visibleSections: Set<SectionId> = new Set();
  private activeSection: SectionId | null = null;
  private options: ScrollManagerOptions;
  private activationDebounceTimeout: number | null = null;
  private pendingActiveSection: SectionId | null = null;

  // T057: Debounce delay for section activation during rapid scrolling
  private static readonly ACTIVATION_DEBOUNCE_MS = 100;

  constructor(options: ScrollManagerOptions = {}) {
    this.options = options;

    const observerOptions: IntersectionObserverInit = {
      root: null, // viewport
      threshold: options.threshold ?? [0, 0.25, 0.5, 0.75, 1.0],
      rootMargin: options.rootMargin ?? '-10% 0px',
    };

    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      observerOptions
    );
  }

  /**
   * Register a section element to be observed
   */
  observe(element: HTMLElement, sectionId: SectionId): void {
    const section: TutorialSection = {
      id: sectionId,
      element,
      isVisible: false,
      isActive: false,
    };

    this.sections.set(sectionId, section);
    element.dataset.sectionId = sectionId;
    this.observer.observe(element);
  }

  /**
   * Register a section with activation/deactivation callbacks
   */
  registerSection(
    element: HTMLElement,
    sectionId: SectionId,
    onActivate?: () => void,
    onDeactivate?: () => void
  ): void {
    const section: TutorialSection = {
      id: sectionId,
      element,
      isVisible: false,
      isActive: false,
      onActivate,
      onDeactivate,
    };

    this.sections.set(sectionId, section);
    element.dataset.sectionId = sectionId;
    this.observer.observe(element);
  }

  /**
   * Stop observing a section
   */
  unobserve(sectionId: SectionId): void {
    const section = this.sections.get(sectionId);
    if (section) {
      this.observer.unobserve(section.element);
      this.sections.delete(sectionId);
      this.visibleSections.delete(sectionId);
    }
  }

  /**
   * Handle intersection events from the observer
   */
  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    // Track visibility ratios for determining active section
    const ratios = new Map<SectionId, number>();

    // Process each entry
    for (const entry of entries) {
      const target = entry.target as HTMLElement;
      const sectionId = target.dataset.sectionId as SectionId;
      if (!sectionId) continue;

      const section = this.sections.get(sectionId);
      if (!section) continue;

      const wasVisible = section.isVisible;
      section.isVisible = entry.isIntersecting;

      // Track entering/exiting
      if (entry.isIntersecting && !wasVisible) {
        this.visibleSections.add(sectionId);
        this.options.onSectionEnter?.(sectionId);
      } else if (!entry.isIntersecting && wasVisible) {
        this.visibleSections.delete(sectionId);
        this.options.onSectionExit?.(sectionId);
        section.onDeactivate?.();
      }

      // Store ratio for active section calculation
      if (entry.isIntersecting) {
        ratios.set(sectionId, entry.intersectionRatio);
      }
    }

    // Determine active section (highest visibility ratio)
    this.updateActiveSection(ratios);
  }

  /**
   * T057: Determine which section should be "active" based on visibility
   * Uses debouncing to prevent rapid activation changes during fast scrolling
   */
  private updateActiveSection(ratios: Map<SectionId, number>): void {
    // Get all visible sections with their ratios
    const visibleWithRatios: Array<[SectionId, number]> = [];

    for (const sectionId of this.visibleSections) {
      const ratio = ratios.get(sectionId);
      if (ratio !== undefined) {
        visibleWithRatios.push([sectionId, ratio]);
      } else {
        // Section is visible but not in current entries - keep existing ratio
        const section = this.sections.get(sectionId);
        if (section?.isVisible) {
          visibleWithRatios.push([sectionId, 0.5]); // Default assumption
        }
      }
    }

    if (visibleWithRatios.length === 0) {
      return;
    }

    // Find section with highest visibility ratio
    visibleWithRatios.sort((a, b) => b[1] - a[1]);
    const newActiveId = visibleWithRatios[0][0];

    // Check if active section would change
    if (newActiveId !== this.activeSection) {
      // T057: Debounce rapid scrolling
      this.pendingActiveSection = newActiveId;

      if (this.activationDebounceTimeout !== null) {
        window.clearTimeout(this.activationDebounceTimeout);
      }

      this.activationDebounceTimeout = window.setTimeout(() => {
        this.activationDebounceTimeout = null;

        // Re-check if this is still the pending section
        if (this.pendingActiveSection === newActiveId) {
          this.commitActiveSectionChange(newActiveId);
        }
      }, ScrollManager.ACTIVATION_DEBOUNCE_MS);
    }
  }

  /**
   * Actually perform the section activation change
   */
  private commitActiveSectionChange(newActiveId: SectionId): void {
    const previousActive = this.activeSection;
    this.activeSection = newActiveId;
    this.pendingActiveSection = null;

    // Deactivate previous
    if (previousActive) {
      const prevSection = this.sections.get(previousActive);
      if (prevSection) {
        prevSection.isActive = false;
        prevSection.onDeactivate?.();
      }
    }

    // Activate new
    const newSection = this.sections.get(newActiveId);
    if (newSection) {
      newSection.isActive = true;
      newSection.onActivate?.();
      this.options.onSectionActivate?.(newActiveId);
    }
  }

  /**
   * Get the currently active section ID
   */
  getActiveSection(): SectionId | null {
    return this.activeSection;
  }

  /**
   * Get all currently visible section IDs
   */
  getVisibleSections(): SectionId[] {
    return Array.from(this.visibleSections);
  }

  /**
   * Check if a specific section is visible
   */
  isSectionVisible(sectionId: SectionId): boolean {
    return this.visibleSections.has(sectionId);
  }

  /**
   * Scroll to a specific section
   */
  scrollToSection(sectionId: SectionId, behavior: ScrollBehavior = 'smooth'): void {
    const section = this.sections.get(sectionId);
    if (section) {
      section.element.scrollIntoView({ behavior, block: 'start' });
    }
  }

  /**
   * Get section index (0-based) for progress calculations
   */
  getSectionIndex(sectionId: SectionId): number {
    return SECTION_IDS.indexOf(sectionId);
  }

  /**
   * Disconnect the observer and clean up
   */
  destroy(): void {
    // Clear any pending debounce
    if (this.activationDebounceTimeout !== null) {
      window.clearTimeout(this.activationDebounceTimeout);
      this.activationDebounceTimeout = null;
    }

    this.observer.disconnect();
    this.sections.clear();
    this.visibleSections.clear();
    this.activeSection = null;
    this.pendingActiveSection = null;
  }
}
