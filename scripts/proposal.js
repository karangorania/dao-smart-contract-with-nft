const { ethers } = require('hardhat');
const hre = require('hardhat');

const GOVERNANCE_ADDRESS = '0x70901af9D002dcf60a7C9D093679765De13C1caF';
const LOCKER_ADDRESS = '0x01998fEd8EC786ed3Bce37Cac7Abd20F1adBCBB6';

// const propId ='';

async function main() {
  [proposer, executor, vote1, vote2, vote3, vote4, vote5] =
    await ethers.getSigners();

  const Governance = await hre.ethers.getContractFactory('Governance');
  const governance = await Governance.attach(GOVERNANCE_ADDRESS);

  const Locker = await hre.ethers.getContractFactory('Locker');
  const locker = await Locker.attach(LOCKER_ADDRESS);

  // Create proposal
  const callPropose = await governance.propose(
    [LOCKER_ADDRESS],
    [0],
    [
      await locker.interface.encodeFunctionData('withdrawFunds', [
        proposer.address,
        ethers.utils.parseUnits('1', 18),
      ]),
    ],
    'Twitter Buy'
  );
  // console.log(locker.interface.encodeFunctionData('withdrawFunds', []));

  const txn = await callPropose.wait(1);
  // console.log(txn);

  // await ethers.provider.send('evm_mine');

  const propId = await txn.events[0].args.proposalId;

  console.log(propId);

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
