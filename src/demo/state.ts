// Demo State Machine
// Manages the state of the forward pass demonstration

import type {
  DemoState,
  DemoSpeed,
  DemoStep,
  XORInput,
  DemoStateListener,
} from './types';
import { DEFAULT_DEMO_STATE } from './types';

/**
 * T007-T009: Demo state machine with transitions and listener pattern
 */
export class DemoStateMachine {
  private state: DemoState;
  private listeners: DemoStateListener[] = [];

  constructor() {
    this.state = { ...DEFAULT_DEMO_STATE };
  }

  // T009: Subscribe to state changes
  subscribe(listener: DemoStateListener): () => void {
    this.listeners.push(listener);
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // T009: Notify all listeners of state change
  private notify(): void {
    const stateCopy = this.getState();
    this.listeners.forEach((listener) => listener(stateCopy));
  }

  // T008: Get current state (immutable copy)
  getState(): DemoState {
    return {
      ...this.state,
      selectedInput: [...this.state.selectedInput] as XORInput,
      steps: [...this.state.steps],
    };
  }

  // T008: Start demo (idle -> running)
  startDemo(steps: DemoStep[], interruptedTraining: boolean = false): boolean {
    // T068: Ignore if already running
    if (this.state.mode !== 'idle') {
      return false;
    }

    this.state = {
      ...this.state,
      mode: 'running',
      currentStepIndex: 0,
      totalSteps: steps.length,
      steps: [...steps],
      interruptedTraining,
    };
    this.notify();
    return true;
  }

  // T008: Cancel demo (any -> idle)
  cancel(): void {
    const wasRunning = this.state.mode !== 'idle';
    this.state = {
      ...DEFAULT_DEMO_STATE,
      selectedInput: [...this.state.selectedInput] as XORInput,
      speed: this.state.speed,
      interruptedTraining: wasRunning ? this.state.interruptedTraining : false,
    };
    this.notify();
  }

  // T030: Set input selection
  setInput(input: XORInput): void {
    if (this.state.mode !== 'idle') {
      return; // Can only change input when idle
    }
    this.state = {
      ...this.state,
      selectedInput: [...input] as XORInput,
    };
    this.notify();
  }

  // T034: Next step (step-through mode)
  nextStep(): boolean {
    if (this.state.mode === 'idle') {
      // Start step-through mode
      return false; // Caller needs to call startStepThrough first
    }

    if (
      this.state.mode === 'step-through' ||
      this.state.mode === 'paused'
    ) {
      if (this.state.currentStepIndex < this.state.totalSteps - 1) {
        this.state = {
          ...this.state,
          mode: 'step-through',
          currentStepIndex: this.state.currentStepIndex + 1,
        };
        this.notify();
        return true;
      } else {
        // At final step, complete the demo
        this.complete();
        return false;
      }
    }
    return false;
  }

  // T034: Previous step
  prevStep(): boolean {
    if (this.state.mode === 'step-through' || this.state.mode === 'paused') {
      if (this.state.currentStepIndex > 0) {
        this.state = {
          ...this.state,
          mode: 'step-through',
          currentStepIndex: this.state.currentStepIndex - 1,
        };
        this.notify();
        return true;
      }
    }
    return false;
  }

  // T035: Start step-through mode
  startStepThrough(steps: DemoStep[], interruptedTraining: boolean = false): boolean {
    if (this.state.mode !== 'idle') {
      return false;
    }

    this.state = {
      ...this.state,
      mode: 'step-through',
      currentStepIndex: 0,
      totalSteps: steps.length,
      steps: [...steps],
      interruptedTraining,
    };
    this.notify();
    return true;
  }

  // T043: Pause (running -> paused)
  pause(): boolean {
    if (this.state.mode === 'running') {
      this.state = {
        ...this.state,
        mode: 'paused',
      };
      this.notify();
      return true;
    }
    return false;
  }

  // T043: Resume (paused -> running)
  resume(): boolean {
    if (this.state.mode === 'paused') {
      this.state = {
        ...this.state,
        mode: 'running',
      };
      this.notify();
      return true;
    }
    return false;
  }

  // Advance to next step during running mode
  advanceStep(): boolean {
    if (this.state.mode === 'running') {
      if (this.state.currentStepIndex < this.state.totalSteps - 1) {
        this.state = {
          ...this.state,
          currentStepIndex: this.state.currentStepIndex + 1,
        };
        this.notify();
        return true;
      } else {
        // Demo complete
        this.complete();
        return false;
      }
    }
    return false;
  }

  // Complete the demo (running/step-through -> idle)
  complete(): void {
    this.state = {
      ...DEFAULT_DEMO_STATE,
      selectedInput: [...this.state.selectedInput] as XORInput,
      speed: this.state.speed,
      interruptedTraining: this.state.interruptedTraining,
    };
    this.notify();
  }

  // Set speed
  setSpeed(speed: DemoSpeed): void {
    this.state = {
      ...this.state,
      speed,
    };
    this.notify();
  }

  // Check if demo is active (not idle)
  isActive(): boolean {
    return this.state.mode !== 'idle';
  }

  // Check if demo was interrupted by training
  wasTrainingInterrupted(): boolean {
    return this.state.interruptedTraining;
  }

  // Clear the interrupted training flag
  clearInterruptedTraining(): void {
    this.state = {
      ...this.state,
      interruptedTraining: false,
    };
  }

  // Get current step
  getCurrentStep(): DemoStep | null {
    if (this.state.steps.length === 0) {
      return null;
    }
    return this.state.steps[this.state.currentStepIndex] || null;
  }
}

// Singleton instance for app-wide use
let demoStateMachine: DemoStateMachine | null = null;

export function getDemoStateMachine(): DemoStateMachine {
  if (!demoStateMachine) {
    demoStateMachine = new DemoStateMachine();
  }
  return demoStateMachine;
}

export function resetDemoStateMachine(): void {
  demoStateMachine = new DemoStateMachine();
}
