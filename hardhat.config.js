require("@nomiclabs/hardhat-waffle");
require("dotenv").config()

const POLYGON_ALCHEMY_API_KEY = process.env.POLYGON_ALCHEMY_API_KEY;
const RINKEBY_ALCHEMY_API_KEY = process.env.RINKEBY_ALCHEMY_API_KEY;
let DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;

if (!DEPLOYER_PRIVATE_KEY) {
  DEPLOYER_PRIVATE_KEY = "0x" + require('crypto').randomBytes(32).toString('hex');
  console.log("Generated new private key:", DEPLOYER_PRIVATE_KEY);
  console.log("This probably won't work unless running on localhost!");
} else {
  console.log("Using private key in .env...");
}

// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
require("./tasks/faucet");

module.exports = {
    solidity: "0.8.11",
    defaultNetwork: "localhost",
    networks: {
	polygon: {
	    url: `https://polygon-mainnet.g.alchemy.com/v2/${POLYGON_ALCHEMY_API_KEY}`,
	    accounts: [`${DEPLOYER_PRIVATE_KEY}`]
	},
	rinkeby: {
	    url: `https://eth-rinkeby.g.alchemy.com/v2/${RINKEBY_ALCHEMY_API_KEY}`,
	    accounts: [`${DEPLOYER_PRIVATE_KEY}`]
	}
    }
};
