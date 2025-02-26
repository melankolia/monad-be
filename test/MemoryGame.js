import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;

describe("MemoryGame", function () {
  let memoryGame;
  let owner;

  beforeEach(async function () {
    const MemoryGame = await ethers.getContractFactory("MemoryGame");
    memoryGame = await MemoryGame.deploy();
    [owner] = await ethers.getSigners();
  });

  describe("Counter functionality", function () {
    it("Should increment the counter", async function () {
      expect(await memoryGame.getCount()).to.equal(0);
      
      await memoryGame.increment();
      expect(await memoryGame.getCount()).to.equal(1);
      
      await memoryGame.increment();
      expect(await memoryGame.getCount()).to.equal(2);
    });

    it("Should emit CounterIncremented event", async function () {
      await expect(memoryGame.increment())
        .to.emit(memoryGame, "CounterIncremented")
        .withArgs(1);
    });
  });
}); 