// this file is an example of how new elections can be created

import { ethers, network } from "hardhat";
// import { time } from "@nomicfoundation/hardhat-network-helpers";
import * as fs from 'fs';

// non-blocking async
async function main() {
    console.log("Deploying to network:", network.name);

    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

    // get contract factory
    const Election = await ethers.getContractFactory("Election");

    // setup deployment parameters
    const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    const oneHour = 60 * 60;
    const oneDay = 24 * oneHour;
    
    const startTime = now + oneHour; // Start in 1 hour
    const endTime = now + oneDay; // End in 1 day

    // example proposals
    const proposals = ["Proposal A", "Proposal B", "Proposal C"];

    const allowedVoters = [
        deployer.address,
        "0xC5c79779b78FB531Be4C8f4Aa87487361434Caa0", // marcel's address
        "0xAc1891E2b8E8DD1C2bcd9A61811e1032FD3FF17e"  // jia hong's address
    ];

    // deploy contract
    const election = await Election.deploy(proposals, allowedVoters, startTime, endTime);
    await election.deployed();

    console.log("Election deployed to:", election.address);
    console.log("Election starts at:", new Date(startTime * 1000).toLocaleString());
    console.log("Election ends at:", new Date(endTime * 1000).toLocaleString());
    console.log("Proposals:", proposals);
    console.log("Allowed voters:", allowedVoters);

    // save info to a json file
    const deploymentInfo = {
        contractAddress: election.address,
        deployedAt: new Date().toISOString(),
        network: network.name
    };
      
    fs.writeFileSync(
        'deployment.json',
        JSON.stringify(deploymentInfo, null, 2)
    );
      
    console.log("Deployment info saved to deployment.json");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});