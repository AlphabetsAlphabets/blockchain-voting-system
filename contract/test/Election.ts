import "@nomicfoundation/hardhat-ethers"
import { ethers } from "hardhat";

import { expect } from "chai";

import dotenv from "dotenv";
import { Contract } from "ethers";

dotenv.config()

describe("Election details", function () {
  let contractAddress = "";
  before(async () => {
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

    contractAddress = await contract.getAddress();
  });

  // it("Get all proposals", async () => {
  //   const contract = await ethers.getContractAt("Election", contractAddress);
  //   let proposals = await contract.getAllProposals();

  //   expect(proposals).to.not.equal(undefined);
  // });

  // // Order of the tests ran is not guaranteed. Which means you need to specify which test to run.
  // // Should try to make it better by enforcing order some how.
  // it("Should make a vote.", async () => {
  //   let contract = await ethers.getContractAt("Election", contractAddress);    

  //   contract.on("VoteStatus(string result)", (result: string) => {
  //     console.log("Should make a vote: ", result);
  //   });
    
  //   await contract.vote("Proposal A");
  
  //   expect(0).to.equal(0);
  // });

  // it("Unregistered user should not make a vote.", async () => {
  //   let contract = await ethers.getContractAt("Election", contractAddress);
  //   let signers = await ethers.getSigners();
  //   let randomAccount = signers[2];
    
  //   let newCaller = contract.connect(randomAccount) as Contract;

  //   newCaller.on("VoteStatus(string result)", (result: string) => {
  //     console.log("Unregistered user should not make a vote: ", result);
  //   });

  //   await newCaller.vote("Proposal A");
  // })

  it("Registered user should not make a vote for an unknown proposal.", async () => {
    let contract = await ethers.getContractAt("Election", contractAddress);
    let signers = await ethers.getSigners();
    let account19 = signers[19];
    
    let newCaller = contract.connect(account19) as Contract;

    newCaller.on("VoteStatus(string result)", (result: string) => {
      console.log("Registered user should not make a vote for an unknown proposal: ", result);
    });

    await newCaller.vote("Proposal  A");
  })
});

