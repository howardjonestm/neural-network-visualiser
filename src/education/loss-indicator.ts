// T035, T036: Loss trend indicator component

import type { LossTrend, TrendDirection } from './types';

export interface LossTrendConfig {
  changeThreshold: number;
  convergedThreshold: number;  // Loss below this is considered "converged"
}

const DEFAULT_CONFIG: LossTrendConfig = {
  changeThreshold: 0.001,
  convergedThreshold: 0.01,  // Loss below 0.01 = network has converged
};

// T035: Compute loss trend
export function computeLossTrend(
  currentLoss: number,
  previousLoss: number,
  config: LossTrendConfig = DEFAULT_CONFIG
): LossTrend {
  let direction: TrendDirection;

  // Check for convergence first (loss below threshold)
  if (currentLoss < config.convergedThreshold) {
    direction = 'converged';
  } else {
    const diff = currentLoss - previousLoss;
    if (Math.abs(diff) < config.changeThreshold) {
      direction = 'stable';
    } else if (diff < 0) {
      direction = 'improving';
    } else {
      direction = 'worsening';
    }
  }

  return {
    direction,
    currentLoss,
    previousLoss,
    changeThreshold: config.changeThreshold,
  };
}

// T036: Traffic light indicator UI
export function renderLossTrendIndicator(trend: LossTrend): string {
  const indicators: Record<TrendDirection, { symbol: string; label: string; class: string }> = {
    improving: { symbol: '↓', label: 'Getting better', class: 'trend-improving' },
    worsening: { symbol: '↑', label: 'Getting worse', class: 'trend-worsening' },
    stable: { symbol: '—', label: 'No change', class: 'trend-stable' },
    converged: { symbol: '✓', label: 'Converged!', class: 'trend-converged' },
  };

  const { symbol, label, class: className } = indicators[trend.direction];

  return `<span class="loss-trend ${className}" aria-label="${label}" title="${label}">${symbol}</span>`;
}

export class LossTrendDisplay {
  private container: HTMLElement | null = null;
  private config: LossTrendConfig;

  constructor(containerId: string, config: LossTrendConfig = DEFAULT_CONFIG) {
    this.container = document.getElementById(containerId);
    this.config = config;
  }

  update(currentLoss: number, previousLoss: number): void {
    if (!this.container) return;

    const trend = computeLossTrend(currentLoss, previousLoss, this.config);
    this.container.innerHTML = renderLossTrendIndicator(trend);
  }

  clear(): void {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}
