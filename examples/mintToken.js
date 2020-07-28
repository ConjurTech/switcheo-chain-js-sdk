// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const fetch = require('node-fetch')
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet
const mnemonics = require('../mnemonics.json')

async function getBankBalances(address) {
  return fetch('http://localhost:1317/bank/balances/' + address)
    .then(res => res.json()) // expecting a json response
}

async function mint(id) {
  const mintAccount = await Wallet.connect('quarter supreme focus dad thank utility aerobic improve flat sunset butter speed')
  const newAccount = wallet.newAccount()
  const toAddress = newAccount.pubKeyBech32
  const params = {
    toAddress,
    mint: [{
      amount: '1000',
      denom: 'swth',
    }],
  }
  const result = await api.mintMultipleTestnetTokens(mintAccount, params)

  console.log('------------------')
  console.log(id + ":", toAddress)
  const bankBalances = await getBankBalances(toAddress)
  console.log('bank balances', bankBalances)
  const account = await Wallet.connect(newAccount.mnemonic)
  console.log('account', await account.getAccount())
  console.log('balances', await account.getWalletBalance())
  // wait for a short time
  await new Promise(resolve => setTimeout(resolve, 500))
  console.log('after delay balances', await account.getWalletBalance())
  console.log(result)
  console.log('------------------')
}

async function run() {
  for (let i = 0; i < 1; i++) {
    mint(i)
  }
}

run()
