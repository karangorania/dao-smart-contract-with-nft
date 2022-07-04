const hre = require('hardhat');

const GOVERNANCE_ADDRESS = '0x70901af9D002dcf60a7C9D093679765De13C1caF';
const LOCKER_ADDRESS = '0x01998fEd8EC786ed3Bce37Cac7Abd20F1adBCBB6';

const propId =
  '23890126121403889330801086970793882245534628028688979032188406697128228434795';

async function main() {
  [proposer, executor, vote1, vote2, vote3, vote4, vote5] =
    await ethers.getSigners();

  const Governance = await hre.ethers.getContractFactory('Governance');
  const governance = Governance.attach(GOVERNANCE_ADDRESS);

  const Locker = await hre.ethers.getContractFactory('Locker');
  const locker = Locker.attach(LOCKER_ADDRESS);

  await governance.queue(
    [LOCKER_ADDRESS],
    [0],
    [
      locker.interface.encodeFunctionData('withdrawFunds', [
        proposer.address,
        ethers.utils.parseUnits('1', 18),
      ]),
    ],
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes('Twitter Buy'))
  );

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
