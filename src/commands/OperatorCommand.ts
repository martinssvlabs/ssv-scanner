import { ArgumentParser } from 'argparse';
import { Command } from './Command';
import { OperatorScanner } from '../lib/OperatorScanner/OperatorScanner';
import { SUPPORTED_SDK_NETWORKS } from '../lib/sdk/networks';

interface IOperatorCommandArgs {
  network: string;
  nodeUrl: string;
  ownerAddress: string;
  outputPath?: string;
}

export class OperatorCommand extends Command {
  constructor() {
    super('operator', 'Handles cluster operations');
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
    parser.add_argument('-o', '--output-path', {
      help: `The output path for the operator data`,
      required: false,
      dest: 'outputPath'
    });
  }

  async run(args: IOperatorCommandArgs): Promise<void> {
    try {
      const operatorScanner = new OperatorScanner(args);
      const outputPath = args.outputPath;
      const result = await operatorScanner.run(outputPath, true);
      if (result) {
        console.log(`\nOperator data has been saved to:\n ${result}`);
      } else {
        console.log('\nNo operator data found for this owner. No output file was created.');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('\x1b[31m', message);
    }
  }
}
