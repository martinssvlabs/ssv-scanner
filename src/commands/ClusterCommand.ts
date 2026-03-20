import { ArgumentParser } from 'argparse';
import { Command } from './Command';
import { ClusterScanner } from '../lib/ClusterScanner/ClusterScanner';
import { SUPPORTED_SDK_NETWORKS } from '../lib/sdk/networks';

interface IClusterCommandArgs {
  network: string;
  nodeUrl: string;
  ownerAddress: string;
  operatorIds: string;
}

export class ClusterCommand extends Command {
  constructor() {
    super('cluster', 'Handles cluster operations');
  }

  setArguments(parser: ArgumentParser): void {
    parser.add_argument('-nw', '--network', {
      help: 'The network',
      choices: [...SUPPORTED_SDK_NETWORKS],
      required: true,
      dest: 'network',
    });
    parser.add_argument('-n', '--node-url', {
      help: `ETH1 (execution client) node endpoint url`,
      required: true,
      dest: 'nodeUrl'
    });
    parser.add_argument('-oa', '--owner-address', {
      help: "The cluster owner address (in the SSV contract)",
      required: true,
      dest: 'ownerAddress'
    });
    parser.add_argument('-oids', '--operator-ids', {
      help: `Comma-separated list of operators IDs regarding the cluster that you want to query`,
      required: true,
      dest: 'operatorIds'
    });
  }

  async run(args: IClusterCommandArgs): Promise<void> {
    try {
      const operatorIds = this.parseOperatorIds(args.operatorIds);
      const clusterScanner = new ClusterScanner(args);
      const result = await clusterScanner.run(operatorIds, true);
      console.table(result.payload);
      console.log('Cluster snapshot:');
      console.table(result.cluster);
      console.log(JSON.stringify({
        'block': result.payload.Block,
        'cluster snapshot': result.cluster,
        'cluster': Object.values(result.cluster)
      }, (_, v) => typeof v === 'bigint' ? v.toString() : v, '  '));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('\x1b[31m', message);
    }
  }

  private parseOperatorIds(rawOperatorIds: string): number[] {
    if (typeof rawOperatorIds !== 'string' || !rawOperatorIds.trim()) {
      throw new Error('Operator IDs are required.');
    }

    return rawOperatorIds.split(',').map((value: string) => {
      const parsedValue = value.trim();
      if (!parsedValue) {
        throw new Error('Operator IDs must not include empty values.');
      }

      const operatorId = Number(parsedValue);
      if (!Number.isSafeInteger(operatorId) || operatorId <= 0) {
        throw new Error(`Invalid operator ID "${parsedValue}". Operator IDs must be positive integers.`);
      }

      return operatorId;
    });
  }
}
