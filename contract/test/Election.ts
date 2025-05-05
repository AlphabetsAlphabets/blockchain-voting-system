import "@nomicfoundation/hardhat-ethers"
import hre from "hardhat";

import { expect } from "chai";

import dotenv from "dotenv";
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
      "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
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
    const owner = await hre.ethers.getSigners();
    const contract = await hre.ethers.getContractAt("Election", contractAddress);
    let proposals =  await contract.getAllProposals();

    expect(proposals).to.not.equal(undefined);
    console.log(proposals);
  });
});