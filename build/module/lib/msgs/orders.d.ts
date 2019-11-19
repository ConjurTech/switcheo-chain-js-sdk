export declare class CreateOrderMsg {
    readonly Originator: string;
    readonly OrderParams: object;
    constructor({ originator, orderParams, }: {
        originator: any;
        orderParams: any;
    });
}
export declare class CancelOrderMsg {
    readonly Originator: string;
    readonly ID: string;
    constructor({ originator, id, }: {
        originator: any;
        id: any;
    });
}
