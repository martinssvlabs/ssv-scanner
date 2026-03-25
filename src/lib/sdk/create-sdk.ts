import { SSVSDK } from '@ssv-labs/ssv-sdk';
import { createPublicClient, http } from 'viem';

import { getSdkChain, SupportedSdkNetwork } from './networks';

interface ICreateSdkForNetwork {
  network: SupportedSdkNetwork;
  nodeUrl: string;
}

const sdkCache = new Map<string, SSVSDK>();
const SUBGRAPH_API_KEY_ENV = 'SSV_SUBGRAPH_API_KEY';

// Read and normalize the optional subgraph API key from environment.
const getSubgraphApiKey = (): string | undefined => {
  const value = process.env[SUBGRAPH_API_KEY_ENV]?.trim();
  return value ? value : undefined;
};

// Reuse SDK instances per network/node/auth mode to avoid rebuilding clients repeatedly.
export const createSdkForNetwork = ({ network, nodeUrl }: ICreateSdkForNetwork): SSVSDK => {
  const normalizedNodeUrl = nodeUrl.trim();
  const subgraphApiKey = getSubgraphApiKey();
  const cacheKey = `${network}:${normalizedNodeUrl}:${subgraphApiKey ? 'with-key' : 'without-key'}`;
  const cachedSdk = sdkCache.get(cacheKey);
  if (cachedSdk) {
    return cachedSdk;
  }

  const publicClient = createPublicClient({
    chain: getSdkChain(network),
    transport: http(normalizedNodeUrl),
  });

  const sdk = new SSVSDK({
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
