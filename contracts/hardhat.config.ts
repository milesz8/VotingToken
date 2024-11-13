import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
const SEPOLIA_PRIVATE_KEY = vars.get("BASE_SEPOLIA_PRIVATE_KEY");

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks: {
    base_sepolia: {
      url: 'https://sepolia.base.org',
      accounts: [SEPOLIA_PRIVATE_KEY],
    },
  },
};

export default config;
