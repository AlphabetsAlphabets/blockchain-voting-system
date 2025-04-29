// for command-line contract testing

import { ethers } from 'ethers';
import dotenv from 'dotenv';
import {
  getAllProposals,
  getElectionStatus,
  getVotingPeriod,
  isRegisteredVoter,
  hasVoted,
  getProposalVotes
} from '../services';

dotenv.config();

async function main() {
  // Initialize provider
  const provider = new ethers.JsonRpcProvider(process.env.SCROLL_SEPOLIA_URL);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
  
  console.log("Testing Election Contract Services");
  console.log("==================================");

  // Test getElectionStatus
  try {
    const status = await getElectionStatus();
    console.log("Election Status:", status);
  } catch (error) {
    console.error("Error in getElectionStatus:", error);
  }

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

  // Test getVotingPeriod
  try {
    const period = await getVotingPeriod();
    console.log("\nVoting Period:");
    console.log("Start:", period.startTime.toLocaleString());
    console.log("End:", period.endTime.toLocaleString());
  } catch (error) {
    console.error("Error in getVotingPeriod:", error);
  }

  // Test voter checks
  const testAddress = await signer.getAddress();
  try {
    const registered = await isRegisteredVoter(testAddress);
    console.log(`\nIs ${testAddress} registered?`, registered);
    
    const votedStatus = await hasVoted(testAddress);
    console.log(`Has ${testAddress} voted?`, votedStatus);
  } catch (error) {
    console.error("Error in voter checks:", error);
  }

  // Test proposal votes (use first proposal)
  try {
    const votes = await getProposalVotes("Proposal A");
    console.log("\nVotes for Proposal A:", votes);
  } catch (error) {
    console.error("Error in getProposalVotes:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});