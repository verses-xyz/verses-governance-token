require("@nomiclabs/hardhat-waffle");

const ROPSTEN_ALCHEMY_API_KEY = "3N41dUGoRgXtsjlc8yV3fsiJxxZOrTh5";
const MUMBAI_ALCHEMY_API_KEY = "NysK-hrvnLiLmTNBC-RrwME4Vq13yhvz";
const PRIVATE_KEY = "766572736573ffffffffffffffffffffffffffffffffffffffffffffffffffff"; // base64 encoded "verses"

// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
require("./tasks/faucet");

module.exports = {
    solidity: "0.8.11",
    networks: {
	ropsten: {
	    url: `https://eth-ropsten.alchemyapi.io/v2/${ROPSTEN_ALCHEMY_API_KEY}`,
	    accounts: [`${PRIVATE_KEY}`]
	},
	mumbai: {
	    url: `https://polygon-mumbai.g.alchemy.com/v2/${MUMBAI_ALCHEMY_API_KEY}`,
	    accounts: [`${PRIVATE_KEY}`]
	}
    }
};
