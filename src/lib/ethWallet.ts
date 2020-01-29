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
    if (transaction.from === undefined) {
      transaction.from = await this.getAddress()
    }
    if (transaction.chain === undefined) {
      transaction.chain = this.chain
    }
    console.log('transaction', transaction)
    return this.web3.eth.sendTransaction(transaction)
  }

  public async getAddress() {
    const accounts = await this.web3.eth.getAccounts()
    if (accounts.length === 0) {
      throw new Error('No accounts found')
    }

    return accounts[0]
  }
}
