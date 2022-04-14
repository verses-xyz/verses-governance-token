require("@nomiclabs/hardhat-waffle")
require("dotenv").config()

const OPTIMISM_ALCHEMY_API_KEY = process.env.OPTIMISM_ALCHEMY_API_KEY
const RINKEBY_ALCHEMY_API_KEY = process.env.RINKEBY_ALCHEMY_API_KEY
let DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY

if (!DEPLOYER_PRIVATE_KEY) {
  DEPLOYER_PRIVATE_KEY =
    "0x" + require("crypto").randomBytes(32).toString("hex")
  console.log("Generated new private key:", DEPLOYER_PRIVATE_KEY)
  console.log("This probably won't work unless running on localhost!")
} else {
  console.log("Using private key in .env...")
}

require("./tasks/deploy")
require("./tasks/mint")
require("./tasks/bulkmint")
require("./tasks/pause")
require("./tasks/unpause")

module.exports = {
  solidity: "0.8.11",
  defaultNetwork: "localhost",
  networks: {
    xdai: {
      url: "https://rpc.gnosischain.com",
      accounts: [`${DEPLOYER_PRIVATE_KEY}`],
    },
    sokol: {
      url: "https://sokol.poa.network",
      accounts: [`${DEPLOYER_PRIVATE_KEY}`],
      gasPrice: 2000000000,
    },
  },
}
