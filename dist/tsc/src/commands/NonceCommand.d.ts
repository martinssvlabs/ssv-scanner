import { ArgumentParser } from 'argparse';
import { Command } from './Command';
interface INonceCommandArgs {
    network: string;
    nodeUrl: string;
    ownerAddress: string;
}
export declare class NonceCommand extends Command {
    constructor();
    setArguments(parser: ArgumentParser): void;
    run(args: INonceCommandArgs): Promise<void>;
}
export {};
