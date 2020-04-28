import {EventEmitter} from 'events'
import WebSocket from 'isomorphic-ws'

import MarketClient from './clients/Market/MarketClient'
import TradeClient from './clients/Trade/TradeClient'

export enum Network {
  LocalHost = 'LOCALHOST',
  TestNet = 'TestNet',
  MainNet = 'MainNet',
}

export enum ClientEvent {
  Connect = 'connect',
  Disconnect = 'disconnect',
}

export default class Client extends EventEmitter {
  public market: MarketClient
  public trade: TradeClient

  private socket: WebSocket
  private channelIdToId: Map<string, string> = new Map()

  constructor(network?: Network) {
    super()

    const [restBaseUrl, wsBaseUrl] = this.getBaseUrls(network)
    this.socket = this.newWebSocket(wsBaseUrl)
    this.market = new MarketClient(restBaseUrl, this.socket)
    this.trade = new TradeClient(restBaseUrl, this.socket)
  }

  private getBaseUrls(network: Network): [string, string] {
    switch (network) {
      case Network.TestNet: {
        return ['http://13.251.218.38:5001', 'ws://13.251.218.38:5000/ws']
      }
      default: {
        return ['http://localhost:5001', 'ws://localhost:5000/ws']
      }
    }

  }

  private newWebSocket(baseUrl: string): WebSocket {
    const socket = new WebSocket(baseUrl)

    socket.onopen = () => this.emit(ClientEvent.Connect)
    socket.onclose = () => this.emit(ClientEvent.Disconnect)

    socket.onmessage = (message) => {
      const data = JSON.parse(message.data)
      const {channel, result} = data

      let {id} = data
      if (id) {
        const action = id.split(':')[1]
        if (action === 'sub') {
          const [channelId] = result
          this.channelIdToId.set(channelId, id)
          id += ':ack'
        }
      } else if (channel) {
        id = this.channelIdToId.get(channel)
      }
      else {
        console.error('Unknown event:', data)
        return
      }

      const [clientName] = id.split(':')
      const event = {...data, id}
      const client = this[clientName]
      if (client) {
        client.ws.handleEvent(event)
      } else {
        console.error('Unknown client:', clientName)
      }
    }
  }
}
