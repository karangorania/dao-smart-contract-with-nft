require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-etherscan');
require('dotenv').config();

const { POLYGON_API_URL, PRIVATE_KEY, POLYGON_SCAN_KEY } = process.env;

module.exports = {
  solidity: {
    version: '0.8.4',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      gas: 12000000,
      gasPrice: 8000000000,
      blockGasLimit: 0x1fffffffffffff,
      allowUnlimitedContractSize: true,
      timeout: 1800000,
    },
    mumbai: {
      url: POLYGON_API_URL,
      accounts: {
        mnemonic: PRIVATE_KEY,
      },
    },
  },
  etherscan: {
    apiKey: POLYGON_SCAN_KEY,
  },
};
