const { expect } = require("chai");
const { ethers } = require("hardhat");

async function main() {
 // Get example accounts
  const [owner, user1, user2, user3] = await hre.ethers.getSigners();

 // Get TokenADO contract and deploy
  const Cardanae = await hre.ethers.getContractFactory("Cardanae", owner);
  const tokenADO = await Cardanae.deploy();
  await tokenADO.deployed();
  console.log("Successfully deployed TokenADO contract at", tokenADO.address);

 // Get Vault contract and deploy
  const Vault = await hre.ethers.getContractFactory("Vault", owner);
  const vault = await Vault.deploy(tokenADO.address);
  await vault.deployed();
  console.log("Successfully deployed Vault contract at", vault.address);

 // Token give-away
  await tokenADO.connect(owner).transfer(user1.address, 5000);

  console.log("====The users get tokens.====");

 // Let user approve thier token to the contract
  await tokenADO.connect(user1).approve(vault.address, 500000);
  console.log("====Successfully approve Token to contract====")

 // Create one or more accounts
  await vault.connect(user1).createAccount("Prem1");
  await vault.connect(user1).createAccount("Prem1"); /* Error from repeating the account name*/
  await vault.connect(user1).createAccount("Prem3");
  console.log("====Successfully creating account====")

 // Deposit token 
  await vault.connect(user1).depositToken(500, "Prem1");
  await vault.connect(user1).depositToken(500, "Prem2");
  await vault.connect(user1).depositToken(500, "Prem3");
  console.log("====Successfully deposit Token to contract====")

  // Check Balance token after depositing
  console.log(await vault.connect(user1).getBalance("Prem1"));
  console.log(await vault.connect(user1).getBalance("Prem2"));
  console.log(await vault.connect(user1).getBalance("Prem3"));

 // Withdraw Token 
  await vault.connect(user1).withdrawToken(100, "Prem1");
  await vault.connect(user1).withdrawToken(300, "Prem2");
  await vault.connect(user1).withdrawToken(500, "Prem3");
  console.log("====Successfully withdraw Token to contract====")

  // Check Balance token after withdraw
  console.log(await vault.connect(user1).getBalance("Prem1"));
  console.log(await vault.connect(user1).getBalance("Prem2"));
  console.log(await vault.connect(user1).getBalance("Prem3"));

 // Transfer token
  await vault.connect(user1).transfer("Prem1", "Prem2", 200);
  console.log("====Successfully transfer token====")

 // Check Balance token after transfer token
  console.log(await vault.connect(user1).getBalance("Prem1"));
  console.log(await vault.connect(user1).getBalance("Prem2"));
  console.log(await vault.connect(user1).getBalance("Prem3"));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
