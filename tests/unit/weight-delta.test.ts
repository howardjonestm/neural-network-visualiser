// T006-T007: Unit tests for WeightDeltaTracker
import { describe, it, expect, beforeEach } from 'vitest';
import {
  WeightDeltaTracker,
  getDeltaMagnitude,
} from '../../src/visualisation/weight-delta';
import type { Weight } from '../../src/network/types';

// Helper to create mock weights
function createMockWeights(values: number[]): Weight[] {
  return values.map((value, index) => ({
    id: `w${index}`,
    fromNeuronId: `n${index}`,
    toNeuronId: `n${index + 1}`,
    value,
    gradient: 0,
  }));
}

describe('getDeltaMagnitude', () => {
  // T007: Unit tests for magnitude classification thresholds

  it('returns "none" for delta < 0.001', () => {
    expect(getDeltaMagnitude(0)).toBe('none');
    expect(getDeltaMagnitude(0.0001)).toBe('none');
    expect(getDeltaMagnitude(0.0009)).toBe('none');
    expect(getDeltaMagnitude(-0.0005)).toBe('none');
  });

  it('returns "small" for 0.001 ≤ |delta| < 0.01', () => {
    expect(getDeltaMagnitude(0.001)).toBe('small');
    expect(getDeltaMagnitude(0.005)).toBe('small');
    expect(getDeltaMagnitude(0.009)).toBe('small');
    expect(getDeltaMagnitude(-0.005)).toBe('small');
  });

  it('returns "medium" for 0.01 ≤ |delta| < 0.1', () => {
    expect(getDeltaMagnitude(0.01)).toBe('medium');
    expect(getDeltaMagnitude(0.05)).toBe('medium');
    expect(getDeltaMagnitude(0.099)).toBe('medium');
    expect(getDeltaMagnitude(-0.05)).toBe('medium');
  });

  it('returns "large" for |delta| ≥ 0.1', () => {
    expect(getDeltaMagnitude(0.1)).toBe('large');
    expect(getDeltaMagnitude(0.5)).toBe('large');
    expect(getDeltaMagnitude(1.0)).toBe('large');
    expect(getDeltaMagnitude(-0.25)).toBe('large');
  });

  it('handles negative deltas correctly', () => {
    // Negative deltas should be classified by absolute value
    expect(getDeltaMagnitude(-0.0005)).toBe('none');
    expect(getDeltaMagnitude(-0.005)).toBe('small');
    expect(getDeltaMagnitude(-0.05)).toBe('medium');
    expect(getDeltaMagnitude(-0.5)).toBe('large');
  });
});

describe('WeightDeltaTracker', () => {
  let tracker: WeightDeltaTracker;

  beforeEach(() => {
    tracker = new WeightDeltaTracker();
  });

  describe('captureSnapshot', () => {
    it('stores weight values', () => {
      const weights = createMockWeights([0.5, -0.3, 0.8]);
      tracker.captureSnapshot(weights);

      // Verify by computing deltas with same values (should be zero)
      const deltas = tracker.computeDeltas(weights);
      expect(deltas.size).toBe(3);
      for (const delta of deltas.values()) {
        expect(delta.delta).toBe(0);
      }
    });

    it('updates history buffer', () => {
      const weights = createMockWeights([0.5]);
      tracker.captureSnapshot(weights);

      const history = tracker.getHistory('w0');
      expect(history).toEqual([0.5]);
    });
  });

  describe('computeDeltas', () => {
    // T006: Unit tests for WeightDeltaTracker.computeDeltas()

    it('returns correct deltas after training step', () => {
      // Initial snapshot - use values that avoid floating point issues
      const weightsBefore = createMockWeights([0.0, -0.5, 1.0]);
      tracker.captureSnapshot(weightsBefore);

      // Simulate training - weights changed
      const weightsAfter = createMockWeights([0.2, -0.45, 0.95]);
      const deltas = tracker.computeDeltas(weightsAfter);

      expect(deltas.size).toBe(3);

      const d0 = deltas.get('w0');
      expect(d0).toBeDefined();
      expect(d0!.previousValue).toBe(0.0);
      expect(d0!.currentValue).toBe(0.2);
      expect(d0!.delta).toBeCloseTo(0.2, 5);
      // 0.2 is clearly 'large' (>= 0.1)
      expect(d0!.magnitude).toBe('large');

      const d1 = deltas.get('w1');
      expect(d1!.delta).toBeCloseTo(0.05, 5);
      expect(d1!.magnitude).toBe('medium');

      const d2 = deltas.get('w2');
      expect(d2!.delta).toBeCloseTo(-0.05, 5);
      expect(d2!.magnitude).toBe('medium');
    });

    it('returns empty map before first snapshot', () => {
      const weights = createMockWeights([0.5, -0.3]);
      const deltas = tracker.computeDeltas(weights);

      expect(deltas.size).toBe(0);
    });

    it('handles zero delta correctly', () => {
      const weights = createMockWeights([0.5]);
      tracker.captureSnapshot(weights);

      // Same value - no change
      const deltas = tracker.computeDeltas(weights);
      const d = deltas.get('w0');

      expect(d!.delta).toBe(0);
      expect(d!.magnitude).toBe('none');
    });

    it('assigns correct weightId to each delta', () => {
      const weights = createMockWeights([0.1, 0.2, 0.3]);
      tracker.captureSnapshot(weights);

      const weightsAfter = createMockWeights([0.2, 0.3, 0.4]);
      const deltas = tracker.computeDeltas(weightsAfter);

      expect(deltas.get('w0')!.weightId).toBe('w0');
      expect(deltas.get('w1')!.weightId).toBe('w1');
      expect(deltas.get('w2')!.weightId).toBe('w2');
    });
  });

  describe('getHistory', () => {
    it('returns empty array for unknown weight', () => {
      const history = tracker.getHistory('nonexistent');
      expect(history).toEqual([]);
    });

    it('accumulates values over multiple snapshots', () => {
      // Take 5 snapshots with integer values to avoid floating point issues
      for (let i = 1; i <= 5; i++) {
        const weights = createMockWeights([i]);
        tracker.captureSnapshot(weights);
      }

      const history = tracker.getHistory('w0');
      expect(history).toEqual([1, 2, 3, 4, 5]);
    });

    it('limits history to historyDepth (default 10)', () => {
      // Take 15 snapshots
      for (let i = 1; i <= 15; i++) {
        const weights = createMockWeights([i * 0.1]);
        tracker.captureSnapshot(weights);
      }

      const history = tracker.getHistory('w0');
      expect(history.length).toBe(10);
      // Should have values 6-15 (oldest values evicted)
      expect(history[0]).toBeCloseTo(0.6, 10);
      expect(history[9]).toBeCloseTo(1.5, 10);
    });

    it('respects custom historyDepth', () => {
      const customTracker = new WeightDeltaTracker(5);

      // Take 8 snapshots
      for (let i = 1; i <= 8; i++) {
        const weights = createMockWeights([i * 0.1]);
        customTracker.captureSnapshot(weights);
      }

      const history = customTracker.getHistory('w0');
      expect(history.length).toBe(5);
      // Should have values 4-8
      expect(history[0]).toBeCloseTo(0.4, 10);
      expect(history[4]).toBeCloseTo(0.8, 10);
    });
  });

  describe('clear', () => {
    it('resets all tracking data', () => {
      // Build up some state
      const weights = createMockWeights([0.5, -0.3]);
      tracker.captureSnapshot(weights);
      tracker.captureSnapshot(weights);

      // Clear
      tracker.clear();

      // History should be empty
      expect(tracker.getHistory('w0')).toEqual([]);

      // Deltas should be empty (no previous values)
      const deltas = tracker.computeDeltas(weights);
      expect(deltas.size).toBe(0);
    });
  });

  describe('ring buffer behavior', () => {
    // T032: Unit tests for history ring buffer (max 10 entries)

    it('maintains FIFO order in ring buffer', () => {
      // Fill buffer exactly
      for (let i = 1; i <= 10; i++) {
        tracker.captureSnapshot(createMockWeights([i]));
      }

      let history = tracker.getHistory('w0');
      expect(history).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

      // Add one more - oldest should be evicted
      tracker.captureSnapshot(createMockWeights([11]));
      history = tracker.getHistory('w0');
      expect(history).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    });

    it('handles multiple weights independently', () => {
      // Snapshot with two weights using integer values to avoid floating point issues
      for (let i = 1; i <= 3; i++) {
        tracker.captureSnapshot(createMockWeights([i * 10, i * 20]));
      }

      const history0 = tracker.getHistory('w0');
      const history1 = tracker.getHistory('w1');

      expect(history0).toEqual([10, 20, 30]);
      expect(history1).toEqual([20, 40, 60]);
    });
  });
});
