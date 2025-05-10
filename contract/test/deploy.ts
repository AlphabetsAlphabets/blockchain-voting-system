import { ethers } from "hardhat";
import { upgrades } from "@openzeppelin/hardhat-upgrades";

async function main() {
  // Deploy the upgradeable Election logic contract
  const Election = await ethers.getContractFactory("Election");
  const electionImpl = await upgrades.deployProxy(Election, [], {
    initializer: false,
  });
  await electionImpl.deployed();

  console.log("Election implementation deployed at:", electionImpl.address);

  // Deploy the factory with the implementation address
  const ElectionFactory = await ethers.getContractFactory("ElectionFactory");
  const factory = await ElectionFactory.deploy(electionImpl.address);
  await factory.deployed();

  console.log("ElectionFactory deployed at:", factory.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
