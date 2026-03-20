import { chains } from '@ssv-labs/ssv-sdk';
export declare const SUPPORTED_SDK_NETWORKS: readonly ["mainnet", "hoodi"];
export type SupportedSdkNetwork = (typeof SUPPORTED_SDK_NETWORKS)[number];
type SdkChain = (typeof chains)[keyof typeof chains];
export declare const isSupportedSdkNetwork: (network: string) => network is SupportedSdkNetwork;
export declare const getSdkChain: (network: SupportedSdkNetwork) => SdkChain;
export declare const getSubgraphEndpoint: (network: SupportedSdkNetwork) => string;
export {};
