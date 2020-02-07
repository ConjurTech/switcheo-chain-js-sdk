// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const PrivateKeyProvider = require('truffle-privatekey-provider')
const Web3 = require('web3')
const SDK = require('../.')
const { ETH_ASSET_ID } = SDK.constants
const { wallet, api } = SDK
const { Wallet } = wallet
const mnemonics = require('../mnemonics.json')

const privateKey = wallet.getPrivKeyFromMnemonic(mnemonics[0])

async function deposit() {
  const wallet = await Wallet.connect(privateKey)
  const provider = new PrivateKeyProvider(
    process.env.ETH_KEY,
    process.env.ETH_URL,
  )
  const web3 = new Web3(provider)
  wallet.connectEthWallet(web3)

  const params = {
    Blockchain: 'eth',
  	AssetID: ETH_ASSET_ID,
  	Amount: web3.utils.toWei("0.1", 'ether'),
  }

  try {
    const result = await api.deposit(wallet, params)
    console.log('result', result)
  } catch (e) {
    console.log('err', e)
  }
}

deposit()
