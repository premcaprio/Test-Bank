const { expect } = require("chai");
const { ethers } = require("hardhat");

async function main() {

    // Get TokenADO contract and deploy
    const Cardanae = await hre.ethers.getContractFactory("Cardanae");
    const tokenADO = await Cardanae.deploy();
    await tokenADO.deployed();
    console.log("Successfully deployed TokenADO contract at", tokenADO.address);
  
   // Get Vault contract and deploy
    const Vault = await hre.ethers.getContractFactory("Vault");
    const vault = await Vault.deploy(tokenADO.address);
    await vault.deployed();
    console.log("Successfully deployed Vault contract at", vault.address)

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
