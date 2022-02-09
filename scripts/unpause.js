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

  // get signer
  const [deployer] = await ethers.getSigners();
  console.log("Using the account:", await deployer.getAddress());
  console.log("Balance:", (await deployer.getBalance()).toString());

  // resolve where to send minted token
  const token = await ethers.getContractAt("Token", address);
  const paused = await token.paused();
  if (!paused) {
    console.log("❌ Already unpaused");
    return;
  }
  await token.unpause();
  console.log("✅ Unpaused");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
