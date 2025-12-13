import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import hardhatEthers from "@nomicfoundation/hardhat-ethers"
import hardhatViemPlugin from "@nomicfoundation/hardhat-viem"
import hardhatIgnitionEther from "@nomicfoundation/hardhat-ignition"
import hardhatIgnitionEtherPlugin from "@nomicfoundation/hardhat-ignition-ethers"
import { configVariable, defineConfig } from "hardhat/config";

export default defineConfig({
  plugins: [
    hardhatToolboxMochaEthersPlugin,
    hardhatViemPlugin,
    hardhatIgnitionEtherPlugin,
    hardhatIgnitionEther,
    hardhatEthers
  ],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    ganache: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      type: "http"
    },
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
  },
});
