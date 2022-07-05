const { ethers } = require('hardhat');
const hre = require('hardhat');

const GOVERNANCE_ADDRESS = '0x909E998d915407E4ab5672E1334aB4f73cDf9488';

const propId =
  '56113563753341013731983306774901785774420486508700703586225127738144427976804';

async function main() {
  [proposer, executor, vote1, vote2, vote3, vote4, vote5] =
    await ethers.getSigners();

  const Governance = await hre.ethers.getContractFactory('Governance');
  const governance = await Governance.attach(GOVERNANCE_ADDRESS);

  const checkState = await governance.state(propId);
  console.log(checkState);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
