// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet } = SDK
const { Wallet } = wallet

const net = 'LOCALHOST'

async function signalDeposit() {
  const newAccount = wallet.newAccount()
  console.log('newAccount address', newAccount.pubKeyBech32)
  console.log('newAccount mnemonic', newAccount.mnemonic)
  const account = await Wallet.connect(newAccount.mnemonic, net)
  const { address } = await account.getDepositAddress('eth')
  const assetId = '0x000000000000000000000000000000008000003c'
  const result = await account.signalDeposit('eth', address, assetId)
  console.log('result', await result.text())
}

signalDeposit()
