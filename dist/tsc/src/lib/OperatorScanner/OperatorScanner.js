"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperatorScanner = void 0;
const tslib_1 = require("tslib");
const BaseScanner_1 = require("../BaseScanner");
const create_sdk_1 = require("../sdk/create-sdk");
const networks_1 = require("../sdk/networks");
const fs = tslib_1.__importStar(require("fs"));
const path = tslib_1.__importStar(require("path"));
class OperatorScanner extends BaseScanner_1.BaseScanner {
    async run(outputPath, isCli) {
        if (isCli) {
            console.log('\nScanning blockchain...');
        }
        const network = this.params.network;
        if (!(0, networks_1.isSupportedSdkNetwork)(network)) {
            const supportedNetworks = networks_1.SUPPORTED_SDK_NETWORKS.join(', ');
            throw new Error(`Network "${this.params.network}" is not supported for operator command. Supported networks: ${supportedNetworks}.`);
        }
        const sdk = (0, create_sdk_1.createSdkForNetwork)({
            network,
            nodeUrl: this.params.nodeUrl,
        });
        if (isCli) {
            const contractAddress = sdk.config.contractAddresses.setter;
            if (contractAddress) {
                console.log(`Using contract address: ${contractAddress}`);
            }
            console.log(`Network: ${this.params.network}`);
            console.log(`Owner address: ${this.params.ownerAddress}`);
        }
        const entries = await this.getOwnerOperators(sdk);
        if (entries.length === 0) {
            return null;
        }
        return this.writeOperatorsFile(entries, outputPath);
    }
    // Resolve all unique operator IDs across owner clusters and fetch their public keys.
    async getOwnerOperators(sdk) {
        const clusters = await sdk.api.getClusters({
            owner: this.params.ownerAddress.toLowerCase(),
        });
        const operatorIdSet = new Set();
        for (const cluster of clusters) {
            for (const operatorId of cluster.operatorIds) {
                operatorIdSet.add(String(operatorId));
            }
        }
        const uniqueOperatorIds = Array
            .from(operatorIdSet)
            .sort((a, b) => Number(a) - Number(b));
        if (uniqueOperatorIds.length === 0) {
            return [];
        }
        const operators = await sdk.api.getOperators({
            operatorIds: uniqueOperatorIds,
        });
        return operators
            .map((operator) => ({
            id: Number(operator.id),
            pubkey: operator.publicKey,
        }))
            .sort((a, b) => a.id - b.id);
    }
    writeOperatorsFile(entries, outputPath) {
        const dirPath = outputPath ? outputPath : path.join(__dirname, '../../data');
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        const filePath = path.join(dirPath, `operator-pubkeys-${this.params.network}.json`);
        fs.writeFileSync(filePath, JSON.stringify(entries, null, 2));
        return filePath;
    }
}
exports.OperatorScanner = OperatorScanner;
//# sourceMappingURL=OperatorScanner.js.map