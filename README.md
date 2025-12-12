# Neural Network Visualiser

A browser-based visual demonstration of training a neural network to predict the outcome of an XOR gate.

**[Try it live](https://howardjonestm.github.io/neural-network-visualiser/)**

Built with [spec-kit](https://github.com/github/spec-kit).

## What is this?

This is an educational tool that lets you watch a neural network learn in real-time. The network learns to solve the XOR problem - a classic example that demonstrates why we need hidden layers in neural networks.

The XOR truth table:
- `[0, 0]` → `0`
- `[0, 1]` → `1`
- `[1, 0]` → `1`
- `[1, 1]` → `0`

## Features

- **Live training visualisation** - Watch the network learn step by step
- **Interactive controls** - Step through training manually or let it run
- **Weight visualisation** - See how connection weights change during training (thickness = magnitude, colour = sign)
- **Neuron activation display** - Hover over neurons to see their current activation values
- **Forward pass demo** - Step through a single prediction to see how data flows through the network
- **Training animation** - Optional pulse animation showing signals flowing through the network
- **Loss tracking** - Monitor how the network's error decreases over time

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## Usage

1. Click **Play** to start continuous training, or **Step** to advance one training step at a time
2. Adjust the **learning rate** slider to see how it affects convergence
3. Click **Demo** to step through a forward pass and see the calculation at each layer
4. Toggle **Animate Training** to see pulses flow through the network as it trains
5. Click on any weight connection to see its history over time
6. Hover over neurons and weights to see their current values

## Tech stack

- TypeScript
- D3.js for SVG visualisation
- Vite for bundling
- Vitest for testing

## Running tests

```bash
npm test
```

## Next steps

### Multiple logic gates
Currently only XOR is supported. Adding AND, OR, NAND, and NOR would let users compare how different problems require different network complexity. XOR needs hidden layers while AND/OR can be solved with a single perceptron - a good way to demonstrate why depth matters.

### Activation function explorer
The network uses sigmoid activation, but users can't see why this matters. Adding a dropdown to switch between sigmoid, tanh, and ReLU would show how different activation functions affect:
- The shape of neuron outputs
- How quickly the network converges

### Letter prediction demo
A more ambitious extension: train on sequences like A→B, B→C to predict the next letter. This creates a bridge to understanding how LLMs work - same core idea of learning patterns, just at a much smaller scale. Would need to visualise how letters are encoded as numbers and how the output is decoded back to a prediction.