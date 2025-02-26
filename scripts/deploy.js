import hre from "hardhat";

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const MemoryGame = await hre.ethers.getContractFactory("MemoryGame");
  const memoryGame = await MemoryGame.deploy();

  await memoryGame.waitForDeployment();

  console.log(`MemoryGame deployed to ${await memoryGame.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 