// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet
const mnemonics = require('../mnemonics.json')

const privateKey = wallet.getPrivKeyFromMnemonic(mnemonics[1])
const newAccount = wallet.newAccount()

async function newAccountAndMint() {
  const newWallet = await Wallet.connect(newAccount.privateKey)
  const newAddress = newWallet.pubKeyBech32
  console.log(newAccount, newAddress)

  const wallet = await Wallet.connect(privateKey)
  const params = {
    toAddress: newAddress,
    amount: '1000',
    denom: 'swth',
  }
  api.mintToken(wallet, params).then(console.log)
}

newAccountAndMint()
