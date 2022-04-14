const utils = require("web3-utils")
const fs = require("fs")

task("pause", "Pauses transfers of the governance token").setAction(
  async ({}) => {
    const address = process.env.CONTRACT_ADDRESS
    if (!address) {
      console.log(
        "No contract address specified. Set CONTRACT_ADDRESS in the .env " +
          "file or hardhat arguments."
      )
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

    // get current status
    const token = await ethers.getContractAt("Token", address)
    const paused = await token.paused()
    if (paused) {
      console.log("❌ Already paused")
      return
    }

    console.log("Pausing...")
    const tx = await token.pause()
    await tx.wait()
    console.log("✅ Paused")
  }
)
