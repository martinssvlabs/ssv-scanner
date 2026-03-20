import figlet from 'figlet';
import pkg from '../package.json';
import * as process from 'process';
import { ArgumentParser } from 'argparse';
import { NonceCommand } from './commands/NonceCommand';
import { ClusterCommand } from './commands/ClusterCommand';
import { OperatorCommand } from './commands/OperatorCommand';

const renderFigletMessage = async (message: string): Promise<string> => {
  return new Promise((resolve) => {
    figlet(message, (error: Error | null, output?: string) => {
      if (error) {
        return resolve('');
      }
      resolve(output || '');
    });
  });
};

export default async function main(): Promise<void> {
  const messageText = `SSV Scanner v${pkg.version}`;
  const message = await renderFigletMessage(messageText);
  if (message) {
    console.log(' -----------------------------------------------------------------------------------');
    console.log(message);
    console.log(' -----------------------------------------------------------------------------------');
    for (const str of String(pkg.description).match(/.{1,75}/g) || []) {
      console.log(` ${str}`);
    }
    console.log(' -----------------------------------------------------------------------------------\n');
  }

  const rootParser = new ArgumentParser();
  const subParsers = rootParser.add_subparsers({ title: 'commands', dest: 'command' });

  const clusterCommand = new ClusterCommand();
  const nonceCommand = new NonceCommand();
  const operatorCommand = new OperatorCommand();
  const clusterCommandParser = subParsers.add_parser(clusterCommand.name, { add_help: true });
  const nonceCommandParser = subParsers.add_parser(nonceCommand.name, { add_help: true });
  const operatorCommandParser = subParsers.add_parser(operatorCommand.name, { add_help: true });
  clusterCommand.setArguments(clusterCommandParser);
  nonceCommand.setArguments(nonceCommandParser);
  operatorCommand.setArguments(operatorCommandParser);

  let command = '';
  const args = process.argv.slice(2); // Skip node and script name

  if (args[1] && args[1].includes('--help')) {
    rootParser.parse_args(); // Print help and exit
    return;
  } else {
    const parsedArgs = rootParser.parse_known_args();
    command = parsedArgs[0].command;
  }

  switch (command) {
    case clusterCommand.name:
      await clusterCommand.run(clusterCommand.parse(args));
      break;
    case nonceCommand.name:
      await nonceCommand.run(nonceCommand.parse(args));
      break;
    case operatorCommand.name:
      await operatorCommand.run(operatorCommand.parse(args));
      break;
    default:
      console.error('Command not found');
      process.exit(1);
  }
}
