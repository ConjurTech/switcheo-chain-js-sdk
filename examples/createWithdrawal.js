// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet

async function createWithdrawal() {
  const newAccount = wallet.newAccount()
  console.log('newAccount', newAccount.pubKeyBech32)
  const tokenReq = {
    address: newAccount.pubKeyBech32,
    amount: '1',
    denom: 'eth',
  }
  const mintResult = await api.mintTokens(tokenReq)
  console.log('mintResult', mintResult)

  const accountWallet = await Wallet.connect(newAccount.privateKey)
  const params = {
    ReceivingAddress: '0x6bae56C7C534c38E08564C4b482a04Ea53B7A29c',
    Blockchain: 'eth',
    ChainID: '3',
    AssetID: '0x000000000000000000000000000000008000003c',
    Amount: '0.97',
  }
  const result = await api.createWithdrawal(accountWallet, params)
  console.log('result', result)
}

createWithdrawal()
