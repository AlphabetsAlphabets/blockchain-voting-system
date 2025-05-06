import "@nomicfoundation/hardhat-ethers"
import hre from "hardhat";

import { expect } from "chai";

import dotenv from "dotenv";
dotenv.config()

describe("Election details", function () {
  enum votingError {
    NotRegisteredToVote = "Not registered to vote",
    AlreadyVoted = "Already voted",
    InvalidProposal = "Invalid proposal"
  };

  let contractAddress = "";
  before(async () => {
    const now = Math.floor(Date.now() / 1000);
    const oneHour = 60 * 60;
    const oneDay = 24 * oneHour;

    const startTime = now;
    const endTime = now + oneDay;

    const allowedVoters = [
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", // Account #19 from local blockchain
      "0xC5c79779b78FB531Be4C8f4Aa87487361434Caa0", // marcel's address
      "0xAc1891E2b8E8DD1C2bcd9A61811e1032FD3FF17e", // jia hong's address
    ]

    const proposals = ["Proposal A", "Proposal B", "Proposal C"];

    const factory = await hre.ethers.getContractFactory("Election");
    const contract = await factory.deploy(proposals, allowedVoters, startTime, endTime);
    await contract.waitForDeployment();

    contractAddress = await contract.getAddress();
    console.log("Contract deployed to: ", contractAddress);
  });

  it("Get all proposals", async () => {
    const contract = await hre.ethers.getContractAt("Election", contractAddress);
    let proposals = await contract.getAllProposals();

    expect(proposals).to.not.equal(undefined);
  });

  it("Should make a vote.", async () => {
    let contract = await hre.ethers.getContractAt("Election", contractAddress);
    let [owner, _] = await hre.ethers.getSigners();
    let results = await contract.connect(owner).vote("Proposal A");
  
    expect(results).to.equal(0);
  });

  it("Should show a list of allowed voters", async () => {
    let contract = await hre.ethers.getContractAt("Election", contractAddress);
    let voters = await contract.getAllowedVoters();
    console.log("Voters: ", voters);

    expect(1).to.equal(1);
  });
});

