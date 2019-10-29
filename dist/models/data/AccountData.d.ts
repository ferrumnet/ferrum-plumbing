import { Network } from '../types/AccountTypes';
import { HexString } from './Types';
import { EncryptedData } from "./CryptoData";
export interface AddressWithSecretKeys {
    network: Network;
    address: string;
    privateKeyHex: HexString;
    createdAt: number;
}
export interface AddressWithEncryptedKeys {
    network: Network;
    address: string;
    key: EncryptedData;
    createdAt: number;
}
//# sourceMappingURL=AccountData.d.ts.map