import fetch from 'node-fetch'
import { Network } from '../config'

export function getPrices(network: Network, market: string): Promise<any> {
  return fetch(`${network.REST_URL}/get_prices?market=${market}`)
    .then(res => res.json()) // expecting a json response
}

export function getLastPrice(network: Network, market: string): Promise<any> {
  return getPrices(network, market)
    .then(res => ({ last: res.last, updated_at: res.index_updated_at })) // expecting a json response
}

export function getIndexPrice(network: Network, market: string): Promise<any> {
  return getPrices(network, market)
    .then(res => ({ last: res.index, updated_at: res.index_updated_at })) // expecting a json response
}
