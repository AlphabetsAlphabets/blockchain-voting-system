import { ethers } from "hardhat";
import dotenv from "dotenv";

dotenv.config();

// non-blocking async 
// (all network-based calls should be like this)
async function main() {
    // config
    const proposals = ["Proposal A", "Proposal B", "Proposal C"];
    const votingPeriodDays = 7;

    const ownerAddress = "0xC5c79779b78FB531Be4C8f4Aa87487361434Caa0"; // my address
    const voterAddress = "0xAc1891E2b8E8DD1C2bcd9A61811e1032FD3FF17e"; // jia hong's address

    // calculate start and end
    const startTime = Math.floor(Date.now() / 1000); // rn frfr
    const endTime = startTime + (votingPeriodDays * 24 * 60 * 60); // 1 week from now

    // get contract factory
    const Election = await ethers.getContractFactory("Election");

    // deploy the contract
    console.log("Deploying Election contract...");
    const election = await Election.deploy(
        proposals,
        [ownerAddress, voterAddress], // Both addresses can vote
        startTime,
        endTime
    );

    await election.waitForDeployment();

    console.log(`Election contract deployed to: ${await election.getAddress()}`);
    console.log(`Owner: ${ownerAddress}`);
    console.log(`Allowed voters: ${ownerAddress}, ${voterAddress}`);
    console.log(`Voting period: From ${new Date(startTime * 1000)} to ${new Date(endTime * 1000)}`);
    console.log(`Proposals: ${proposals.join(", ")}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});