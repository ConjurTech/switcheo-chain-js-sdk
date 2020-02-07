// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const PrivateKeyProvider = require('truffle-privatekey-provider')
const Web3 = require('web3')
const SDK = require('../.')
const { wallet, api, utils } = SDK
const { Wallet } = wallet
const mnemonics = require('../mnemonics.json')

const privateKey = wallet.getPrivKeyFromMnemonic(mnemonics[0])

const JRC_ASSET_ID = '0xc6e36e1d6f3dc19ec734246d7d0435bf04117c85'

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
  	AssetID: JRC_ASSET_ID,
  	Amount: utils.formatAmount(100, 18)
  }

  try {
    const { complete, result } = await api.deposit(wallet, params)
    if (complete) {
      console.log('deposit succeeded', (await result))
    } else {
      console.log('token allowance increase initiated, deposit must be called again after the allowance is increased', (await result))
    }
  } catch (e) {
    console.log('an error occurred', e)
  }
}

deposit()
