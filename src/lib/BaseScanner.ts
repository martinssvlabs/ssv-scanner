import { getAddress } from 'viem';
export interface SSVScannerParams {
  network: string,
  nodeUrl: string,
  ownerAddress: string,
}

export abstract class BaseScanner {
  protected params: SSVScannerParams;

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
}
