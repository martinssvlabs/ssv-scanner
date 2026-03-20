import { getAddress } from 'viem';
import { SSVSDK } from '@ssv-labs/ssv-sdk';

import { createSdkForNetwork } from './sdk/create-sdk';
import { isSupportedSdkNetwork, SUPPORTED_SDK_NETWORKS, SupportedSdkNetwork } from './sdk/networks';

export interface SSVScannerParams {
  network: string,
  nodeUrl: string,
  ownerAddress: string,
}

export abstract class BaseScanner {
  protected params: SSVScannerParams;

  // Validate shared scanner params once and normalize the owner address format.
  constructor(scannerParams: SSVScannerParams) {
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
    this.params.ownerAddress = getAddress(this.params.ownerAddress);
  }

  // Create an SDK instance for the active command after network validation.
  protected createSdkForCommand(commandName: string): SSVSDK {
    const network = this.getSupportedNetworkOrThrow(commandName);
    return createSdkForNetwork({
      network,
      nodeUrl: this.params.nodeUrl,
    });
  }

  // Print common CLI scan context and optional command-specific lines.
  protected logScanContext(sdk: SSVSDK, additionalLines: string[] = []): void {
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
  protected toSafeNumber(value: bigint, valueName: string): number {
    if (value > BigInt(Number.MAX_SAFE_INTEGER)) {
      throw new Error(`${valueName} is larger than MAX_SAFE_INTEGER.`);
    }

    return Number(value);
  }

  // Restrict commands to explicitly supported SDK networks.
  private getSupportedNetworkOrThrow(commandName: string): SupportedSdkNetwork {
    const network = this.params.network;
    if (!isSupportedSdkNetwork(network)) {
      const supportedNetworks = SUPPORTED_SDK_NETWORKS.join(', ');
      throw new Error(
        `Network "${network}" is not supported for ${commandName} command. Supported networks: ${supportedNetworks}.`,
      );
    }

    return network;
  }
}
