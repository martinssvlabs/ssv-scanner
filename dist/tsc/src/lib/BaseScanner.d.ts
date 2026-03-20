export interface SSVScannerParams {
    network: string;
    nodeUrl: string;
    ownerAddress: string;
}
export declare abstract class BaseScanner {
    protected params: SSVScannerParams;
    constructor(scannerParams: SSVScannerParams);
}
