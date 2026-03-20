import { ArgumentParser } from 'argparse';

export abstract class Command {
  protected parser: ArgumentParser;

  protected constructor(public name: string, protected description: string) {
    this.parser = new ArgumentParser({ description: this.description });
    this.setArguments(this.parser);
  }

  abstract setArguments(parser: ArgumentParser): void;

  /**
   * Parse args custom logic
   * @param args
   */
  parse(args: string[]) {
    // Remove command name itself.
    const argsWithoutCommand = args.slice(1);
    return this.parser.parse_args(argsWithoutCommand);
  }

  abstract run(args: unknown): Promise<void>;
}
