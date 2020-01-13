// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet
const mnemonics = require('../mnemonics.json')

const privateKey = wallet.getPrivKeyFromMnemonic(mnemonics[0])
const privateKey2 = wallet.getPrivKeyFromMnemonic(mnemonics[2])

async function proposeDeposit() {
  const wallet = await Wallet.connect(privateKey)
  const wallet2 = await Wallet.connect(privateKey2)
  const params = {
    Blockchain: "ETH",
  	ChainID: "ETH",
  	ExtAddress: "asdf",
  	AccAddress: wallet2.pubKeyBech32,
  	AssetID: "asdfg",
  	Token: "eth",
  	ExtTxID: "asdfgh",
  	Amount: "50",
  }
	api.proposeDeposit(wallet, params).then(console.log)
}

proposeDeposit()
