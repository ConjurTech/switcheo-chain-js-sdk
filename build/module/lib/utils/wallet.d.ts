/// <reference types="node" />
export declare class PrivKeySecp256k1 {
    readonly privKey: Buffer;
    constructor(privKey: any);
    toBytes(): Uint8Array;
    toPubKey(): PubKeySecp256k1;
    equals(privKey: any): boolean;
    sign(msg: any): any;
}
export declare class PubKeySecp256k1 {
    readonly pubKey: Buffer;
    constructor(pubKey: any);
    toBytes(): Uint8Array;
    toAddress(): Address;
    equals(pubKey: any): boolean;
    verify(msg: any, sig: any): any;
}
declare class Address {
    readonly address: Buffer;
    constructor(address: any);
    fromBech32(prefix: any, bech32Addr: any): Address;
    toBech32(prefix: any): any;
    toBytes(): Uint8Array;
}
export declare function getPath(): string;
export {};
