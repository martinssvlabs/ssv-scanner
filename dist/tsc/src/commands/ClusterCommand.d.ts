import { ArgumentParser } from 'argparse';
import { Command } from './Command';
interface IClusterCommandArgs {
    network: string;
    nodeUrl: string;
    ownerAddress: string;
    operatorIds: string;
}
export declare class ClusterCommand extends Command {
    constructor();
    setArguments(parser: ArgumentParser): void;
    run(args: IClusterCommandArgs): Promise<void>;
    private parseOperatorIds;
}
export {};
