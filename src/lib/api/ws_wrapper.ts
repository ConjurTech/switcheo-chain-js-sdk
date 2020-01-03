export interface ICandlesticksGetParams {
    market: string,
    resolution: string,
    from: string,
    to: string
}

export interface ICandlesticksSubParams extends ISubParams {
    resolution: string,
}

export interface ISubParams {
    eventType: string,
    market: string
}

interface IChannelId {
    eventType: string,
    market: string,
    params: any
}

/*
    WsWrapper is a wrapper that helps to manage the socket connection with the server.
    Manages IDs for messages

    Methods:
    connect
    disconnect
    request (get)
    subscribe
    unsubscribe
    resubscribe

    Regarding received message:
    Candlesticks events will be handled differently due to constraints from the charting library
    Candlesticks events will require the callbacks from the charting library which will be called when the WsWrapper receives
    a candlesticks message (Either get or subscription)
    The other events will send messages through the event channel and will be handled by the application
*/

export class WsWrapper {
    serverWsUrl: string
    socket: any
    currId: number
    isConnected: boolean = false
    eventEmitter: any
    candlesticksOnHistoryCallback: any
    candlesticksOnRealtimeCallback: any

    subscriptions: string[] = [] // List of subscribed channelIds
    candlesticksSubscriptions: { [id: string]: string } = {} // subscribeUID to channelIds mapping. For storing candlesticks subscription
    candlesticksRequests: string[] = [] // List of request id number for candlesticks

    constructor(serverWsUrl: string, eventEmitter: any) {
        this.serverWsUrl = serverWsUrl
        this.eventEmitter = eventEmitter
        this.currId = 0
    }

    private handleGetCandlesticksResp(parsedMsg: any) {
        if (parsedMsg.result.length) {
            const bars: ReadonlyArray<object> =
                parsedMsg.result.reverse().map((bar: any) => ({ // Reverse frontend or backend
                    time: bar.time * 1000,
                    close: bar.close,
                    high: bar.high,
                    open: bar.open,
                    low: bar.low,
                    volume: parseFloat(bar.volume) // Ignore quote volume
                }))
            this.candlesticksOnHistoryCallback(bars, { noData: false })
        }
        else {
            this.candlesticksOnHistoryCallback(parsedMsg.result, { noData: true })
        }
    }

    public connect() {
        this.socket = new WebSocket(this.serverWsUrl)

        // Config socket 
        this.socket.onopen = () => {
            this.isConnected = true
            console.log('socket is connected')
            this.eventEmitter("connected")
        }

        this.socket.onmessage = (msg: any) => {
            try {
                let parsedMsg: any
                parsedMsg = JSON.parse(msg.data)
                console.log(parsedMsg)
                if (parsedMsg.id && this.candlesticksRequests.includes(parsedMsg.id)) { // Check if get_candlestick resp
                    this.handleGetCandlesticksResp(parsedMsg)
                }
                else if (parsedMsg.id && Object.keys(this.candlesticksSubscriptions).includes(parsedMsg.id)) { // Check if sub_candlestick resp
                    const lastBar = { ...parsedMsg.result, time: parsedMsg.result.time * 1000 }
                    this.candlesticksOnRealtimeCallback(lastBar)
                }
                else if (parsedMsg.channel && this.subscriptions.includes(parsedMsg.channel)) { // Check if other sub resp
                    let dataChannelId: IChannelId = this.parseChannelId(parsedMsg.channel)
                    this.eventEmitter({ ...dataChannelId, ...parsedMsg }) // Pass it along into the original event channel
                }
                else { // Else is acknowledgement
                    console.log("Acknowledged: " + parsedMsg.result)
                }
            } catch (e) {
                console.error(`Error parsing : ${msg.data}. Error: ${e.message}`)
            }
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

    // Events are either "recent_trades", "books" or "candlesticks_realtime"
    public subscribe(params: ISubParams[]) { // List of params
        let channelIds = params.map((p: ISubParams) => [p.eventType, p.market].join('.'))
        let id: string = `${(this.currId++).toString()}.sub.${channelIds.join('.')}`
        console.log("Subscribing to " + channelIds)
        const msg = JSON.stringify({
            id: id,
            method: 'subscribe',
            params: { "channels": [...channelIds] }
        })
        this.socket.send(msg)
        // Add subscription
        this.subscriptions.push(...channelIds)
    }

    public unsubscribe(params: ISubParams[]) {
        let channelIds: string[] = params.map((p: ISubParams) => [p.eventType, p.market].join('.'))
        let id: string = `${(this.currId++).toString()}.unsub.${channelIds.join('.')}`
        console.log("Unsubscribing to " + channelIds)
        const msg = JSON.stringify({
            id: id,
            method: 'unsubscribe',
            params: { "channels": [...channelIds] }
        })
        this.socket.send(msg)
        // Remove subscription
        this.subscriptions = this.subscriptions.filter((sub) => channelIds.includes(sub))
    }

    public resubscribe(params: ISubParams[]) {
        this.unsubscribe(params)
        setTimeout(() => { }, 1000)
        this.subscribe(params)
    }

    /** Candlesticks functions */

    public getCandlesticks(params: ICandlesticksGetParams, candlesticksOnHistoryCallback: any) {
        let id: string = `${(this.currId++).toString()}.get_candlesticks`
        const msg = JSON.stringify({
            id: id,
            method: 'get_candlesticks',
            params: { ...params }
        })
        this.candlesticksOnHistoryCallback = candlesticksOnHistoryCallback
        // Add candlestick request
        this.candlesticksRequests.push(id.toString())
        this.socket.send(msg)
    }

    public subscribeCandlesticks(params: ICandlesticksSubParams, candlesticksOnRealtimeCallback: any, subscribeUID: any) {
        this.candlesticksOnRealtimeCallback = candlesticksOnRealtimeCallback
        let channelId: string = ['candlesticks', params.market, params.resolution].join('.')
        let id: string = `${subscribeUID}.sub.${channelId}`
        console.log("subscribing to " + channelId)
        const msg = JSON.stringify({
            id: id,
            method: 'subscribe',
            params: { "channels": [channelId] }
        })
        // Add candlestick subscription
        this.candlesticksSubscriptions[subscribeUID] = channelId
        console.log("Current candlestick subscription: " + this.candlesticksSubscriptions)
        this.socket.send(msg)
    }

    public unsubscribeCandlesticks(subscribeUID: any) {
        console.log("unsubscribing candlesticks")
        let channelId: string = this.candlesticksSubscriptions[subscribeUID] // Get channelId from local var
        let id: string = `${subscribeUID}.sub.${channelId}`

        const msg = JSON.stringify({
            id: id,
            method: 'unsubscribe',
            params: { "channels": [channelId] }
        })
        this.socket.send(msg)
        // Remove candlestick subscription
        delete this.candlesticksSubscriptions[subscribeUID]
        console.log("Current candlestick subscription: " + this.candlesticksSubscriptions)
    }

    private parseChannelId(rawChannelId: string): IChannelId {
        let splitChannelId = rawChannelId.split(".")
        let channelId: IChannelId = {
            eventType: splitChannelId[0],
            market: splitChannelId[1],
            params: splitChannelId[2]
        }
        return channelId
    }
}
