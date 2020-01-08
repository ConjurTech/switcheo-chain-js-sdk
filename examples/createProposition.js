// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet
const mnemonics = require('../mnemonics.json')

const privateKey = wallet.getPrivKeyFromMnemonic(mnemonics[0])

async function createProposition() { //
  const wallet = await Wallet.connect(privateKey)
  const msg = {
    OracleName: 'BTC_USD',
    Timestamp: '1577441290',
    Data: '60000'
  }
  api.createProposition(wallet, msg).then(console.log)
}

createProposition()
