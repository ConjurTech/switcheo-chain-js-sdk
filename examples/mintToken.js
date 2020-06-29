// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet
const mnemonics = require('../mnemonics.json')

async function mint(id) {
  const newAccount = wallet.newAccount()
  const toAddress = newAccount.pubKeyBech32
  const params = {
    address: toAddress,
    amount: '1000',
    denom: 'swth',
  }
  const result = await api.mintTokens(params)
  console.log('------------------')
  console.log(id + ":", toAddress)
  console.log(result)
  console.log('------------------')
}

async function run() {
  for (let i = 0; i < 10; i++) {
    mint(i)
  }
}

run()
