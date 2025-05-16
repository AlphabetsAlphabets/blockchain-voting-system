import "@nomicfoundation/hardhat-ethers"
import { ethers } from "hardhat";

import * as chai from "chai";
import { expect } from "chai";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);

import dotenv from "dotenv";
import { Contract } from "ethers";

dotenv.config()

async function deployContract(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const oneHour = 60 * 60;
  const oneDay = 24 * oneHour;

  const startTime = now;
  const endTime = now + oneDay;

  const allowedVoters = [
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", // Account #0 from local blockchain
    "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", // Account #19 from local blockchain
    "0xC5c79779b78FB531Be4C8f4Aa87487361434Caa0", // marcel's address
    "0xAc1891E2b8E8DD1C2bcd9A61811e1032FD3FF17e", // jia hong's address
  ]

  const proposals = ["Proposal A", "Proposal B", "Proposal C"];

  const factory = await ethers.getContractFactory("Election");
  const contract = await factory.deploy(proposals, allowedVoters, startTime, endTime);
  await contract.waitForDeployment();

  return await contract.getAddress();
}

const voteError = "Unable to vote";

describe("Vote tests", function () {
  let contractAddress = "";

  before(async () => {
    contractAddress = await deployContract();
  });

  it("Should make a vote.", async () => {
    let contract = await ethers.getContractAt("Election", contractAddress);

    let result = await contract.canVote("Proposal A");
    let transaction = contract.vote("Proposal A");

    expect(result).to.be.equal(0) && await expect(transaction).to.not.be.rejectedWith(voteError);
  });

  it("Unregistered user should not make a vote.", async () => {
    let contract = await ethers.getContractAt("Election", contractAddress);
    let signers = await ethers.getSigners();
    let randomAccount = signers[2];

    let newCaller = contract.connect(randomAccount) as Contract;

    let result = await newCaller.canVote("Proposal A");
    let transaction = newCaller.vote("Proposal A");

    expect(result).to.be.equal(1) &&
      await expect(transaction).to.be.rejectedWith(voteError);
  })

  it("Registered user should not make a vote for an unknown proposal.", async () => {
    let contract = await ethers.getContractAt("Election", contractAddress);
    let signers = await ethers.getSigners();
    let account19 = signers[19];

    let newCaller = contract.connect(account19) as Contract;
    let result = await newCaller.canVote("asdasd");
    let transaction = newCaller.vote("asds");

    expect(result).to.be.equal(3) &&
      await expect(transaction).to.be.rejectedWith("Unable to vote");
  })

  it("Shouldn't be able to vote twice.", async () => {
    let contract = await ethers.getContractAt("Election", contractAddress);
    let signers = await ethers.getSigners();
    let account19 = signers[19];

    let proposal = "Proposal A";
    let newCaller = contract.connect(account19) as Contract;

    let result = await newCaller.canVote(proposal);
    let transaction = newCaller.vote(proposal);

    expect(result).to.be.equal(0) && await expect(transaction).to.not.be.rejectedWith(voteError);

    result = await newCaller.canVote(proposal);
    transaction = newCaller.vote(proposal);

    expect(result).to.be.equal(2) && await expect(transaction).to.be.rejectedWith("Unable to vote");
  });
});

describe("Election getters", () => {
  let contractAddress = "";
  before(async () => {
    contractAddress = await deployContract();
  })

  it("Get all proposals", async () => {
    const contract = await ethers.getContractAt("Election", contractAddress);
    let proposals = await contract.getAllProposals();

    expect(proposals).to.not.equal(undefined);
  });

  it("Should get all allowed voter addresses'", async () => {
    let contract = await ethers.getContractAt("Election", contractAddress);
    let voters = contract.getAllowedVoters();

    expect(voters).to.not.equal(undefined);
  });

  it("Check if election has ended.", async () => {
    let contract = await ethers.getContractAt("Election", contractAddress);
    let ended = await contract.ended();

    expect(ended).to.not.equal(undefined);
  });

  it("Check total votes for each proposal", async () => {
    // First make a vote to one proposal then view.
    let contract = await ethers.getContractAt("Election", contractAddress);
    let proposal = "Proposal A";
    let result = await contract.canVote(proposal);
    let transaction = contract.vote(proposal);

    expect(result).to.equal(0) && await expect(transaction).to.not.be.rejectedWith(voteError);

    let signers = await ethers.getSigners();
    let account19 = signers[19];

    let newCaller = contract.connect(account19) as Contract;
    result = await newCaller.canVote(proposal);
    transaction = newCaller.vote(proposal);

    expect(result).to.be.equal(0) &&
      await expect(transaction).to.not.be.rejectedWith(voteError);

    let votes_for_a = await contract.getProposalVotes(proposal);
    let votes_for_b = await contract.getProposalVotes("Proposal B");
    let votes_for_c = await contract.getProposalVotes("Proposal C");

    expect(votes_for_a).to.be.equal(2) && expect(votes_for_b).to.be.equal(0) && expect(votes_for_c).to.be.equal(0);
  })
});