task("deploy", "Deploys the governance contract")
  .addPositionalParam("cap", "The maximum number of tokens")
  .setAction(async ({ cap }) => {
    if (network.name === "hardhat") {
      console.warn(
        "You are running the faucet task with Hardhat network, which" +
          "gets automatically created and destroyed every time. Use the Hardhat" +
          " option '--network localhost'"
      )
    }

    if (!cap) {
      console.error("No cap")
      return
    }

    const Token = await ethers.getContractFactory("Token")
    const token = await Token.deploy(cap)
    await token.deployed()

    console.log("Deployed token:", token.address)
  })
