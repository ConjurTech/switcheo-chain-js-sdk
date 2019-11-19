import { Wallet, SignMessageOptions } from '../wallet';
import { TransactionOptions } from '../containers/Transaction';
interface Options extends SignMessageOptions, TransactionOptions {
}
export interface PlaceOrderParams {
    Pair: string;
    Side: string;
    Quantity: string;
    Price: string;
}
export declare function placeOrder(wallet: Wallet, params: PlaceOrderParams, options?: Options): Promise<any>;
export interface CancelOrderParams {
    id: string;
}
export declare function cancelOrder(wallet: Wallet, params: CancelOrderParams, options?: Options): Promise<any>;
export {};
