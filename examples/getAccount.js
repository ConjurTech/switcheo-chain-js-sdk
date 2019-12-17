// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet } = SDK
const mnemonics = require('../mnemonics.json')

const privateKey = wallet.getPrivKeyFromMnemonic(mnemonics[1])

const net = 'LOCALHOST'
// const net = 'DEVNET'

async function getAccount() {
  const wallet = await wallet.Wallet.connect(privateKey, net)
  wallet.getAccount().then(console.log)
}
getAccount()
