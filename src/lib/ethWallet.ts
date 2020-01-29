import Web3 from 'web3'
import VAULT_ABI from './eth/abis/vault.json'
import ERC20_ABI from './eth/abis/erc20.json'
import { ETH_VAULT_ADDRESS } from './constants/addresses'

export class EthWallet {
  public readonly web3: Web3
  public readonly chain: string
  public readonly chainId: string

  constructor(web3) {
    this.web3 = web3
    this.chain = 'ropsten'
    this.chainId = '3'
  }

  public getVault() {
    return this.createContract({ abi: VAULT_ABI, address: ETH_VAULT_ADDRESS})
  }

  public getErc20(address) {
    return this.createContract({ abi: ERC20_ABI, address })
  }

  public createContract({ abi, address }) {
    return new this.web3.eth.Contract(abi, address)
  }

  public async sendTransaction(transaction) {
    const method = transaction.method
    if (method === undefined) {
      throw new Error('transaction.method cannot be empty')
    }
    delete transaction.method

    const { web3 } = this

    if (transaction.from === undefined) {
      transaction.from = await this.getAddress()
    }
    if (transaction.data === undefined) {
      transaction.data = method.encodeABI()
    }
    if (transaction.chain === undefined) {
      transaction.chain = this.chain
    }

    return web3.eth.sendTransaction(transaction)
  }

  public async forceSendTransaction(transaction) {
    const method = transaction.method
    if (method === undefined) {
      throw new Error('transaction.method cannot be empty')
    }
    delete transaction.method
    console.log('inside forceSendTransaction')

    const { web3 } = this
    const sender = await this.getAddress()
    if (transaction.from === undefined) {
      transaction.from = sender
    }
    if (transaction.data === undefined) {
      transaction.data = method.encodeABI()
    }
    if (transaction.value === undefined) {
      transaction.value = '0x00'
    }
    if (transaction.gas === undefined) {
      transaction.gas = '500000' // await method.estimateGas({ value: transaction.value })
    }
    if (transaction.gasPrice === undefined) {
      transaction.gasPrice = await web3.eth.getGasPrice()
    }
    if (transaction.nonce === undefined) {
      transaction.nonce = await web3.eth.getTransactionCount(sender)
    }
    if (transaction.chainId === undefined) {
      transaction.chainId = await web3.eth.getChainId()
    }
    console.log('forceSendTransaction signing transaction')
    const signedTxn = await web3.eth.signTransaction(transaction)
    console.log('forceSendTransaction signing transaction')
    return web3.eth.sendSignedTransaction(signedTxn.raw)
  }

  public async getAddress() {
    const accounts = await this.web3.eth.getAccounts()
    if (accounts.length === 0) {
      throw new Error('No accounts found')
    }

    return accounts[0]
  }
}
