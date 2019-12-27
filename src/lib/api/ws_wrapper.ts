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

    onMessage:
    Candlesticks events will be handled differently due to constraints from the charting library
    Candlesticks events will require the callbacks from the charting library which will be called when the WsWrapper receives
    a candlesticks message (Either get or subscription)
    The other events will send messages through the event channel and will be handled by the application
*/

export interface ICandlesticksGetParams {
    pair: string,
    resolution: number,
    from: number,
    to: number
}

export interface ISubParams {
    eventType: string,
    pair: string
}

export interface ICandlesticksSubParams extends ISubParams {
    resolution: number,
}

export interface IChannelId {
    eventType: string,
    pair: string,
    params: any
}

// TODO create interfaces for additional events
// TODO handle acknowledments for subscritpion and unsubscriptions (TBC)
// TODO implement unique ID System (Currently is just ++ from 1)

export class WsWrapper {
    serverWsUrl: string
    isConnected: boolean = false
    subscriptions: string[] = [] // List of subscribed channelIds
    candlesticksSubscriptions: { [id: number]: string } = {} // subscribedIds to ChanneId mapping. For storing candlesticks subscription
    candlesticksRequests: number[] = [] // List of requestIds for candlesticks 

    socket: any
    eventEmitter: any
    currId: number
    candlesticksOnHistoryCallback: any
    candlesticksOnRealtimeCallback: any

    constructor(serverWsUrl: string, eventEmitter: any) {
        this.serverWsUrl = serverWsUrl
        this.eventEmitter = eventEmitter
        this.currId = 0
    }

    public connect() {
        this.socket = new WebSocket(this.serverWsUrl)

        // Config socket 
        this.socket.onopen = () => {
            this.isConnected = true
            console.log('socket on')
        }

        /** Example message
         *  id: 1
         *  event: "candlesticks.swth_eth.1"
         *  sequenceNumber: "100"
         *  result: Candlestick obj
         */
        this.socket.onmessage = (msg: any) => {
            try {
                let parsedMsg: any
                parsedMsg = JSON.parse(msg.data)
                // Check if getCandlesticks request
                if (this.candlesticksRequests.includes(parsedMsg.id)) {
                    if (parsedMsg.result.length)
                        this.candlesticksOnHistoryCallback(parsedMsg.result, { noData: false })
                    else
                        this.candlesticksOnHistoryCallback(parsedMsg.result, { noData: true })
                }
                else { // Subscription requests
                    let dataChannelId: IChannelId = this.parseChannelId(parsedMsg.event)
                    if (dataChannelId.eventType === 'candlesticks')
                        this.candlesticksOnRealtimeCallback(parsedMsg.result)
                    else
                        this.eventEmitter({...dataChannelId, ...parsedMsg}) // Pass it along into the original event channel
                }
            } catch (e) {
                console.error(`Error parsing : ${msg.data}`)
            }
        }

        this.socket.onclose = () => {
            this.isConnected = false
            console.log('socket off')
        }
    }

    public disconnect() {
        /*
            // Unsubscribe to all the channels
            let channelId: any
            for (channelId in Object.values(this.subscriptions)) {
                this.unsubscribe(channelId)
            }
        */
        this.socket.close()
    }
    
    public checkIsConnected(): boolean {
        return this.isConnected
    }

    // Events are either "recent_trades", "books" or "candlesticks_realtime"
    public subscribe(params: ISubParams[]) { // List of params
        let Id: any = this.currId++
        let channelIds = params.map((p: ISubParams) => this.generateChannelId(p))
        const msg = JSON.stringify({
            ID: Id,
            Method: 'subscribe',
            Params: { "channels": [...channelIds] }
        })
        this.socket.send(msg)
        // Add subscription
        this.subscriptions.push(...channelIds)
    }

    public unsubscribe(params: ISubParams[]) {
        let Id: any = this.currId++
        let channelIds: string[] = params.map((p: ISubParams) => this.generateChannelId(p))
        const msg = JSON.stringify({
            ID: Id,
            Method: 'unsubscribe',
            Params: { "channels": [...channelIds] }
        })
        this.socket.send(msg)
        // Remove subscription
        this.subscriptions = this.subscriptions.filter((sub) => channelIds.includes(sub))
    }

    public resubscribe(params: ISubParams[]) {
        this.unsubscribe(params)
        this.subscribe(params)
    }

    /** Candlesticks functions */
    
    public getCandlesticks(params: ICandlesticksGetParams, candlesticksOnHistoryCallback: any) {
        let Id: any = this.currId++
        const msg = JSON.stringify({
            ID: Id,
            Method: 'get_candlesticks',
            ...params
        })
        this.candlesticksOnHistoryCallback = candlesticksOnHistoryCallback
        this.socket.send(msg)
    }

    public subscribeCandlesticks(params: ICandlesticksSubParams, candlesticksOnRealtimeCallback: any, subscribeUID: any) {
        this.candlesticksOnHistoryCallback = candlesticksOnRealtimeCallback
        let channelId: string = this.generateCandlesticksChannelId(params)
        const msg = JSON.stringify({
            ID: subscribeUID,
            Method: 'subscribe',
            Params: { "channels": [channelId] }
        })
        this.socket.send(msg)
        // Add candlestick subscription
        this.candlesticksSubscriptions[subscribeUID] = channelId
    }

    public unsubscribeCandlesticks(subscribeUID: any) {
        let channelId: string = this.candlesticksSubscriptions[subscribeUID] // Get channelId from local var
        const msg = JSON.stringify({
            ID: subscribeUID,
            Method: 'unsubscribe',
            Params: { "channels": [channelId] }
        })
        this.socket.send(msg)
        // Remove candlestick subscription
        delete this.candlesticksSubscriptions[subscribeUID]
    }

    private parseChannelId(rawChannelId: string): IChannelId {
        let splitChannelId = rawChannelId.split('.')
        let channelId: IChannelId = {
            eventType: splitChannelId[0],
            pair: splitChannelId[1],
            params: splitChannelId[2] // TODO fit params to event
        }
        return channelId
    }

    private generateChannelId(params: ISubParams): string {
        return [params.eventType, params.pair].join('.')
    }

    private generateCandlesticksChannelId(params: ICandlesticksSubParams): string {
        return [params.eventType, params.pair, params.resolution].join('.')
    }
}
