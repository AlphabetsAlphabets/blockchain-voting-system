import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("DeployModule", (m) => {
  const contract = m.contract("Incrementer");
  return { contract };
});
