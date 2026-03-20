import { ArgumentParser } from 'argparse';
export declare abstract class Command {
    name: string;
    protected description: string;
    protected parser: ArgumentParser;
    protected constructor(name: string, description: string);
    abstract setArguments(parser: ArgumentParser): void;
    /**
     * Parse args custom logic
     * @param args
     */
    parse(args: string[]): any;
    abstract run(args: unknown): Promise<void>;
}
