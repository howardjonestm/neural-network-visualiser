// Static educational content data

import type {
  LegendItem,
  Hint,
  LearningResource,
  EducationalContent,
} from './types';

// T010: Legend data with all LegendItems
export const LEGEND_ITEMS: LegendItem[] = [
  // Neurons category
  {
    id: 'neuron',
    category: 'neurons',
    label: 'Neuron',
    description: 'Processing unit',
    visualSample: {
      type: 'circle',
      properties: { fill: '#f9fafb', stroke: '#374151', strokeWidth: 2 },
    },
  },
  {
    id: 'activation',
    category: 'neurons',
    label: 'Activation',
    description: 'How active (opacity)',
    visualSample: {
      type: 'gradient',
      properties: { from: 0.2, to: 1.0 },
    },
  },

  // Weights category
  {
    id: 'weight-positive',
    category: 'weights',
    label: 'Positive',
    description: 'Strengthens signal',
    visualSample: {
      type: 'line',
      properties: { stroke: '#2563eb', strokeWidth: 3 },
    },
  },
  {
    id: 'weight-negative',
    category: 'weights',
    label: 'Negative',
    description: 'Weakens signal',
    visualSample: {
      type: 'line',
      properties: { stroke: '#dc2626', strokeWidth: 3 },
    },
  },
  {
    id: 'weight-magnitude',
    category: 'weights',
    label: 'Magnitude',
    description: 'Strength (thickness)',
    visualSample: {
      type: 'line',
      properties: { gradient: true, strokeWidthMin: 1, strokeWidthMax: 6 },
    },
  },

  // Layers category
  {
    id: 'layer-input',
    category: 'layers',
    label: 'Input',
    description: 'Receives data',
    visualSample: {
      type: 'color-swatch',
      properties: { label: 'IN', color: '#1f2937' },
    },
  },
  {
    id: 'layer-hidden',
    category: 'layers',
    label: 'Hidden',
    description: 'Processes data',
    visualSample: {
      type: 'color-swatch',
      properties: { label: 'H1-3', color: '#374151' },
    },
  },
  {
    id: 'layer-output',
    category: 'layers',
    label: 'Output',
    description: 'Produces result',
    visualSample: {
      type: 'color-swatch',
      properties: { label: 'OUT', color: '#1f2937' },
    },
  },

  // Training category
  {
    id: 'loss',
    category: 'training',
    label: 'Loss',
    description: 'Error measure (lower = better)',
    visualSample: {
      type: 'color-swatch',
      properties: { label: '0.XXX', color: '#6b7280' },
    },
  },
  {
    id: 'step',
    category: 'training',
    label: 'Step',
    description: 'One learning cycle',
    visualSample: {
      type: 'color-swatch',
      properties: { label: 'N', color: '#6b7280' },
    },
  },
];

// T025: All Hint content data
export const HINTS: Hint[] = [
  // Load-triggered hints
  {
    id: 'hint-network',
    targetSelector: '#network-svg',
    title: 'Your Neural Network',
    content: 'Each circle is a neuron. They process information and pass it forward.',
    position: 'right',
    triggerEvent: 'load',
    showOnce: true,
  },
  {
    id: 'hint-weights',
    targetSelector: '.weight',
    title: 'Connections',
    content: 'Lines are weights. Blue = positive (strengthens), Red = negative (weakens).',
    position: 'bottom',
    triggerEvent: 'load',
    showOnce: true,
  },

  // First-interaction hints
  {
    id: 'hint-step',
    targetSelector: '#step-btn',
    title: 'Training Step',
    content: 'Click to run one training cycle. Watch the weights change!',
    position: 'top',
    triggerEvent: 'first-interaction',
    showOnce: true,
  },
  {
    id: 'hint-play',
    targetSelector: '#play-btn',
    title: 'Continuous Training',
    content: 'Press to train continuously. The network learns from examples.',
    position: 'top',
    triggerEvent: 'first-interaction',
    showOnce: true,
  },
  {
    id: 'hint-loss',
    targetSelector: '#loss-value',
    title: 'Loss Value',
    content: 'Measures how wrong the network is. Lower is better!',
    position: 'left',
    triggerEvent: 'first-interaction',
    showOnce: true,
  },
  {
    id: 'hint-learning-rate',
    targetSelector: '#learning-rate-slider',
    title: 'Learning Rate',
    content: 'How fast the network learns. Too fast = unstable.',
    position: 'top',
    triggerEvent: 'first-interaction',
    showOnce: true,
  },
  {
    id: 'hint-reset',
    targetSelector: '#reset-btn',
    title: 'Reset Network',
    content: 'Start over with new random weights.',
    position: 'top',
    triggerEvent: 'first-interaction',
    showOnce: true,
  },
];

// T040, T043: LLM connection content
export const LLM_CONTENT: EducationalContent = {
  id: 'llm-connection',
  title: 'How This Relates to AI',
  sections: [
    {
      heading: 'Same Building Blocks',
      body: 'LLMs like ChatGPT and Claude use neurons, layers, and weights just like this demo. The fundamental concept of learning by adjusting connections is the same.',
      emphasis: 'This is real neural network math!',
    },
    {
      heading: 'Scale Difference',
      body: 'This network has 12 neurons and 28 weights. GPT-4 has hundreds of billions of parameters. The principles are identical, just at vastly different scales.',
      emphasis: '12 neurons vs 175+ billion',
    },
    {
      heading: 'Training Similarity',
      body: 'Both learn by adjusting weights to reduce loss. This demo uses backpropagation on XOR data. LLMs use the same algorithm on massive text datasets.',
    },
    {
      heading: 'Key Differences',
      body: 'LLMs process text tokens instead of numbers, use attention mechanisms, and have specialized architectures. But the core learning principle remains the same.',
    },
  ],
};

// T045: Learning resources (5-7 curated links)
export const LEARNING_RESOURCES: LearningResource[] = [
  {
    id: 'res-3b1b',
    title: 'Neural Networks (3Blue1Brown)',
    description: 'Beautiful visual explanations of neural network fundamentals.',
    url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi',
    type: 'video',
    difficulty: 'beginner',
  },
  {
    id: 'res-karpathy',
    title: 'Neural Networks: Zero to Hero',
    description: 'Hands-on coding from scratch by Andrej Karpathy.',
    url: 'https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ',
    type: 'video',
    difficulty: 'intermediate',
  },
  {
    id: 'res-book',
    title: 'Neural Networks and Deep Learning',
    description: 'Free online book with interactive examples.',
    url: 'http://neuralnetworksanddeeplearning.com/',
    type: 'book',
    difficulty: 'beginner',
  },
  {
    id: 'res-playground',
    title: 'TensorFlow Playground',
    description: 'Interactive playground to experiment with neural networks.',
    url: 'https://playground.tensorflow.org/',
    type: 'interactive',
    difficulty: 'beginner',
  },
  {
    id: 'res-wikipedia',
    title: 'Artificial Neural Network',
    description: 'Comprehensive reference on neural network concepts.',
    url: 'https://en.wikipedia.org/wiki/Artificial_neural_network',
    type: 'reference',
    difficulty: 'beginner',
  },
  {
    id: 'res-anthropic',
    title: 'Anthropic Research',
    description: 'Learn about cutting-edge AI safety and research.',
    url: 'https://www.anthropic.com/research',
    type: 'article',
    difficulty: 'advanced',
  },
];

// Helper to get legend items by category
export function getLegendItemsByCategory(category: string): LegendItem[] {
  return LEGEND_ITEMS.filter((item) => item.category === category);
}

// Helper to get hint by ID
export function getHintById(id: string): Hint | undefined {
  return HINTS.find((hint) => hint.id === id);
}
