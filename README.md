# Verses Governance Token

A simple mintable, transfer-pausable, non-divisible governance token
designed to be managed by an owner address.

- Mintable: The owner may mint new tokens, up to a predefined cap.
- Pausable: The owner may pause transfers of the token.
- Non-divisible: Only whole tokens may be transferred or minted.

In the initial iteration, the owner is an EOA (externally owned
account). In future iterations, it may be a multisig wallet.

## Quick start

Copy .env.template to .env, and set up DEPLOYER_PRIVATE_KEY to be an
address you've filled with some crypto. Then, run:

```
npm install
npx hardhat compile
npx hardhat test
npx hardhat node
npx hardhat deploy --network localhost
```

This will start a local hardhat network and deploy a token to it.

## Minting a token

To mint to a single address, set up CONTRACT_ADDRESS in .env, then run:

```
npx hardhat mint 0x123... --network [network]
```

To mint to a list of addresses, create tasks/distribution.js and
export the list as an array. Then run:

```
npx hardhat bulkmint --network [network]
```

## Pausing and unpausing

By default, token transfers are unpaused.

```
npx hardhat unpause --network [network]
npx hardhat pause --network [network]
```
