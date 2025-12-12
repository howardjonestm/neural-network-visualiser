// Test with larger initial weights
import { createNetwork } from '../src/network/network';
import { forwardPass, computeLoss, trainStep } from '../src/network/training';

const inputs: [number, number][] = [[0,0], [0,1], [1,0], [1,1]];
const expected = [0, 1, 1, 0];

console.log('=== Testing with larger weight initialization ===\n');

// Create network and manually scale weights
const network = createNetwork([2, 4, 3, 2, 1]);

// Scale up all weights by 2x
for (const weight of network.weights) {
  weight.value *= 2;
}
for (const layer of network.layers) {
  for (const neuron of layer.neurons) {
    neuron.bias *= 2;
  }
}

console.log('Initial outputs with 2x scaled weights:');
inputs.forEach((input) => {
  const output = forwardPass(network, input)[0];
  console.log('  [' + input + '] -> ' + output.toFixed(4));
});
console.log('Initial loss:', computeLoss(network).toFixed(4));

// Train
console.log('\nTraining...');
for (let i = 0; i < 10000; i++) {
  const loss = trainStep(network, 0.5);
  if (i % 2000 === 0) {
    console.log('Step ' + i + ': loss = ' + loss.toFixed(6));
  }
}

console.log('\nFinal outputs:');
let correct = 0;
inputs.forEach((input, i) => {
  const output = forwardPass(network, input)[0];
  const predicted = output > 0.5 ? 1 : 0;
  if (predicted === expected[i]) correct++;
  console.log('  [' + input + '] -> ' + output.toFixed(4) + ' (expected ' + expected[i] + ')');
});
console.log('Correct: ' + correct + '/4');
console.log('Final loss:', computeLoss(network).toFixed(6));
