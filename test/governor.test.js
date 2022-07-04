const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Governance', () => {
  let NappyNFT;
  let nappyNFT;
  let TimeLock;
  let timeLock;
  let Locker;
  let locker;
  let Governance;
  let governance;
  let walletAddress;
  let propId;

  beforeEach(async () => {
    [owner, proposer, executor, vote1, vote2, vote3, vote4, vote5] =
      await ethers.getSigners();

    // NappyNFT contract
    NappyNFT = await ethers.getContractFactory('NappyNFT');
    nappyNFT = await NappyNFT.deploy();
    await nappyNFT.deployed();
    nappyNFTAddress = nappyNFT.address;

    // TimeLock contract
    TimeLock = await hre.ethers.getContractFactory('TimeLock');
    timeLock = await TimeLock.deploy(
      1,
      [],
      ['0x0000000000000000000000000000000000000000']
    );

    await timeLock.deployed();

    // Governance Contract
    Governance = await hre.ethers.getContractFactory('Governance');
    governance = await Governance.deploy(nappyNFT.address, timeLock.address);

    await governance.deployed();

    // Locker Contract (wallet address for accept the ETH or withdraw)
    walletAddress = '0xb41b7589ae02a4594cd9314f6b500b387027250b';
    Locker = await hre.ethers.getContractFactory('Locker');
    locker = await Locker.deploy();

    await locker.deployed();

    // send ether to locker
    const transactionHash = await owner.sendTransaction({
      to: locker.address,
      value: ethers.utils.parseEther('1.0'),
    });

    await transactionHash.wait();

    console.log(transactionHash);

    await locker.transferOwnership(timeLock.address);

    await nappyNFT.safeMint(executor.address);
    await nappyNFT.safeMint(vote1.address);
    await nappyNFT.safeMint(vote2.address);
    await nappyNFT.safeMint(vote3.address);
    await nappyNFT.safeMint(vote4.address);

    await nappyNFT.connect(executor).delegate(executor.address);
    await nappyNFT.connect(vote1).delegate(vote1.address);
    await nappyNFT.connect(vote2).delegate(vote2.address);
    await nappyNFT.connect(vote3).delegate(vote3.address);
    await nappyNFT.connect(vote4).delegate(vote4.address);

    await timeLock.grantRole(
      await timeLock.PROPOSER_ROLE(),
      governance.address
    );
  });

  it('Should mint the NFT ', async () => {
    await nappyNFT.safeMint(executor.address);
    await nappyNFT.safeMint(vote1.address);
    await nappyNFT.safeMint(vote2.address);
    await nappyNFT.safeMint(vote3.address);
    await nappyNFT.safeMint(vote4.address);
  });

  it('Should delegate the NFT ', async () => {
    await nappyNFT.connect(executor).delegate(executor.address);
    await nappyNFT.connect(vote1).delegate(vote1.address);
    await nappyNFT.connect(vote2).delegate(vote2.address);
    await nappyNFT.connect(vote3).delegate(vote3.address);
    await nappyNFT.connect(vote4).delegate(vote4.address);
  });

  it('Should grant the role ', async () => {
    await timeLock.grantRole(
      await timeLock.PROPOSER_ROLE(),
      governance.address
    );
  });

  it('Should propose the DAO ', async () => {
    const txnPro = await governance.propose(
      [locker.address],
      [0],
      [
        locker.interface.encodeFunctionData('withdrawFunds', [
          owner.address,
          ethers.utils.parseUnits('1', 18),
        ]),
      ],
      'Twitter Buy'
    );

    // await network.provider.send('evm_mine');
    const txn = await txnPro.wait();

    propId = await txn.events[0].args.proposalId;
    console.log(propId);

    await governance.connect(vote1).castVote(propId, 1);
    await governance.connect(vote2).castVote(propId, 1);
    await governance.connect(vote3).castVote(propId, 1);
    await governance.connect(vote4).castVote(propId, 1);

    // await network.provider.send('evm_mine');
    // await network.provider.send('evm_mine');
    // await network.provider.send('evm_mine');
    await network.provider.send('evm_mine');
    // await network.provider.send('evm_mine');

    await governance.queue(
      [locker.address],
      [0],
      [
        locker.interface.encodeFunctionData('withdrawFunds', [
          owner.address,
          ethers.utils.parseUnits('1', 18),
        ]),
      ],
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes('Twitter Buy'))
    );

    const propState = await governance.state(propId);
    console.log(propState);

    await network.provider.send('evm_mine');

    // await governance.execute(
    //   [locker.address],
    //   [0],
    //   [
    //     locker.interface.encodeFunctionData('withdrawFunds', [
    //       owner.address,
    //       ethers.utils.parseUnits('1', 18),
    //     ]),
    //   ],
    //   ethers.utils.keccak256(ethers.utils.toUtf8Bytes('Donation Demo'))
    // );
    // expect(await governance.state());

    // const propState1 = await governance.state(propId);
    // console.log(propState1);
  });
});
