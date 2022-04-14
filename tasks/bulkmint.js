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

    for (const receiver of distribution) {
      // check that the recipient doesn't have a token already
      const token = await ethers.getContractAt("Token", address)

      // check balance
      console.log("Sending to:", receiver)
      try {
        const balance = await token.balanceOf(receiver)
        if (balance > 0) {
          console.log("❌ This address already has a token!")
          continue
        }
      } catch (err) {
        console.log("Could not retrieve balance")
        // Some RPC endpoints error on a balance check. Just continue if that happens...
      }

      // actually mint them a token
      try {
        const tx = await token.mint(receiver, utils.toWei("1"))
        await tx.wait()
        console.log("✅", receiver)
      } catch (err) {
        console.log("❌", receiver)
      }
    }
  }
)
