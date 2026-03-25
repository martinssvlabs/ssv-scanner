"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSdkForNetwork = void 0;
const ssv_sdk_1 = require("@ssv-labs/ssv-sdk");
const viem_1 = require("viem");
const networks_1 = require("./networks");
const sdkCache = new Map();
const SUBGRAPH_API_KEY_ENV = 'SSV_SUBGRAPH_API_KEY';
const getSubgraphApiKey = () => {
    const value = process.env[SUBGRAPH_API_KEY_ENV]?.trim();
    return value ? value : undefined;
};
const createSdkForNetwork = ({ network, nodeUrl }) => {
    const normalizedNodeUrl = nodeUrl.trim();
    const subgraphApiKey = getSubgraphApiKey();
    const cacheKey = `${network}:${normalizedNodeUrl}:${subgraphApiKey ? 'with-key' : 'without-key'}`;
    const cachedSdk = sdkCache.get(cacheKey);
    if (cachedSdk) {
        return cachedSdk;
    }
    const publicClient = (0, viem_1.createPublicClient)({
        chain: (0, networks_1.getSdkChain)(network),
        transport: (0, viem_1.http)(normalizedNodeUrl),
    });
    const sdk = new ssv_sdk_1.SSVSDK({
        publicClient,
        ...(subgraphApiKey
            ? {
                extendedConfig: {
                    subgraph: {
                        apiKey: subgraphApiKey,
                    },
                },
            }
            : {}),
    });
    sdkCache.set(cacheKey, sdk);
    return sdk;
};
exports.createSdkForNetwork = createSdkForNetwork;
//# sourceMappingURL=create-sdk.js.map