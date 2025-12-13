// Demo Controls
// UI components for forward pass demonstration

import type { DemoState, DemoSpeed, XORInput } from './types';
import { XOR_INPUTS, XOR_EXPECTED, SPEED_CONFIGS } from './types';

/**
 * T014: Create DemoButton component
 */
export function createDemoButton(
  container: HTMLElement,
  onClick: () => void
): HTMLButtonElement {
  const button = document.createElement('button');
  button.id = 'demo-btn';
  button.className = 'control-btn demo-btn';
  button.textContent = 'Demo';
  button.setAttribute('aria-label', 'Start forward pass demonstration');
  button.addEventListener('click', onClick);
  container.appendChild(button);
  return button;
}

/**
 * T026: Create InputSelector dropdown
 */
export function createInputSelector(
  container: HTMLElement,
  onChange: (input: XORInput) => void,
  initialInput: XORInput = [0, 0]
): HTMLSelectElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'input-selector-wrapper';

  const label = document.createElement('label');
  label.htmlFor = 'xor-input-select';
  label.textContent = 'Input: ';
  label.className = 'input-selector-label';

  const select = document.createElement('select');
  select.id = 'xor-input-select';
  select.className = 'input-selector';
  select.setAttribute('aria-label', 'Select XOR input pair');

  XOR_INPUTS.forEach((input) => {
    const option = document.createElement('option');
    option.value = input.join(',');
    option.textContent = `[${input[0]}, ${input[1]}]`;
    if (input[0] === initialInput[0] && input[1] === initialInput[1]) {
      option.selected = true;
    }
    select.appendChild(option);
  });

  select.addEventListener('change', () => {
    const [a, b] = select.value.split(',').map(Number);
    onChange([a, b] as XORInput);
  });

  wrapper.appendChild(label);
  wrapper.appendChild(select);
  container.appendChild(wrapper);

  return select;
}

/**
 * T029: Create expected output display
 */
export function createExpectedOutput(
  container: HTMLElement,
  initialInput: XORInput = [0, 0]
): HTMLSpanElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'expected-output-wrapper';

  const label = document.createElement('span');
  label.textContent = 'Expected: ';
  label.className = 'expected-output-label';

  const value = document.createElement('span');
  value.id = 'expected-output-value';
  value.className = 'expected-output-value';
  value.textContent = String(XOR_EXPECTED[initialInput.join(',')]);

  wrapper.appendChild(label);
  wrapper.appendChild(value);
  container.appendChild(wrapper);

  return value;
}

/**
 * Update expected output display
 */
export function updateExpectedOutput(element: HTMLSpanElement, input: XORInput): void {
  element.textContent = String(XOR_EXPECTED[input.join(',')]);
}

/**
 * T036: Create StepControls (Next, Previous buttons)
 */
export function createStepControls(
  container: HTMLElement,
  onNext: () => void,
  onPrev: () => void
): { nextBtn: HTMLButtonElement; prevBtn: HTMLButtonElement } {
  const wrapper = document.createElement('div');
  wrapper.className = 'step-controls';

  const prevBtn = document.createElement('button');
  prevBtn.id = 'demo-prev-btn';
  prevBtn.className = 'control-btn step-btn';
  prevBtn.textContent = '← Prev';
  prevBtn.setAttribute('aria-label', 'Previous step');
  prevBtn.disabled = true;
  prevBtn.addEventListener('click', onPrev);

  const nextBtn = document.createElement('button');
  nextBtn.id = 'demo-next-btn';
  nextBtn.className = 'control-btn step-btn';
  nextBtn.textContent = 'Next →';
  nextBtn.setAttribute('aria-label', 'Next step');
  nextBtn.addEventListener('click', onNext);

  wrapper.appendChild(prevBtn);
  wrapper.appendChild(nextBtn);
  container.appendChild(wrapper);

  return { nextBtn, prevBtn };
}

/**
 * T039: Create StepIndicator ("Step 2 of 5")
 */
export function createStepIndicator(container: HTMLElement): HTMLSpanElement {
  const indicator = document.createElement('span');
  indicator.id = 'step-indicator';
  indicator.className = 'step-indicator';
  indicator.textContent = '';
  indicator.setAttribute('aria-live', 'polite');
  container.appendChild(indicator);
  return indicator;
}

/**
 * Update step indicator display
 */
export function updateStepIndicator(
  element: HTMLSpanElement,
  currentStep: number,
  totalSteps: number,
  layerLabel: string
): void {
  element.textContent = `Step ${currentStep + 1} of ${totalSteps}: ${layerLabel}`;
}

/**
 * T045: Create SpeedSelector (slow/medium/fast)
 */
export function createSpeedSelector(
  container: HTMLElement,
  onChange: (speed: DemoSpeed) => void,
  initialSpeed: DemoSpeed = 'medium'
): HTMLDivElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'speed-selector';

  const label = document.createElement('span');
  label.textContent = 'Speed: ';
  label.className = 'speed-label';
  wrapper.appendChild(label);

  const speeds: DemoSpeed[] = ['slow', 'medium', 'fast'];
  speeds.forEach((speed) => {
    const btn = document.createElement('button');
    btn.className = `speed-btn ${speed === initialSpeed ? 'active' : ''}`;
    btn.textContent = SPEED_CONFIGS[speed].label;
    btn.setAttribute('aria-label', `Set speed to ${speed}`);
    btn.setAttribute('data-speed', speed);
    btn.addEventListener('click', () => {
      // Remove active class from all
      wrapper.querySelectorAll('.speed-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      onChange(speed);
    });
    wrapper.appendChild(btn);
  });

  container.appendChild(wrapper);
  return wrapper;
}

/**
 * T048: Create PauseResumeButton
 */
export function createPauseResumeButton(
  container: HTMLElement,
  onPause: () => void,
  onResume: () => void
): HTMLButtonElement {
  const button = document.createElement('button');
  button.id = 'demo-pause-btn';
  button.className = 'control-btn pause-btn';
  button.textContent = 'Pause';
  button.setAttribute('aria-label', 'Pause demonstration');
  button.style.display = 'none';

  let isPaused = false;
  button.addEventListener('click', () => {
    if (isPaused) {
      onResume();
      button.textContent = 'Pause';
      button.setAttribute('aria-label', 'Pause demonstration');
      isPaused = false;
    } else {
      onPause();
      button.textContent = 'Resume';
      button.setAttribute('aria-label', 'Resume demonstration');
      isPaused = true;
    }
  });

  container.appendChild(button);
  return button;
}

/**
 * Update pause button state
 */
export function updatePauseButton(button: HTMLButtonElement, isPaused: boolean): void {
  if (isPaused) {
    button.textContent = 'Resume';
    button.setAttribute('aria-label', 'Resume demonstration');
  } else {
    button.textContent = 'Pause';
    button.setAttribute('aria-label', 'Pause demonstration');
  }
}

/**
 * T024: Create prominent prediction result card for US4
 */
export function createPredictionDisplay(container: HTMLElement): HTMLDivElement {
  const wrapper = document.createElement('div');
  wrapper.id = 'prediction-display';
  wrapper.className = 'prediction-result-card';
  wrapper.style.display = 'none';
  container.appendChild(wrapper);
  return wrapper;
}

/**
 * T024, T025: Update prominent prediction display after demo completion
 * Shows Expected vs Predicted side-by-side with color coding
 * 009: Enhanced to be much more prominent with bold styling
 */
export function updatePredictionDisplay(
  element: HTMLDivElement,
  prediction: number,
  expected: number,
  show: boolean
): void {
  if (!show) {
    element.style.display = 'none';
    return;
  }

  const predictedClass = prediction >= 0.5 ? 1 : 0;
  const isCorrect = predictedClass === expected;
  const statusClass = isCorrect ? 'correct' : 'incorrect';

  // 009: Much more prominent prediction display with large bold text
  element.innerHTML = `
    <div class="prominent-prediction-card ${statusClass}">
      <div class="prediction-title">Prediction Result</div>
      <div class="prediction-main-value ${statusClass}">
        <span class="output-value">${prediction.toFixed(3)}</span>
        <span class="output-arrow">→</span>
        <span class="output-class">${predictedClass}</span>
      </div>
      <div class="prediction-comparison">
        <span class="expected-label">Expected: <strong>${expected}</strong></span>
        <span class="verdict ${statusClass}">${isCorrect ? '✓ Correct!' : '✗ Incorrect'}</span>
      </div>
    </div>
  `;
  element.style.display = 'block';
}

/**
 * T062: Disable/enable training controls during demo
 */
export function setTrainingControlsEnabled(enabled: boolean): void {
  const controls = ['step-btn', 'play-btn', 'reset-btn'];
  controls.forEach((id) => {
    const el = document.getElementById(id) as HTMLButtonElement | null;
    if (el) {
      el.disabled = !enabled;
      if (!enabled) {
        el.classList.add('disabled-during-demo');
      } else {
        el.classList.remove('disabled-during-demo');
      }
    }
  });
}

/**
 * Update all controls based on demo state
 */
export function updateDemoControls(
  state: DemoState,
  elements: {
    demoBtn?: HTMLButtonElement;
    nextBtn?: HTMLButtonElement;
    prevBtn?: HTMLButtonElement;
    pauseBtn?: HTMLButtonElement;
    stepIndicator?: HTMLSpanElement;
    predictionDisplay?: HTMLDivElement;
  }
): void {
  const { mode, currentStepIndex, totalSteps, steps } = state;
  const isActive = mode !== 'idle';

  // Demo button
  if (elements.demoBtn) {
    elements.demoBtn.disabled = isActive;
    elements.demoBtn.textContent = isActive ? 'Running...' : 'Demo';
  }

  // Step controls
  if (elements.nextBtn) {
    elements.nextBtn.disabled = mode === 'idle' || mode === 'running';
  }
  if (elements.prevBtn) {
    elements.prevBtn.disabled = mode === 'idle' || mode === 'running' || currentStepIndex === 0;
  }

  // Pause button
  if (elements.pauseBtn) {
    elements.pauseBtn.style.display = mode === 'running' || mode === 'paused' ? 'inline-block' : 'none';
    updatePauseButton(elements.pauseBtn, mode === 'paused');
  }

  // Step indicator
  if (elements.stepIndicator && steps.length > 0) {
    const currentStep = steps[currentStepIndex];
    if (currentStep && isActive) {
      updateStepIndicator(elements.stepIndicator, currentStepIndex, totalSteps, currentStep.layerLabel);
    } else {
      elements.stepIndicator.textContent = '';
    }
  }

  // Training controls
  setTrainingControlsEnabled(!isActive);
}
