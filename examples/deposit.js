// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const PrivateKeyProvider = require('truffle-privatekey-provider')
const Web3 = require('web3')
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet
const mnemonics = require('../mnemonics.json')

const privateKey = wallet.getPrivKeyFromMnemonic(mnemonics[0])

async function deposit() {
  const wallet = await Wallet.connect(privateKey)
  const provider = new PrivateKeyProvider(
    process.env.ethKey,
    process.env.ethUrl
  )
  const web3 = new Web3(provider)
  wallet.connectEthWallet(web3)

  const params = {
    Blockchain: 'eth',
  	AssetID: '0x000000000000000000000000000000008000003c',
  	Amount: "0.1",
  }

  const result = await api.deposit(wallet, params)
  console.log('result', result)
}

deposit()
