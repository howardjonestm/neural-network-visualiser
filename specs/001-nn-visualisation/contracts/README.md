# API Contracts: Neural Network Visualisation

**Date**: 2025-12-09
**Feature**: 001-nn-visualisation

## Not Applicable

This feature does not require API contracts because:

1. **Static Deployment**: The application runs entirely in the browser with no
   backend server (Constitution Principle III: Static Deployment)

2. **No External Services**: All neural network computation happens client-side
   in JavaScript; no API calls are made after initial page load

3. **No Data Persistence**: Training state exists only in browser memory and
   is not persisted or synchronized

## Internal Module Interfaces

While there are no HTTP API contracts, the internal TypeScript modules have
well-defined interfaces documented in `data-model.md`:

- `Network` interface: Neural network structure and operations
- `TrainingConfig` interface: Training parameter state
- `Neuron`, `Layer`, `Weight` interfaces: Core entity definitions

These interfaces serve as the internal "contracts" between modules.
