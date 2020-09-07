// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet
const mnemonics = require('../mnemonics.json')

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function addLiquidity() {
  const newAccount = wallet.newAccount()
  const accountWallet = await Wallet.connect(newAccount.mnemonic)
  const mintAccount = await Wallet.connect('student sell close mad beef exit gospel inform mom industry airport lounge')

  const tokenReq = {
    toAddress: newAccount.pubKeyBech32,
    mint: [
      {
        amount: '100000',
        denom: 'swth',
      },
      {
        amount: '100000',
        denom: 'eth',
      }
    ],
  }
  const mintResult = await api.mintMultipleTestnetTokens(mintAccount, tokenReq)
  console.log('mintResult', mintResult)
  // const mintResult = await api.mintTokens(tokenReq)


  // console.log('minted')
  await sleep(2000)
  console.log('adding liquidity')
  const params = {
    Market: 'swth_eth',
    QuoteAmount: '5',
    MaxBaseAmount: '10000',
  }
  api.addLiquidity(accountWallet, params).then(console.log)

  // await sleep(2000)
  // console.log('removing liquidity')
  // const removeParams = {
  //   Market: 'swth_eth',
  //   Shares: '0.0022360679774997',
  // }
  // api.removeLiquidity(accountWallet, removeParams).then(console.log)
}

addLiquidity()
