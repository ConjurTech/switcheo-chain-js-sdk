// const SDK = require('switcheo-chain-js-sdk') // use this instead if running this sdk as a library
const SDK = require('../.')
const { wallet, api } = SDK
const { Wallet } = wallet
const mnemonics = require('../mnemonics.json')

const privateKey = wallet.getPrivKeyFromMnemonic(mnemonics[0])

async function createVote() {
  const wallet = await Wallet.connect(privateKey)
  const data = {
    ExtAddress: '0x9864e8b36edaf9fd6f63ef28a83e251b7ad11ec0',
    ExtTxID: '0xfca01dc9fe4379c060fc5f8a565e7ba36721544b9583d5b12744ed03b498399b',
    AccAddress: 'swth1nf9vduycy8e2kctz2rl83xkyqlhqvdurchy9tc',
    Blockchain: 'eth',
    ChainID: '3',
    AssetID: '0x000000000000000000000000000000008000003c',
    Amount: '1000000000000000000',
    NetworkFee: '2000000000000000',
    NetworkFeePayer: 'swth13ysl06fmj8c9hupyc6nl8wckgrkaavf447pqfh',
  }
  const msg = {
    OracleID: 'SYSTEM_DEPOSITS',
    Timestamp: '1577441290',
    Data: JSON.stringify(data)
  }
  api.createVote(wallet, msg).then(console.log)
}

createVote()
