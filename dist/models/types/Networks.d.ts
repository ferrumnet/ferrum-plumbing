export interface EthNetwork {
    id: string;
    displayName: string;
    baseSymbol: string;
    baseCurrency: string;
    chainId: number;
    explorer: string;
    testnet: boolean;
    defaultRpcEndpoint: string;
    chainLogoUri?: string;
    chainLogoBase64?: string;
}
export declare function updateLogoForNetwork(network: string, logoUri?: string, logoBase64?: string): void;
export declare class Networks {
    static cachetime: number;
    static CHAINS: EthNetwork[];
    static CHAINS_BY_ID: Map<string, EthNetwork>;
    static CHAINS_BY_CHAIN_ID: Map<string, EthNetwork>;
    static for(id: string): EthNetwork;
    static forChainId(id: number): EthNetwork;
    static kickCacheUpdate(): Promise<void>;
}
//# sourceMappingURL=Networks.d.ts.map