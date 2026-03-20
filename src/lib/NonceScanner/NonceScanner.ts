import { BaseScanner } from '../BaseScanner';

export class NonceScanner extends BaseScanner {
  async run(isCli?: boolean): Promise<number> {
    if (isCli) {
      console.log('\nScanning blockchain...');
    }

    const sdk = this.createSdkForCommand('nonce');

    if (isCli) {
      this.logScanContext(sdk);
    }

    // TODO: If nonce resolves to "0", consider an optional on-chain fallback check to disambiguate
    // between a truly new owner and temporary subgraph unavailability/staleness.
    // Resolve owner nonce from SDK subgraph API.
    const ownerNonce = await sdk.api.getOwnerNonce({ owner: this.params.ownerAddress });
    const parsedNonce = BigInt(ownerNonce);
    return this.toSafeNumber(parsedNonce, 'Owner nonce');
  }
}
