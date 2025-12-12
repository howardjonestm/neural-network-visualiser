// Educational Content Type Definitions

export type HintPosition = 'top' | 'bottom' | 'left' | 'right';
export type HintTrigger = 'load' | 'first-interaction' | 'hover';

export interface Hint {
  id: string;
  targetSelector: string;
  title: string;
  content: string;
  position: HintPosition;
  triggerEvent: HintTrigger;
  showOnce: boolean;
}

export interface HintState {
  dismissedHints: Record<string, boolean>;
  lastResetDate: string | null;
}

export type LegendCategory = 'neurons' | 'weights' | 'layers' | 'training';

export interface LegendVisual {
  type: 'circle' | 'line' | 'gradient' | 'color-swatch';
  properties: Record<string, string | number | boolean>;
}

export interface LegendItem {
  id: string;
  category: LegendCategory;
  label: string;
  description: string;
  visualSample: LegendVisual;
}

export type TrendDirection = 'improving' | 'worsening' | 'stable' | 'converged';

export interface LossTrend {
  direction: TrendDirection;
  currentLoss: number;
  previousLoss: number;
  changeThreshold: number;
}

export type ResourceType = 'video' | 'interactive' | 'article' | 'book' | 'reference';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface LearningResource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: ResourceType;
  difficulty: Difficulty;
}

export interface ContentSection {
  heading: string;
  body: string;
  emphasis?: string;
}

export interface EducationalContent {
  id: string;
  title: string;
  sections: ContentSection[];
}
