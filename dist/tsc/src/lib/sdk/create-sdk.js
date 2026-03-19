"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSdkForNetwork = void 0;
const ssv_sdk_1 = require("@ssv-labs/ssv-sdk");
const viem_1 = require("viem");
const networks_1 = require("./networks");
const sdkCache = new Map();
const createSdkForNetwork = ({ network, nodeUrl }) => {
    const subgraphEndpoint = (0, networks_1.getSubgraphEndpoint)(network);
    const cacheKey = `${network}:${nodeUrl}:${subgraphEndpoint}`;
    const cachedSdk = sdkCache.get(cacheKey);
    if (cachedSdk) {
        return cachedSdk;
    }
    const publicClient = (0, viem_1.createPublicClient)({
        chain: (0, networks_1.getSdkChain)(network),
        transport: (0, viem_1.http)(nodeUrl),
    });
    const sdk = new ssv_sdk_1.SSVSDK({
        publicClient,
        extendedConfig: {
            subgraph: {
                endpoint: subgraphEndpoint,
            },
        },
    });
    sdkCache.set(cacheKey, sdk);
    return sdk;
};
exports.createSdkForNetwork = createSdkForNetwork;
//# sourceMappingURL=create-sdk.js.map