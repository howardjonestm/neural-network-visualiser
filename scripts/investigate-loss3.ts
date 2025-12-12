// Test if creating the exact same architecture always produces similar initial weights
import { createNetwork } from '../src/network/network';
import { computeLoss } from '../src/network/training';

console.log('=== Testing 5 sequential network creations ===\n');

for (let i = 0; i < 5; i++) {
  const network = createNetwork([2, 4, 3, 2, 1]);

  // Print first few weights
  const firstWeights = network.weights.slice(0, 5).map(w => w.value.toFixed(4));
  const initialLoss = computeLoss(network);

  console.log('Network ' + (i+1) + ':');
  console.log('  First 5 weights:', firstWeights.join(', '));
  console.log('  Initial loss:', initialLoss.toFixed(4));
  console.log();
}
