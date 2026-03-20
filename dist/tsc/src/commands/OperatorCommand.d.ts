import { ArgumentParser } from 'argparse';
import { Command } from './Command';
interface IOperatorCommandArgs {
    network: string;
    nodeUrl: string;
    ownerAddress: string;
    outputPath?: string;
}
export declare class OperatorCommand extends Command {
    constructor();
    setArguments(parser: ArgumentParser): void;
    run(args: IOperatorCommandArgs): Promise<void>;
}
export {};
