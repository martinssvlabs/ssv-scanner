import { SSVSDK } from '@ssv-labs/ssv-sdk';
export interface SSVScannerParams {
    network: string;
    nodeUrl: string;
    ownerAddress: string;
}
export declare abstract class BaseScanner {
    protected params: SSVScannerParams;
    constructor(scannerParams: SSVScannerParams);
    protected createSdkForCommand(commandName: string): SSVSDK;
    protected logScanContext(sdk: SSVSDK, additionalLines?: string[]): void;
    protected toSafeNumber(value: bigint, valueName: string): number;
    private getSupportedNetworkOrThrow;
}
