// for command-line contract testing

import { ethers } from 'ethers';
import dotenv from 'dotenv';
import {
  getAllProposals,
} from '../services';

dotenv.config();

async function main() {
  // Initialize provider
  const provider = new ethers.JsonRpcProvider(process.env.SCROLL_SEPOLIA_URL);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
  
  console.log("Testing Election Contract Services");
  console.log("==================================");

  // Test getAllProposals
  try {
    const proposals = await getAllProposals();
    console.log("\nProposals:");
    proposals.forEach((p, i) => 
      console.log(`${i + 1}. ${p.name} - ${p.votes} votes`)
    );
  } catch (error) {
    console.error("Error in getAllProposals:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});