import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-ethers";
const SEPOLIA_PRIVATE_KEY = vars.get("BASE_SEPOLIA_PRIVATE_KEY");

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks: {
    base_sepolia: {
      url: 'https://sepolia.base.org',
      accounts: [SEPOLIA_PRIVATE_KEY],
    },
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },
};

export default config;
