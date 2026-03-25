"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseScanner = void 0;
const viem_1 = require("viem");
const create_sdk_1 = require("./sdk/create-sdk");
const networks_1 = require("./sdk/networks");
class BaseScanner {
    // Validate shared scanner params once and normalize the owner address format.
    constructor(scannerParams) {
        if (!scannerParams.nodeUrl) {
            throw Error('ETH1 node is required');
        }
        if (!scannerParams.network) {
            throw Error('Network is required');
        }
        if (!scannerParams.ownerAddress) {
            throw Error('Cluster owner address is required');
        }
        if (scannerParams.ownerAddress.length !== 42) {
            throw Error('Invalid owner address length.');
        }
        if (!scannerParams.ownerAddress.startsWith('0x')) {
            throw Error('Invalid owner address.');
        }
        this.params = scannerParams;
        // convert to checksum addresses
        this.params.ownerAddress = (0, viem_1.getAddress)(this.params.ownerAddress);
    }
    // Create an SDK instance for the active command after network validation.
    createSdkForCommand(commandName) {
        const network = this.getSupportedNetworkOrThrow(commandName);
        return (0, create_sdk_1.createSdkForNetwork)({
            network,
            nodeUrl: this.params.nodeUrl,
        });
    }
    // Print common CLI scan context and optional command-specific lines.
    logScanContext(sdk, additionalLines = []) {
        const contractAddress = sdk.config.contractAddresses.setter;
        if (contractAddress) {
            console.log(`Using contract address: ${contractAddress}`);
        }
        console.log(`Network: ${this.params.network}`);
        console.log(`Owner address: ${this.params.ownerAddress}`);
        for (const line of additionalLines) {
            console.log(line);
        }
    }
    // Convert bigint values safely for CLI/library response payloads.
    toSafeNumber(value, valueName) {
        if (value > BigInt(Number.MAX_SAFE_INTEGER)) {
            throw new Error(`${valueName} is larger than MAX_SAFE_INTEGER.`);
        }
        return Number(value);
    }
    // Restrict commands to explicitly supported SDK networks.
    getSupportedNetworkOrThrow(commandName) {
        const network = this.params.network;
        if (!(0, networks_1.isSupportedSdkNetwork)(network)) {
            const supportedNetworks = networks_1.SUPPORTED_SDK_NETWORKS.join(', ');
            throw new Error(`Network "${network}" is not supported for ${commandName} command. Supported networks: ${supportedNetworks}.`);
        }
        return network;
    }
}
exports.BaseScanner = BaseScanner;
//# sourceMappingURL=BaseScanner.js.map