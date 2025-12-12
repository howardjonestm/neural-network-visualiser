import { createNetwork } from '../src/network/network';
import { trainStep, computeLoss, forwardPass } from '../src/network/training';

const network = createNetwork([2, 4, 3, 2, 1]);

console.log('=== Initial State ===');
console.log('Initial loss:', computeLoss(network).toFixed(6));

// Check what the network outputs for each XOR input
const inputs: [number, number][] = [[0,0], [0,1], [1,0], [1,1]];
const expected = [0, 1, 1, 0];

console.log('\n=== Before Training ===');
inputs.forEach((input, i) => {
  const output = forwardPass(network, input)[0];
  console.log('Input [' + input + '] -> Output: ' + output.toFixed(4) + ', Expected: ' + expected[i]);
});

// Train for a while
console.log('\n=== Training... ===');
for (let i = 0; i < 10000; i++) {
  const loss = trainStep(network, 0.5);
  if (i % 2000 === 0) {
    console.log('Step ' + i + ': loss = ' + loss.toFixed(6));
  }
}

console.log('\n=== After 10000 Steps ===');
inputs.forEach((input, i) => {
  const output = forwardPass(network, input)[0];
  console.log('Input [' + input + '] -> Output: ' + output.toFixed(4) + ', Expected: ' + expected[i]);
});

const finalLoss = computeLoss(network);
console.log('\nFinal loss:', finalLoss.toFixed(6));

// Calculate what loss would be if all outputs were 0.5
console.log('\n=== Analysis ===');
const lossAt05 = (0.5*0.5 + 0.5*0.5 + 0.5*0.5 + 0.5*0.5) / 4;
console.log('Loss if all outputs were 0.5:', lossAt05.toFixed(6));
console.log('This is the "stuck at 0.5" local minimum for XOR');
