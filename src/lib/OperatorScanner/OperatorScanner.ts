import { BaseScanner } from '../BaseScanner';
import { SSVSDK } from '@ssv-labs/ssv-sdk';
import * as fs from 'fs';
import * as path from 'path';

interface IOperatorEntry {
  id: number;
  pubkey: string;
}

export class OperatorScanner extends BaseScanner {
  // Gather operator pubkeys for the owner and optionally persist them as JSON.
  async run(outputPath?: string, isCli?: boolean): Promise<string | null> {
    if (isCli) {
      console.log('\nScanning blockchain...');
    }

    const sdk = this.createSdkForCommand('operator');

    if (isCli) {
      this.logScanContext(sdk);
    }

    const entries = await this.getOwnerOperators(sdk);
    if (entries.length === 0) {
      return null;
    }

    return this.writeOperatorsFile(entries, outputPath);
  }

  // Resolve all unique operator IDs across owner clusters and fetch their public keys.
  private async getOwnerOperators(sdk: SSVSDK): Promise<IOperatorEntry[]> {
    const clusters = await sdk.api.getClusters({
      owner: this.params.ownerAddress.toLowerCase(),
    });

    const operatorIdSet = new Set<string>();
    for (const cluster of clusters) {
      for (const operatorId of cluster.operatorIds) {
        operatorIdSet.add(String(operatorId));
      }
    }

    const uniqueOperatorIds = Array
      .from(operatorIdSet)
      .sort((a: string, b: string) => Number(a) - Number(b));

    if (uniqueOperatorIds.length === 0) {
      return [];
    }

    const operators = await sdk.api.getOperators({
      operatorIds: uniqueOperatorIds,
    });

    return operators
      .map((operator) => ({
        id: Number(operator.id),
        pubkey: operator.publicKey,
      }))
      .sort((a: IOperatorEntry, b: IOperatorEntry) => a.id - b.id);
  }

  // Persist operator entries to disk using either custom or default output directory.
  private writeOperatorsFile(entries: IOperatorEntry[], outputPath?: string): string {
    const dirPath = outputPath ? outputPath : path.join(__dirname, '../../data');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const filePath = path.join(dirPath, `operator-pubkeys-${this.params.network}.json`);
    fs.writeFileSync(filePath, JSON.stringify(entries, null, 2));

    return filePath;
  }
}
