import { createNetwork } from '../src/network/network';
import { trainStep, computeLoss, forwardPass } from '../src/network/training';

// Try multiple random initializations to see how often we escape the local minimum
console.log('=== Testing 10 different random initializations ===\n');

for (let trial = 0; trial < 10; trial++) {
  const network = createNetwork([2, 4, 3, 2, 1]);

  // Train for many steps
  let finalLoss = 0;
  for (let i = 0; i < 20000; i++) {
    finalLoss = trainStep(network, 0.5);
  }

  // Check outputs
  const inputs: [number, number][] = [[0,0], [0,1], [1,0], [1,1]];
  const expected = [0, 1, 1, 0];

  let correct = 0;
  const outputs: number[] = [];
  inputs.forEach((input, i) => {
    const output = forwardPass(network, input)[0];
    outputs.push(output);
    const predicted = output > 0.5 ? 1 : 0;
    if (predicted === expected[i]) correct++;
  });

  const status = correct === 4 ? 'CONVERGED' : (finalLoss > 0.24 ? 'STUCK at 0.5' : 'PARTIAL');
  console.log('Trial ' + (trial + 1) + ': Loss=' + finalLoss.toFixed(4) +
              ', Correct=' + correct + '/4, Status: ' + status);
  console.log('  Outputs: ' + outputs.map(o => o.toFixed(3)).join(', '));
}

console.log('\n=== Explanation ===');
console.log('XOR has a notorious local minimum at loss=0.25 where all outputs ~0.5');
console.log('Random initialization determines whether the network escapes it.');
console.log('Solutions: higher learning rate, different architecture, or better initialization');
