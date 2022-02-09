const utils = require("web3-utils");
require("dotenv").config()

async function main() {
  var mainnetEthers = require("ethers");
  var mainnetProvider = new mainnetEthers.providers.getDefaultProvider();
  const address = process.env.CONTRACT_ADDRESS;
  const target = process.env.TO;

  if (!address) {
    console.log(
      "No contract address specified. Set CONTRACT_ADDRESS in the .env " +
        "file or hardhat arguments."
    )
  }
  if (!target) {
    console.log("Nobody to mint to!");
    return;
  }
  if (network.name === "hardhat") {
    console.log(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time."
    );
  }

  // get signer
  const [deployer] = await ethers.getSigners();
  console.log("Using the account:", await deployer.getAddress());
  console.log("Balance:", (await deployer.getBalance()).toString());

  // resolve where to send minted token
  const token = await ethers.getContractAt("Token", address);
  const resolved = await mainnetProvider.resolveName(target);

  // check that the recipient doesn't have a token already
  const balance = await token.balanceOf(resolved);
  console.log("Sending to:", resolved);
  console.log("Token balance:", utils.fromWei(balance.toString()));
  if (balance > 0) {
    console.log("❌ This address already has a token!");
    return;
  }

  // actually mint them a token
  await token.mint(resolved, utils.toWei("1"));
  console.log("✅");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
