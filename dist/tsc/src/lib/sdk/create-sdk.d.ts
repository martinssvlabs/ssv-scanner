import { SSVSDK } from '@ssv-labs/ssv-sdk';
import { SupportedSdkNetwork } from './networks';
interface ICreateSdkForNetwork {
    network: SupportedSdkNetwork;
    nodeUrl: string;
}
export declare const createSdkForNetwork: ({ network, nodeUrl }: ICreateSdkForNetwork) => SSVSDK;
export {};
