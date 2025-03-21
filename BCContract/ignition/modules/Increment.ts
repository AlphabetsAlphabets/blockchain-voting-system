import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule('IncrementModule', (m) => {
  const incrementer = m.contract('Incrementer');

  return { incrementer };
});
