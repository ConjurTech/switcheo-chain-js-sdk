// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet

function handleResponse(label, response) {
  console.log(label, response)
}

async function testSequenceCounter() {
  const newAccount = wallet.newAccount()
  const tokenReq = {
    address: newAccount.pubKeyBech32,
    amount: '10000',
    denom: 'swth',
  }
  await api.mintTokens(tokenReq)

  const accountWallet = await Wallet.connect(newAccount.privateKey, 'LOCALHOST', { useSequenceCounter: true })
  const params = {
    Market: 'swth_eth',
    Side: 'sell',
    Quantity: '200',
    Price: '1.01',
  }
  api.createOrder(accountWallet, params).then((response) => handleResponse('response1', response))
  api.createOrder(accountWallet, params).then((response) => handleResponse('response2', response))
  api.createOrder(accountWallet, params).then((response) => handleResponse('response3', response))

  await new Promise(resolve => setTimeout(resolve, 500))

  api.createOrder(accountWallet, params).then((response) => handleResponse('response4', response))
  api.createOrder(accountWallet, params).then((response) => handleResponse('response5', response))

  await new Promise(resolve => setTimeout(resolve, 1000))

  api.createOrder(accountWallet, params).then((response) => handleResponse('response6', response))
  api.createOrder(accountWallet, params).then((response) => handleResponse('response7', response))

  await new Promise(resolve => setTimeout(resolve, 200))

  api.createOrder(accountWallet, params).then((response) => handleResponse('response8', response))
  api.createOrder(accountWallet, params).then((response) => handleResponse('response9', response))
}

testSequenceCounter()
