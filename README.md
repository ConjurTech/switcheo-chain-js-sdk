## Install

1. If cloning via HTTP does not work, try cloning using SSH.

2. `yarn install`

3. `yarn build`

4. `yarn link`

## Use
- look at examples, or run `node .` or `node worker.js` (assumes that mnemonic account number starts with 0!)

symlink mnemonics.json from switcheo-chain
`ln -s ~/go/src/github.com/ConjurTech/switcheo-chain/seed/mnemonics.json mnemonics.json`

## Deposit Example
The deposit example can be run with:
ETH_KEY=<eth private key> ETH_URL=<e.g. https://ropsten.infura.io/v3/[infura-id]> node examples/deposit.js
