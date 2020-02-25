// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet

async function createOrder() {
  const newAccount = wallet.newAccount()
  const tokenReq = {
    address: newAccount.pubKeyBech32,
    amount: '1000',
    denom: 'swth',
  }
  await api.mintTokens(tokenReq)

  const accountWallet = await Wallet.connect(newAccount.privateKey)
  const params = {
    Market: 'swth_eth',
    Side: 'sell',
    Quantity: '200',
    Price: '1.01',
  }
  const result = await api.createOrder(accountWallet, params)
  console.log('result', result)
}

createOrder()
