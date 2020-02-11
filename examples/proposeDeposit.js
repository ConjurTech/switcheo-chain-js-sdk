// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet
const mnemonics = require('../mnemonics.json')

const privateKey = wallet.getPrivKeyFromMnemonic(mnemonics[0])
// const privateKey2 = wallet.getPrivKeyFromMnemonic(mnemonics[2])

async function proposeDeposit() {
  const wallet = await Wallet.connect(privateKey)
  // const wallet2 = await Wallet.connect(privateKey2)
  const params = {
    ExtAddress: "abc",
    ExtTxID: "abc123",
    AccAddress: wallet.pubKeyBech32,
    Blockchain: "swth",
  	ChainID: "1",
  	AssetID: "iusd",
  	Amount: "50000000000"
  }
	api.proposeDeposit(wallet, params).then(console.log)
}

proposeDeposit()
