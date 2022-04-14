const utils = require("web3-utils")
const fs = require("fs")
const distribution = require("./distribution.js")

task("bulkmint", "Mints tokens to addresses in distribution.js").setAction(
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

    for (const address of distribution) {
      // check that the recipient doesn't have a token already
      const token = await ethers.getContractAt("Token", address)

      // check balance
      try {
        const balance = await token.balanceOf(address)
        if (balance > 0) {
          console.log("❌ This address already has a token!")
          return
        }
      } catch (err) {
        // Some RPC endpoints error on a balance check. Just continue if that happens...
      }

      // actually mint them a token
      try {
        console.log("Sending to:", address)
        const tx = await token.mint(address, utils.toWei("1"))
        await tx.wait()
        console.log("✅", address)
      } catch (err) {
        console.log("❌", address)
      }
    }
  }
)
