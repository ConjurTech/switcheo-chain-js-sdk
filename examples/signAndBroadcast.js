const { getWallet } = require('../src/wallet')
const { Fee, Msg, StdSignDoc } = require('../src/StdSignDoc')
const { CHAIN_ID } = require('../src/config')
const { marshalJSON } = require('../src/encoder')
const { makeBroadcastTxBody } = require('../src/utils')
const axios = require('axios')


// default properties
const gas = '1000000000000'
const memo = ''

function broadcastPromise(wallet, signature, order) {
  // attach signature to txn body
  const broadcastTxBody = makeBroadcastTxBody({
    signatures: [signature],
    address: wallet.pubKeyBech32,
    gas,
    memo,
    pair: order.Pair,
    side: order.Side,
    quantity: order.Quantity,
    price: order.Price,
    mode: 'sync',
  })
  return wallet.broadcast(broadcastTxBody)
}

function signPromise(order, wallet, accountNumber, sequence) {

  const stdSignMsg = new StdSignDoc({
    chainId: CHAIN_ID,
    accountNumber,
    sequence,
    fee: new Fee([], gas),
    msgs: [
      order
    ],
    memo,
  })
  return wallet.sign(marshalJSON(stdSignMsg))
}

async function getSequeunce(address) {
  const response = await axios.get(`http://localhost:1317/auth/accounts/${address}`)
  return response.data.result.value.sequence
}

function randomQuantity(lotSize) {
  // returns 100 to 500
  const randInt = Math.floor(Math.random() * 5) + 1
  return randInt * lotSize
}
function randomPrice(tick) {
  // returns 0.01 to 0.1
  const randInt = Math.floor(Math.random() * 10) + 1
  return randInt * tick
}

function createOrder(address) {
  const msg = new Msg({
    originator: address,
    pair: 'swth_eth',
    side: Math.random() >= 0.5 ? 'buy' : 'sell',
    quantity: randomQuantity(100).toString(),
    price: randomPrice(0.01),
  })
  console.log(msg)
  return msg
}

function start(mnemonic, accountNumber) {
  return new Promise((resolve, reject) => {
    getWallet(mnemonic)
      .then(async wallet => {

        const sequence = await getSequeunce(wallet.pubKeyBech32)

        let promises = []
        let orders = []

        console.log('starting to sign....')

        // prepare signatures offline
        for (let i = 0; i < 20; i++) {
          const order = createOrder(wallet.pubKeyBech32)
          promises.push(signPromise(order, wallet, accountNumber.toString(), (parseInt(sequence) + i).toString()))
          orders.push(order)
        }

        // resolve promise in series
        Promise.all(promises)
          .then((signatureArray) => {
            console.log('done signing....')

            signatureArray.reduce((previousPromise, nextSignature, index) =>
              previousPromise.then(() => {
                return (
                  broadcastPromise(wallet, nextSignature, orders[index])
              )}
              ), Promise.resolve())
                .then(() => {``
                  console.log('done.')
                  resolve()
                })
                .catch(err => {
                  reject(err)
                })

          })
          .catch(err => {
            reject(err)
          })

      })
      .catch(err => {
        reject(err)
      })
  })
}

module.exports = { start }
