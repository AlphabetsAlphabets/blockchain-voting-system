// implement frontend calls here?
import { ethers } from 'ethers';

// extend the Window interface to include the ethereum property
// typescript does not recognize window.etherum by default, so we need to extend it
declare global {
    interface Window {
        ethereum?: any;
    }
}

// make sure u run 'npx hardhat compile' to be able to access this
// used to connect
// artifacts folder is ignored by git
import ElectionABI from '../artifacts/contracts/Election.sol/Election.json';

// adjust ur env based on this
// should probably replace in the future
const contractAddress = process.env.CONTRACT_ADDRESS as string;

// same as in 'Election.sol'
export type Proposal = {
    name: String,
    votes: String
};

export type ElectionStatus = 
  | 'Election ended'
  | 'Election not started'
  | 'Voting period over (ready to end)'
  | 'Voting in progress';

// provider fallback
const getDefaultProvider = () => {
    return new ethers.JsonRpcProvider("https://sepolia-rpc.scroll.io");
};

// helper to get contract instance
async function getContract() {
    if (typeof window !== "undefined" && window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      return new ethers.Contract(contractAddress, ElectionABI.abi, provider);
    }
    // fallback for Node.js environment
    const provider = getDefaultProvider();
    return new ethers.Contract(contractAddress, ElectionABI.abi, provider);
}

/// Getters
// fetch all proposals with current vote counts
export async function getAllProposals(): Promise<Proposal[]> {
    try {
      const contract = await getContract();
      const proposals = await contract.getAllProposals();
      return proposals.map((p: any) => ({
        name: p.name,
        votes: ethers.formatUnits(p.votes, 0) // convert BigNumber to string
      }));
    } catch (error) {
      console.error('Error fetching proposals:', error);
      throw new Error('Failed to fetch proposals');
    }
  }

// get current election status
export async function getElectionStatus(): Promise<ElectionStatus> {
    try {
        const contract = await getContract();
        const status = await contract.checkElectionStatus();
        return status as ElectionStatus;
    } catch (error) {
        console.error('Error fetching election status:', error);
        throw new Error('Failed to get election status');
    }
}

// get voting period timestamps
export async function getVotingPeriod(): Promise<{
    startTime: Date,
    endTime: Date,
}> {
    try {
        const contract = await getContract();
        const startTime = await contract.startTime();
        const endTime = await contract.endTime();

        return {
            startTime: new Date(Number(startTime) * 1000),
            endTime: new Date(Number(endTime) * 1000)
        };
    } catch (error) {
        console.error('Error fetching voting period:', error);
        throw new Error('Failed to get voting period');
    }
}

// check if an address is required to vote
export async function isRegisteredVoter(address: string): Promise<boolean> {
    try {
      const contract = await getContract();
      return await contract.voterRegistry(address);
    } catch (error) {
      console.error('Error checking voter registration:', error);
      throw new Error('Failed to check voter registration');
    }
}

// check if an address has already voted
export async function hasVoted(address: string): Promise<boolean> {
    try {
      const contract = await getContract();
      return await contract.hasVoted(address);
    } catch (error) {
      console.error('Error checking vote status:', error);
      throw new Error('Failed to check vote status');
    }
}

// get votes for a specific proposal
export async function getProposalVotes(proposalName: string): Promise<string> {
    try {
      const contract = await getContract();
      const votes = await contract.getProposalVotes(proposalName);
      return ethers.formatUnits(votes, 0); // Convert BigNumber to string
    } catch (error) {
      console.error('Error fetching proposal votes:', error);
      throw new Error('Failed to get proposal votes');
    }
}