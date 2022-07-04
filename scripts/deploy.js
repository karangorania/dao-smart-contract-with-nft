const hre = require('hardhat');

async function main() {
  [proposer, executor, vote1, vote2, vote3, vote4, vote5] =
    await ethers.getSigners();

  const NappyNFT = await hre.ethers.getContractFactory('NappyNFT');
  const nappyNFT = await NappyNFT.deploy();

  await nappyNFT.deployed();

  console.log('NappyNFT deployed to:', nappyNFT.address);

  const TimeLock = await hre.ethers.getContractFactory('TimeLock');
  const timeLock = await TimeLock.deploy(
    1,
    [],
    ['0x0000000000000000000000000000000000000000']
  );

  await timeLock.deployed();

  console.log('TimeLock deployed to:', timeLock.address);

  const Governance = await hre.ethers.getContractFactory('Governance');
  const governance = await Governance.deploy(
    nappyNFT.address,
    timeLock.address
  );

  await governance.deployed();

  console.log('Governance deployed to:', governance.address);

  const Locker = await hre.ethers.getContractFactory('Locker');
  const locker = await Locker.deploy();

  await locker.deployed();

  console.log('Locker deployed to:', locker.address);

  await locker.transferOwnership(timeLock.address);

  await nappyNFT.safeMint(vote1.address);
  await nappyNFT.safeMint(vote2.address);
  await nappyNFT.safeMint(vote3.address);
  await nappyNFT.safeMint(vote4.address);

  await nappyNFT.connect(vote1).delegate(vote1.address);
  await nappyNFT.connect(vote2).delegate(vote2.address);
  await nappyNFT.connect(vote3).delegate(vote3.address);
  await nappyNFT.connect(vote4).delegate(vote4.address);

  await timeLock.grantRole(await timeLock.PROPOSER_ROLE(), governance.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
