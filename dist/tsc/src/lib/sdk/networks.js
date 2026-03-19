"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubgraphEndpoint = exports.getSdkChain = exports.isSupportedSdkNetwork = exports.SUPPORTED_SDK_NETWORKS = void 0;
const ssv_sdk_1 = require("@ssv-labs/ssv-sdk");
exports.SUPPORTED_SDK_NETWORKS = ['mainnet', 'hoodi'];
const SDK_NETWORK_CHAINS = {
    mainnet: ssv_sdk_1.chains.mainnet,
    hoodi: ssv_sdk_1.chains.hoodi,
};
const isSupportedSdkNetwork = (network) => {
    return exports.SUPPORTED_SDK_NETWORKS.includes(network);
};
exports.isSupportedSdkNetwork = isSupportedSdkNetwork;
const getSdkChain = (network) => {
    return SDK_NETWORK_CHAINS[network];
};
exports.getSdkChain = getSdkChain;
const getSubgraphEndpoint = (network) => {
    const endpoint = ssv_sdk_1.graph_endpoints[(0, exports.getSdkChain)(network).id];
    if (!endpoint) {
        throw new Error(`Subgraph endpoint is not configured in SDK for network "${network}".`);
    }
    return endpoint;
};
exports.getSubgraphEndpoint = getSubgraphEndpoint;
//# sourceMappingURL=networks.js.map