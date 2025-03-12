import { ethers } from "hardhat";

async function main() {
  const contractAddress = "0xF44d73E73E12Bee90F071544AdAeac48cede157F";

  // Connect to deployed contract
  const Incrementer = await ethers.getContractAt(
    "Incrementer",
    contractAddress
  );

  // Read the current value
  let currentValue = await Incrementer.value();
  console.log("Current Value:", currentValue.toString());

  // Call increment()
  const tx = await Incrementer.increment();
  await tx.wait(); // Wait for transaction confirmation

  // Read updated value
  currentValue = await Incrementer.value();
  console.log("Updated Value:", currentValue.toString());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
