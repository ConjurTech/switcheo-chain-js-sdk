const { getWallet } = require('../src/wallet')
const { Fee, CreateMsg, CancelMsg, StdSignDoc } = require('../src/StdSignDoc')
const { CHAIN_ID } = require('../src/config')
const { marshalJSON } = require('../src/encoder')
const { makeCreateBroadcastTxBody, makeCancelBroadcastTxBody } = require('../src/utils')
const axios = require('axios')


// default properties
const gas = '1000000000000'
const memo = ''

function broadcastPromise(wallet, signature, txn) {
  // attach signature to txn body
  const { msg } = txn
  if (txn.type === 'create') {
    const broadcastTxBody = makeCreateBroadcastTxBody({
      signatures: [signature],
      address: wallet.pubKeyBech32,
      gas,
      memo,
      pair: msg.Pair,
      side: msg.Side,
      quantity: msg.Quantity,
      price: msg.Price,
      mode: 'async',
    })
    return wallet.broadcast(broadcastTxBody)
  }
  if (txn.type === 'cancel') {
    const broadcastTxBody = makeCancelBroadcastTxBody({
      signatures: [signature],
      address: wallet.pubKeyBech32,
      gas,
      memo,
      id: msg.ID,
      mode: 'sync',
    })
    return wallet.broadcast(broadcastTxBody)
  }
}

function signPromise(txn, wallet, accountNumber, sequence) {

  const stdSignMsg = new StdSignDoc({
    chainId: CHAIN_ID,
    accountNumber,
    sequence,
    fee: new Fee([], gas),
    msgs: [
      txn
    ],
    memo,
  })
  return wallet.sign(marshalJSON(stdSignMsg))
}

async function getSequeunce(address) {
  const response = await axios.get(`http://localhost:1317/auth/accounts/${address}`)
  return response.data.result.value.sequence
}

async function getOpenOrders(address) {
  const response = await axios.get(`http://localhost:1317/broker/accountOpenOrders/${address}`)
  return response.data.result
}

function randomQuantity(lotSize) {
  // returns 100 to 700
  let randInt = Math.floor(Math.random() * 7) + 1
  // 10% chance of doubling
  if (Math.random() >= 0.9) {
    randInt = randInt * 2
  }
  return randInt * lotSize
}
function randomPrice(tick) {
  // returns 0.01 to 0.06
  const randInt = Math.floor(Math.random() * 6) + 1
  return randInt * tick
}

function createSwthEthOrder(address) {
  const msg = new CreateMsg({
    originator: address,
    pair: 'swth_eth',
    side: Math.random() >= 0.5 ? 'buy' : 'sell',
    quantity: randomQuantity(100).toString(),
    price: randomPrice(0.01),
  })
  return {
    msg,
    type: 'create'
  }
}

function createSwthBtcOrder(address) {
  const msg = new CreateMsg({
    originator: address,
    pair: 'swth_btc',
    side: Math.random() >= 0.5 ? 'buy' : 'sell',
    quantity: randomQuantity(1000000).toString(),
    price: randomPrice(0.000001),
  })
  return {
    msg,
    type: 'create'
  }
}

function createCancelOrder(address, id) {
  const msg = new CancelMsg({
    originator: address,
    id,
  })
  return {
    msg,
    type: 'cancel'
  }
}

const loops = 5
function start(mnemonic, accountNumber) {
  return new Promise((resolve, reject) => {
    getWallet(mnemonic)
      .then(async wallet => {

        const sequence = await getSequeunce(wallet.pubKeyBech32)
        const openOrders = await getOpenOrders(wallet.pubKeyBech32)
    
        let promises = []
        let txns = []

        // prepare signatures offline
        
        for (let i = 0; i < loops; i++) {
          let txn
          // 40% change of generating a cancel order
          if (Math.random() >= 0.45 || openOrders === null || openOrders.length < loops) {
            // 70% chance for generating swth_eth order
            if (Math.random() >= 0.3) {
              txn = createSwthEthOrder(wallet.pubKeyBech32)
            } else {
              txn = createSwthBtcOrder(wallet.pubKeyBech32)
            }
          } else {
            txn = createCancelOrder(wallet.pubKeyBech32, openOrders[i].id)
          }
          // const txn = createCancelOrder(wallet.pubKeyBech32, openOrders[0].id)
          // console.log('txn', txn)
          promises.push(signPromise(txn.msg, wallet, accountNumber.toString(), (parseInt(sequence) + i).toString()))
          txns.push(txn)
        }

        // resolve promise in series
        Promise.all(promises)
          .then((signatureArray) => {
            // console.log('done signing....')

            signatureArray.reduce((previousPromise, nextSignature, index) =>
              previousPromise.then(() => {
                return (
                  broadcastPromise(wallet, nextSignature, txns[index])
              )}
              ), Promise.resolve())
                .then(() => {``
                  // console.log('done.')
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
