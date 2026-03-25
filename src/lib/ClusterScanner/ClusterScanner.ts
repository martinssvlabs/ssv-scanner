import { SSVSDK } from '@ssv-labs/ssv-sdk';
import { createClusterId } from '@ssv-labs/ssv-sdk/utils';

import { BaseScanner } from '../BaseScanner';

type SdkClusterSnapshot = NonNullable<Awaited<ReturnType<SSVSDK['api']['toSolidityCluster']>>>;
type IClusterSnapshotData = Pick<
  SdkClusterSnapshot,
  'validatorCount' | 'networkFeeIndex' | 'index' | 'active' | 'balance'
>;

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

const DEFAULT_CLUSTER_SNAPSHOT: IClusterSnapshotData = {
  validatorCount: '0',
  networkFeeIndex: '0',
  index: '0',
  active: true,
  balance: '0',
};

export class ClusterScanner extends BaseScanner {
  async run(operatorIds: number[], isCli?: boolean): Promise<IData> {
    // Validate CLI/programmatic inputs once, then sort for deterministic cluster ID generation.
    this.validateOperatorIds(operatorIds);
    const normalizedOperatorIds = [...operatorIds].sort((a: number, b: number) => a - b);

    if (isCli) {
      console.log('\nScanning blockchain...');
    }
    const data: IData = await this.getClusterSnapshot(normalizedOperatorIds, isCli);
    return data;
  }

  // Build an SDK client for the selected network and delegate snapshot retrieval.
  private async getClusterSnapshot(operatorIds: number[], isCli?: boolean): Promise<IData> {
    const sdk = this.createSdk();

    if (isCli) {
      console.log('');
      this.logScanContext(sdk, [`Operator IDs: ${operatorIds.join(',')}`]);
    }

    const [latestBlockNumber, clusterData] = await Promise.all([
      this.getLatestBlockNumber(sdk),
      this.queryClusterSnapshot(sdk, operatorIds),
    ]);

    return {
      payload: {
        'Owner': this.params.ownerAddress,
        'Operators': operatorIds.join(','),
        'Block': latestBlockNumber,
        'Data': [
          clusterData.validatorCount,
          clusterData.networkFeeIndex,
          clusterData.index,
          clusterData.active,
          clusterData.balance,
        ].join(','),
      },
      cluster: {
        validatorCount: Number(clusterData.validatorCount),
        networkFeeIndex: clusterData.networkFeeIndex.toString(),
        index: clusterData.index.toString(),
        active: clusterData.active,
        balance: clusterData.balance.toString(),
      },
    };
  }

  // Query the cluster snapshot directly from SDK-backed subgraph helpers.
  private async queryClusterSnapshot(
    sdk: SSVSDK,
    operatorIds: number[],
  ): Promise<IClusterSnapshotData> {
    const clusterId = createClusterId(this.params.ownerAddress, operatorIds);
    const clusterSnapshot = await sdk.api.toSolidityCluster({ id: clusterId });
    if (!clusterSnapshot) {
      return DEFAULT_CLUSTER_SNAPSHOT;
    }

    const {
      validatorCount,
      networkFeeIndex,
      index,
      active,
      balance,
    } = clusterSnapshot;

    return {
      validatorCount,
      networkFeeIndex,
      index,
      active,
      balance,
    };
  }

  // Guard bigint block values before converting to number for payload/output compatibility.
  private async getLatestBlockNumber(sdk: SSVSDK): Promise<number> {
    const latestBlockNumber = await sdk.config.publicClient.getBlockNumber();
    return this.toSafeNumber(latestBlockNumber, 'Latest block number');
  }

  // Enforce valid and deterministic operator sets before any SDK query.
  private validateOperatorIds(operatorIds: number[]): void {
    if (!Array.isArray(operatorIds)) {
      throw new Error('Operator IDs must be provided as a comma-separated list.');
    }

    if (operatorIds.some((id) => !Number.isSafeInteger(id) || id <= 0)) {
      throw new Error('Operator IDs must be positive integers.');
    }

    if (new Set(operatorIds).size !== operatorIds.length) {
      throw new Error('Operator IDs must be unique.');
    }

    if (operatorIds.length < 4 || operatorIds.length > 13 || operatorIds.length % 3 !== 1) {
      throw new Error('Comma-separated list of operator IDs. The amount must be 3f+1 compatible.');
    }
  }
}
