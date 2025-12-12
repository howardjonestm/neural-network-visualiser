// Check what outputs the network produces initially
import { createNetwork } from '../src/network/network';
import { forwardPass, computeLoss, trainStep } from '../src/network/training';

console.log('=== Initial outputs before any training ===\n');

const inputs: [number, number][] = [[0,0], [0,1], [1,0], [1,1]];

for (let trial = 0; trial < 5; trial++) {
  const network = createNetwork([2, 4, 3, 2, 1]);

  console.log('Network ' + (trial + 1) + ':');
  console.log('  Initial outputs:');
  inputs.forEach((input) => {
    const output = forwardPass(network, input)[0];
    console.log('    [' + input + '] -> ' + output.toFixed(4));
  });
  console.log('  Initial loss:', computeLoss(network).toFixed(4));
  console.log();
}

console.log('\n=== The Problem ===');
console.log('With Xavier initialization, sigmoid outputs tend to start near 0.5');
console.log('because weights and biases are small, pushing pre-activation toward 0');
console.log('sigmoid(0) = 0.5, so all outputs start ~0.5, giving loss ~0.25');
console.log('\n=== Solutions ===');
console.log('1. Use larger initial weights');
console.log('2. Use a different activation function (ReLU)');
console.log('3. Use He initialization instead of Xavier');
console.log('4. Add momentum to help escape the flat region');
