import { Wallet, SignMessageOptions } from '../wallet';
import { TransactionOptions } from '../containers/Transaction';
interface Options extends SignMessageOptions, TransactionOptions {
}
export interface MintTokenParams {
    toAddress: string;
    amount: string;
    denom: string;
}
export declare function mintToken(wallet: Wallet, params: MintTokenParams, options?: Options): Promise<any>;
export {};
