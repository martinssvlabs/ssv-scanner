"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClusterScanner = void 0;
const utils_1 = require("@ssv-labs/ssv-sdk/utils");
const BaseScanner_1 = require("../BaseScanner");
const DEFAULT_CLUSTER_SNAPSHOT = {
    validatorCount: '0',
    networkFeeIndex: '0',
    index: '0',
    active: true,
    balance: '0',
};
class ClusterScanner extends BaseScanner_1.BaseScanner {
    async run(operatorIds, isCli) {
        // Validate CLI/programmatic inputs once, then sort for deterministic cluster ID generation.
        this.validateOperatorIds(operatorIds);
        const normalizedOperatorIds = [...operatorIds].sort((a, b) => a - b);
        if (isCli) {
            console.log('\nScanning blockchain...');
        }
        const data = await this.getClusterSnapshot(normalizedOperatorIds, isCli);
        return data;
    }
    // Build an SDK client for the selected network and delegate snapshot retrieval.
    async getClusterSnapshot(operatorIds, isCli) {
        const sdk = this.createSdkForCommand('cluster');
        return this.getClusterSnapshotFromSubgraph(operatorIds, sdk, isCli);
    }
    // Fetch block height and cluster snapshot concurrently, then shape the CLI-friendly output.
    async getClusterSnapshotFromSubgraph(operatorIds, sdk, isCli) {
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
    async queryClusterSnapshot(sdk, operatorIds) {
        const clusterId = (0, utils_1.createClusterId)(this.params.ownerAddress, operatorIds);
        const clusterSnapshot = await sdk.api.toSolidityCluster({ id: clusterId });
        if (!clusterSnapshot) {
            return DEFAULT_CLUSTER_SNAPSHOT;
        }
        const { validatorCount, networkFeeIndex, index, active, balance, } = clusterSnapshot;
        return {
            validatorCount,
            networkFeeIndex,
            index,
            active,
            balance,
        };
    }
    // Guard bigint block values before converting to number for payload/output compatibility.
    async getLatestBlockNumber(sdk) {
        const latestBlockNumber = await sdk.config.publicClient.getBlockNumber();
        return this.toSafeNumber(latestBlockNumber, 'Latest block number');
    }
    validateOperatorIds(operatorIds) {
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
exports.ClusterScanner = ClusterScanner;
//# sourceMappingURL=ClusterScanner.js.map