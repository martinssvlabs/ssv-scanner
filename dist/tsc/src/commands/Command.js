"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
const argparse_1 = require("argparse");
class Command {
    constructor(name, description) {
        this.name = name;
        this.description = description;
        this.parser = new argparse_1.ArgumentParser({ description: this.description });
        this.setArguments(this.parser);
    }
    /**
     * Parse args custom logic
     * @param args
     */
    parse(args) {
        // Remove command name itself.
        const argsWithoutCommand = args.slice(1);
        return this.parser.parse_args(argsWithoutCommand);
    }
}
exports.Command = Command;
//# sourceMappingURL=Command.js.map