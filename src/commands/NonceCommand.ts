import { ArgumentParser } from 'argparse';
import { Command } from './Command';
import { NonceScanner } from '../lib/NonceScanner/NonceScanner';
import { SUPPORTED_SDK_NETWORKS } from '../lib/sdk/networks';

interface INonceCommandArgs {
  network: string;
  nodeUrl: string;
  ownerAddress: string;
}

export class NonceCommand extends Command {
  constructor() {
    super('nonce', 'Handles nonce operations');
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
  }

  async run(args: INonceCommandArgs): Promise<void> {
    try {
      const nonceScanner = new NonceScanner(args);
      const result = await nonceScanner.run(true);
      console.log('Next Nonce:', result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('\x1b[31m', message);
    }
  }
}
