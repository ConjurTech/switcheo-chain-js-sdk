// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet
const mnemonics = require('../mnemonics.json')

const privateKey = wallet.getPrivKeyFromMnemonic(mnemonics[1])

async function mintToken() {
  const wallet = await Wallet.connect(privateKey)
  const toAddress = 'cosmos1rzdwrr33z5pxw2ndtsdluxhce9p26emfs0f5dm'
  const params = {
    toAddress,
    amount: '1000',
    denom: 'swth',
  }
  api.mintToken(wallet, params).then(console.log)
}
mintToken()
