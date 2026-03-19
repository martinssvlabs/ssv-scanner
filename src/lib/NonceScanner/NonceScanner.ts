import { BaseScanner } from '../BaseScanner';
import { createSdkForNetwork } from '../sdk/create-sdk';
import { isSupportedSdkNetwork, SUPPORTED_SDK_NETWORKS } from '../sdk/networks';

export class NonceScanner extends BaseScanner {
  async run(isCli?: boolean): Promise<number> {
    if (isCli) {
      console.log('\nScanning blockchain...');
    }

    const network = this.params.network;
    if (!isSupportedSdkNetwork(network)) {
      const supportedNetworks = SUPPORTED_SDK_NETWORKS.join(', ');
      throw new Error(
        `Network "${this.params.network}" is not supported for nonce command. Supported networks: ${supportedNetworks}.`,
      );
    }

    const sdk = createSdkForNetwork({
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
