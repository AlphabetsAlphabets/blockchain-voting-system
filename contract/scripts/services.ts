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
  return new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
};

// helper to get contract instance
export async function getContract() {
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