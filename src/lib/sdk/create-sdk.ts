import { SSVSDK } from '@ssv-labs/ssv-sdk';
import { createPublicClient, http } from 'viem';

import { getSdkChain, getSubgraphEndpoint, SupportedSdkNetwork } from './networks';

interface ICreateSdkForNetwork {
  network: SupportedSdkNetwork;
  nodeUrl: string;
}

const sdkCache = new Map<string, SSVSDK>();

export const createSdkForNetwork = ({ network, nodeUrl }: ICreateSdkForNetwork): SSVSDK => {
  const subgraphEndpoint = getSubgraphEndpoint(network);
  const cacheKey = `${network}:${nodeUrl}:${subgraphEndpoint}`;
  const cachedSdk = sdkCache.get(cacheKey);
  if (cachedSdk) {
    return cachedSdk;
  }

  const publicClient = createPublicClient({
    chain: getSdkChain(network),
    transport: http(nodeUrl),
  });

  const sdk = new SSVSDK({
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
