import { HardhatUserConfig } from "hardhat/types";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    scrollSepolia: {
      url: process.env.SCROLL_SEPOLIA_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    }
  },
}

export default config;