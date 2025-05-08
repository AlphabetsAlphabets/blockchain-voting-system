import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import "@nomicfoundation/hardhat-ignition-ethers"; // Installs "ignition" which helps with deployment.
import "@nomicfoundation/hardhat-ethers"; // Install an custom version of "ethers.js" into hardhat runtime environment.

import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    scrollSepolia: {
      url: process.env.RPC_URL || "", // define as `RPC_URL=https://sepolia-rpc.scroll.io` in ur .env file
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};

export default config;
