import hre from "hardhat";
const { ethers } = hre;

async function main() {
  const MemoryGame = await ethers.getContractFactory("MemoryGame");
  const memoryGame = await MemoryGame.deploy();

  await memoryGame.waitForDeployment();

  console.log(`MemoryGame deployed to ${await memoryGame.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 