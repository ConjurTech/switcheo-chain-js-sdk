import { Network } from './config';
import { PrivKeySecp256k1, PubKeySecp256k1 } from './utils/wallet';
export interface SignMessageOptions {
    memo?: string;
    sequence?: string;
}
export declare class Wallet {
    static connect(privateKey: string, net?: string): Promise<Wallet>;
    readonly privKey: PrivKeySecp256k1;
    readonly address: Uint8Array;
    readonly pubKeySecp256k1: PubKeySecp256k1;
    readonly pubKeyBase64: string;
    readonly pubKeyBech32: string;
    readonly gas: string;
    readonly network: Network;
    readonly accountNumber: string;
    broadcastMode: string;
    constructor(privateKey: any, accountNumber: any, network: any);
    sign(message: any): {
        pub_key: {
            type: string;
            value: string;
        };
        signature: any;
    };
    broadcast(body: any): Promise<any>;
    getAccount(): Promise<any>;
    signMessage(msg: any, options?: SignMessageOptions): Promise<{
        pub_key: {
            type: string;
            value: string;
        };
        signature: any;
    }>;
}
export declare function newAccount(): {
    mnemonic: string;
    privateKey: string;
};
export declare function getPrivKeyFromMnemonic(mnemonic: any): string;
