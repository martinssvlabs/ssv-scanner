import { BaseScanner } from '../BaseScanner';
interface IClusterPayload {
    Owner: string;
    Operators: string;
    Block: number;
    Data: string;
}
interface IClusterView {
    validatorCount: number;
    networkFeeIndex: string;
    index: string;
    active: boolean;
    balance: string;
}
export interface IData {
    payload: IClusterPayload;
    cluster: IClusterView;
}
export declare class ClusterScanner extends BaseScanner {
    run(operatorIds: number[], isCli?: boolean): Promise<IData>;
    private getClusterSnapshot;
    private getClusterSnapshotFromSubgraph;
    private queryClusterSnapshot;
    private getLatestBlockNumber;
    private validateOperatorIds;
}
export {};
