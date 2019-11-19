import { Fee } from './StdSignDoc';
export interface TransactionOptions {
    fee?: Fee;
    mode?: string;
}
interface Msg {
    type: string;
    value: any;
}
interface Tx {
    fee: Fee;
    msg: ReadonlyArray<Msg>;
    signatures: ReadonlyArray<any>;
}
export declare class Transaction {
    readonly fee: Fee;
    readonly mode: string;
    readonly tx: Tx;
    constructor(type: any, msg: any, signature: any, options?: TransactionOptions);
}
export {};
