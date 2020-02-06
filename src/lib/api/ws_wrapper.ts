/*
  WsWrapper is a wrapper that helps to manage the socket connection with the server.
  Manages IDs for messages

  Methods:
    connect
    disconnect
    request
    subscribe
    unsubscribe
*/

/* WS Get Request params */
export interface WsGetRecentTradesParams {
  market: string,
}

export interface WsGetCandlesticksParams {
  market: string,
  resolution: string,
  from?: string,
  to?: string
}
export interface WsGetOrderHistoryByMarketParams {
  market: string,
  address: string,
}

export interface WsGetOpenOrdersByMarketParams {
  market: string,
  address: string,
}

export type WsGetRequestParams = WsGetRecentTradesParams |
  WsGetCandlesticksParams | WsGetOrderHistoryByMarketParams | WsGetOpenOrdersByMarketParams

/* WS subscribe params */
export interface WsSubscribeCandlesticksParams {
  channel: string,
  market: string,
  resolution: string,
  subscribeUID: string,
}
export interface WsSubscribeRecentTradesParams {
  channel: string,
  market: string,
}
export interface WsSubscribeOrderHistoryByMarketParams {
  channel: string,
  market: string,
  address: string,
}

export interface WsSubscribeOrderbookParams {
  channel: string,
  market: string,
}

export interface WsSubscribeWalletBalanceParams {
  channel: string,
  address: string,
}

export type WsSubscribeParams =
  WsSubscribeCandlesticksParams |
  WsSubscribeRecentTradesParams |
  WsSubscribeOrderHistoryByMarketParams |
  WsSubscribeWalletBalanceParams

/* WS unsubscribe params */
export interface WsUnsubscribeCandlesticksParams {
  channel: string,
  market: string,
  resolution: string,
}

export interface WsUnsubscribeBookParams {
  channel: string,
  market: string,
}

export type WsUnsubscribeParams = WsUnsubscribeCandlesticksParams | WsUnsubscribeBookParams

export class WsWrapper {
  serverWsUrl: string
  socket: any
  msgNum: number
  isConnected: boolean = false
  onMsgCallback: any

  constructor(serverWsUrl: string, onMsgCallback: any) {
    this.serverWsUrl = serverWsUrl
    this.onMsgCallback = onMsgCallback
  }

  public connect() {
    this.socket = new WebSocket(this.serverWsUrl)

    // Config socket
    this.socket.onopen = () => {
      this.isConnected = true
      console.log('socket is connected')
      this.onMsgCallback("connected")
    }

    this.socket.onmessage = (msg: any) => {
      this.onMsgCallback(msg)
    }

    this.socket.onclose = () => {
      this.isConnected = false
      console.log('socket off')
    }
  }

  public disconnect() {
    console.log("closing socket...")
    this.socket.close()
  }

  public checkIsConnected(): boolean {
    return this.isConnected
  }

  public wsGetOrderHistoryByMarket(msgId: string, params: WsGetOrderHistoryByMarketParams) {
    try {
      const msg = JSON.stringify({
        id: msgId,
        method: 'get_order_history_by_market',
        params: { market: params.market, address: params.address }
      })

      this.socket.send(msg)
    } catch (e) { console.log(e.message) }
  }

  public wsGetRecentTrades(msgId: string, p: WsGetRecentTradesParams) {
    try {
      const msg = JSON.stringify({
        id: msgId,
        method: 'get_recent_trades',
        params: { market: p.market }
      })

      this.socket.send(msg)
    } catch (e) { console.log(e.message) }
  }

  public wsGetCandlesticks(msgId: string, p: WsGetCandlesticksParams) {
    try {
      const msg = JSON.stringify({
        id: msgId,
        method: 'get_candlesticks',
        params: {
          market: p.market, resolution: p.resolution,
          from: p.from, to: p.to
        }
      })

      this.socket.send(msg)
    } catch (e) { console.log(e.message) }
  }

  public wsGetOpenOrdersByMarket(msgId: string, params: WsGetOpenOrdersByMarketParams) {
    try {
      const msg = JSON.stringify({
        id: msgId,
        method: 'get_open_order_by_market',
        params: { market: params.market, address: params.address }
      })

      this.socket.send(msg)
    } catch (e) { console.log(e.message) }
  }

  public subscribe(msgId: string, params: WsSubscribeParams[]) { // List of params
    try {
      let channelIds: string[] = params.map((p) => this.generateChannelId(p))
      console.log("Subscribing to " + msgId)
      const msg = JSON.stringify({
        id: msgId,
        method: 'subscribe',
        params: { "channels": [...channelIds] }
      })

      this.socket.send(msg)
    } catch (e) { console.log(e.message) }
  }

  public unsubscribe(msgId: string, params: WsUnsubscribeParams[]) {
    try {
      let channelIds: string[] = params.map((p) => this.generateChannelId(p))
      console.log("Unsubscribing to " + channelIds)
      const msg = JSON.stringify({
        id: msgId,
        method: 'unsubscribe',
        params: { "channels": [...channelIds] }
      })

      this.socket.send(msg)
    } catch (e) { console.log(e.message) }
  }

  public parseChannelId = (rawChannelId: string): any => {
    const [channel, market, resolution, address] = rawChannelId.split(".")
    switch (channel) {
      case 'candlesticks':
        return {
          channel,
          market,
          resolution,
        }
      case 'books':
        return {
          channel,
          market,
        }
      case 'recent_trades':
        return {
          channel,
          market,
        }
      case 'recent_trades':
        return {
          channel,
          market,
        }
      case 'orders':
        return {
          channel,
          market,
          address,
        }
      case 'balances':
        return {
          channel,
          address,
        }
      default:
        throw new Error("Error parsing channelId")
    }
  }

  public generateChannelId(p: WsSubscribeParams | WsUnsubscribeParams): string {
    switch (p.channel) {
      case 'candlesticks': {
        let { channel, market, resolution } = <WsSubscribeCandlesticksParams>p
        return [channel, market, resolution].join('.')
      }
      case 'books': {
        let { channel, market } = <WsSubscribeOrderbookParams>p
        return [channel, market].join('.')
      }
      case 'recent_trades': {
        let { channel, market } = <WsSubscribeRecentTradesParams>p
        return [channel, market].join('.')
      }
      case 'orders': {
        let { channel, market, address } = <WsSubscribeOrderHistoryByMarketParams>p
        return [channel, market, address].join('.')
      }
      case 'balances': {
        let { channel, address } = <WsSubscribeWalletBalanceParams>p
        return [channel, address].join('.')
      }
      default:
        throw new Error("Invalid subscription")
    }
  }
}
