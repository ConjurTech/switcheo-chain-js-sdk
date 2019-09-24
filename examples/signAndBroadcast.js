const { getWallet } = require('../src/wallet')
const { Fee, Msg, StdSignDoc } = require('../src/StdSignDoc')
const { CHAIN_ID } = require('../src/config')
const { marshalJSON } = require('../src/encoder')
const { makeBroadcastTxBody } = require('../src/utils')

// default properties
const gas = '1000000000000'
const memo = ''
const pair = 'swth_eth'
const side = 'buy'
const quantity = '100'
const price = '0.100000000000000000'

function broadcastPromise(wallet, signature) {
  // attach signature to txn body
  const broadcastTxBody = makeBroadcastTxBody({
    signatures: [signature],
    address: wallet.pubKeyBech32,
    gas,
    memo,
    pair,
    side,
    quantity,
    price,
    mode: 'async',
  })
  return wallet.broadcast(broadcastTxBody)
}

function signPromise(wallet, sequence) {
  const { pubKeyBech32 } = wallet

  const stdSignMsg = new StdSignDoc({
    chainId: CHAIN_ID,
    accountNumber: '1',
    sequence,
    fee: new Fee([], gas),
    msgs: [
      new Msg({
        originator: pubKeyBech32,
        pair,
        side,
        quantity,
        price,
      })
    ],
    memo,
  })

  return wallet.sign(marshalJSON(stdSignMsg))
}

function start(mnemonic) {

  getWallet(mnemonic)
    .then(wallet => {
      let promises = []

      console.log('starting to sign....')

      // prepare signatures offline
      for(let i=0; i< 100000; i++) {
        promises.push(signPromise(wallet, i.toString()))
      }

      // resolve promise in series
      Promise.all(promises).then((signatureArray) => {
        console.log('done signing....')


        signatureArray.reduce((previousPromise, nextSignature) =>
          previousPromise.then(() =>
            broadcastPromise(wallet, nextSignature)
          ), Promise.resolve())
          .then(() => {
            console.log('done.')
          })

      })

    })
}

module.exports = { start }
