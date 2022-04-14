const utils = require("web3-utils")
const fs = require("fs")

task("mint", "Mints a governance token to an address")
  .addPositionalParam("receiver", "The address that will receive them")
  .setAction(async ({ receiver }) => {
    const address = process.env.CONTRACT_ADDRESS
    if (!address) {
      console.log(
        "No contract address specified. Set CONTRACT_ADDRESS in the .env " +
          "file or hardhat arguments."
      )
    }
    if (!receiver) {
      console.log("Nobody to mint to!")
      return
    }
    if (network.name === "hardhat") {
      console.log(
        "You are trying to deploy a contract to the Hardhat Network, which" +
          "gets automatically created and destroyed every time."
      )
    }

    // get signer
    const [deployer] = await ethers.getSigners()
    console.log("Using the account:", await deployer.getAddress())
    console.log("Balance:", (await deployer.getBalance()).toString())

    // check that the recipient doesn't have a token already
    const token = await ethers.getContractAt("Token", address)
    const balance = await token.balanceOf(receiver)
    console.log("Sending to:", receiver)
    console.log("Token balance:", utils.fromWei(balance.toString()))
    if (balance > 0) {
      console.log("❌ This address already has a token!")
      return
    }

    // actually mint them a token
    const tx = await token.mint(receiver, utils.toWei("1"))
    await tx.wait()
    console.log("✅")
  })
