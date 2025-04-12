import { HardhatUserConfig } from "hardhat/types";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
import "@nomiclabs/hardhat-etherscan";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    scrollSepolia: {
      url: process.env.SCROLL_SEPOLIA_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    }
  },

  // for test verification (may become deprecated down the line)
  etherscan: {
    apiKey: {
      scrollSepolia: process.env.SCROLLSCAN_API_KEY || "",
    },
    customChains: [
      {
        network: "scrollSepolia",
        chainId: 534351,
        urls: {
          apiURL: "https://api-sepolia.scrollscan.com/api",
          browserURL: "https://sepolia.scrollscan.com"
        }
      }
    ]
  }
}

export default config;