// T002: Weight Delta Types and Tracker
// Provides weight change tracking for training visualization

import type { Weight } from '../network/types';

/**
 * Magnitude classification for weight changes
 * Used to determine visual intensity of weight change highlights
 */
export type DeltaMagnitude = 'none' | 'small' | 'medium' | 'large';

/**
 * T003: Direction of weight change for gradient visualization
 */
export type WeightDirection = 'increasing' | 'decreasing' | 'stable';

/**
 * T010: Represents the change in a single weight between training steps
 * Extended with direction field for gradient visualization
 */
export interface WeightDelta {
  weightId: string;
  previousValue: number;
  currentValue: number;
  delta: number;
  magnitude: DeltaMagnitude;
  /** T010: Direction of weight change */
  direction: WeightDirection;
}

/**
 * Thresholds for delta magnitude classification
 * Based on typical weight changes during backpropagation
 */
const MAGNITUDE_THRESHOLDS = {
  none: 0.001,
  small: 0.01,
  medium: 0.1,
} as const;

/**
 * Classify a delta value into a magnitude category
 * @param delta - The change in weight value
 * @returns The magnitude classification
 */
export function getDeltaMagnitude(delta: number): DeltaMagnitude {
  const absDelta = Math.abs(delta);

  if (absDelta < MAGNITUDE_THRESHOLDS.none) {
    return 'none';
  }
  if (absDelta < MAGNITUDE_THRESHOLDS.small) {
    return 'small';
  }
  if (absDelta < MAGNITUDE_THRESHOLDS.medium) {
    return 'medium';
  }
  return 'large';
}

/**
 * T009: Determine the direction of weight change
 * @param delta - The change in weight value
 * @returns The direction classification
 */
export function getDirection(delta: number): WeightDirection {
  if (Math.abs(delta) < MAGNITUDE_THRESHOLDS.none) {
    return 'stable';
  }
  return delta > 0 ? 'increasing' : 'decreasing';
}

/**
 * Tracks weight changes across training steps
 * Provides delta computation and history storage for visualization
 */
export class WeightDeltaTracker {
  private previousValues: Map<string, number> = new Map();
  private history: Map<string, number[]> = new Map();
  private readonly historyDepth: number;

  constructor(historyDepth: number = 10) {
    this.historyDepth = historyDepth;
  }

  /**
   * Capture current weight values as the "previous" state
   * Call this BEFORE running a training step
   * @param weights - Current network weights
   */
  captureSnapshot(weights: Weight[]): void {
    for (const weight of weights) {
      this.previousValues.set(weight.id, weight.value);

      // Push to history buffer
      let weightHistory = this.history.get(weight.id);
      if (!weightHistory) {
        weightHistory = [];
        this.history.set(weight.id, weightHistory);
      }

      weightHistory.push(weight.value);

      // Maintain ring buffer size
      if (weightHistory.length > this.historyDepth) {
        weightHistory.shift();
      }
    }
  }

  /**
   * T011: Compute deltas between previous snapshot and current weights
   * Call this AFTER running a training step
   * @param weights - Current network weights (after training)
   * @returns Map of weight ID to delta information (including direction)
   */
  computeDeltas(weights: Weight[]): Map<string, WeightDelta> {
    const deltas = new Map<string, WeightDelta>();

    for (const weight of weights) {
      const previousValue = this.previousValues.get(weight.id);

      // Skip if no previous value (first step)
      if (previousValue === undefined) {
        continue;
      }

      const delta = weight.value - previousValue;
      const magnitude = getDeltaMagnitude(delta);
      const direction = getDirection(delta);

      deltas.set(weight.id, {
        weightId: weight.id,
        previousValue,
        currentValue: weight.value,
        delta,
        magnitude,
        direction,
      });
    }

    return deltas;
  }

  /**
   * Get historical values for a specific weight
   * @param weightId - The ID of the weight
   * @returns Array of recent values (oldest first), or empty array if not found
   */
  getHistory(weightId: string): number[] {
    return this.history.get(weightId) ?? [];
  }

  /**
   * Reset all tracking data
   * Call this when the network is reset
   */
  clear(): void {
    this.previousValues.clear();
    this.history.clear();
  }
}
