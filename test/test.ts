const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Blake3", async () => {

  before(async function () {
    this.Blake3 = await ethers.getContractFactory("Blake3SolTest");
    [ this.owner ] = await ethers.getSigners();
    this.ownerAddress = await this.owner.getAddress();
    this.testString = ethers.utils.toUtf8Bytes("hellohello?");
    this.anotherTestString = ethers.utils.toUtf8Bytes("hellohello!");

    const abiBlake = require('../artifacts/contracts/Blake3SolTest.sol/Blake3SolTest.json').abi;
    this.Blake3Interface = new ethers.utils.Interface(abiBlake);
  });

  beforeEach(async function () {
    this.blake3 = await this.Blake3.deploy();
    await this.blake3.deployed();
  });
    
  it("should be deployed", async function () {
    expect(this.blake3.address).to.not.be.undefined;
    expect(this.blake3.address).to.not.be.null;
  });

  it("should hash an input", async function () {
    let hasher = await this.blake3.new_hasher();
    hasher = await this.blake3.update_hasher(hasher, this.testString);
    const output = await this.blake3.finalize(hasher);
    expect(output).to.equal("0x10e6acb2cfcc4bb07588ad5b8e85f6a13f19e24f3302826effd93ce1ebbece6e");
  });

  it("should hash and change state", async function () {
    const testHash = await this.blake3.test_hash(this.testString, 1);
    const hashedTest = await testHash.wait();

    const hashResult = await this.Blake3Interface.decodeFunctionResult("test_hash", hashedTest.logs[0].data);
    const result = hashResult[0];

    expect(result).to.equal("0x10e6acb2cfcc4bb07588ad5b8e85f6a13f19e24f3302826effd93ce1ebbece6e");
  });

  it("should hash and change state (keyed)", async function () {
    const testHash = await this.blake3.test_keyed_hash(this.anotherTestString, this.testString, 2);
    const hashedTest = await testHash.wait();

    const hashResult = await this.Blake3Interface.decodeFunctionResult("test_keyed_hash", hashedTest.logs[0].data);
    const result = hashResult[0];

    expect(result).to.equal("0x0edd7e645d2bc1bba1f323f6339a3d0448ec6b675991e8dc76d2396eb0dffca2");
  });

  it("should hash 10 times and change state (keyed)", async function () {
    const testHash = await this.blake3.test_keyed_hash_10_times(this.anotherTestString, this.testString, 3);
    const hashedTest = await testHash.wait();

    const hashResult = await this.Blake3Interface.decodeFunctionResult("test_keyed_hash_10_times", hashedTest.logs[0].data);
    const result = hashResult[0];

    expect(result).to.equal("0xc813bc065b1b94925993926fb22b621bb63d75815a692dd1fef5ac050454aaae");
  });

  it("should hash 60 times and change state (keyed)", async function () {
    const testHash = await this.blake3.test_keyed_hash_60_times(this.anotherTestString, this.testString, 4);
    const hashedTest = await testHash.wait();

    const hashResult = await this.Blake3Interface.decodeFunctionResult("test_keyed_hash_60_times", hashedTest.logs[0].data);
    const result = hashResult[0];

    expect(result).to.equal("0x6f6f30a1f13a4bf9480be60681681a787010c5fd40eaeeb0a890b7c8c781fe9d");
  });
});