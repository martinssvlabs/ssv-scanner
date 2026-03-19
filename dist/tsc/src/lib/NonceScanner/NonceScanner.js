"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NonceScanner = void 0;
const BaseScanner_1 = require("../BaseScanner");
const create_sdk_1 = require("../sdk/create-sdk");
const networks_1 = require("../sdk/networks");
class NonceScanner extends BaseScanner_1.BaseScanner {
    async run(isCli) {
        if (isCli) {
            console.log('\nScanning blockchain...');
        }
        const network = this.params.network;
        if (!(0, networks_1.isSupportedSdkNetwork)(network)) {
            const supportedNetworks = networks_1.SUPPORTED_SDK_NETWORKS.join(', ');
            throw new Error(`Network "${this.params.network}" is not supported for nonce command. Supported networks: ${supportedNetworks}.`);
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
        // TODO: If nonce resolves to "0", consider an optional on-chain fallback check to disambiguate
        // between a truly new owner and temporary subgraph unavailability/staleness.
        // Resolve owner nonce from SDK subgraph API.
        const ownerNonce = await sdk.api.getOwnerNonce({ owner: this.params.ownerAddress });
        const parsedNonce = BigInt(ownerNonce);
        if (parsedNonce > BigInt(Number.MAX_SAFE_INTEGER)) {
            throw new Error('Owner nonce is larger than MAX_SAFE_INTEGER.');
        }
        return Number(parsedNonce);
    }
}
exports.NonceScanner = NonceScanner;
//# sourceMappingURL=NonceScanner.js.map