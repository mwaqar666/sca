import * as process from "process";
import type { LoadedCommandArguments } from "../type";

export class ArgumentsLoader {
	private nodeExecutablePath: string;
	private entryFilePath: string;

	private commandName: string;

	private argumentList: Array<string>;
	private keyValueArguments: Record<string, string> = {};
	private flagArguments: Record<string, boolean> = {};

	public constructor(private readonly commandLineArgumentList: Array<string>) {
		this.loadExecutablesPath();
		this.loadCommandName();
		this.loadArguments();
	}

	public getLoadedArguments(): LoadedCommandArguments {
		return {
			commandName: this.commandName,
			keyValueArguments: this.keyValueArguments,
			flagArguments: this.flagArguments,
		};
	}

	private loadExecutablesPath(): void {
		this.nodeExecutablePath = this.commandLineArgumentList[0];
		this.entryFilePath = this.commandLineArgumentList[1];
	}

	private loadCommandName(): void {
		this.commandName = this.commandLineArgumentList[2];
	}

	private loadArguments(): void {
		this.argumentList = this.commandLineArgumentList.slice(3);

		this.loadCommandArguments();
	}

	private loadCommandArguments(): void {
		for (const argument of this.argumentList) {
			if (argument.includes("=")) {
				this.loadKeyValueArguments(argument);

				continue;
			}

			if (argument.startsWith("--")) {
				this.loadFlagArguments(argument);
			}
		}
	}

	private loadKeyValueArguments(argument: string): void {
		const [key, value] = argument.split("=");
		if (key && value) {
			this.keyValueArguments[key] = value;
			return;
		}

		console.error("Commander: Command arguments should be [key]=[value] pairs");
		process.exit(1);
	}

	private loadFlagArguments(argument: string): void {
		const flag = argument.slice(2);
		if (flag) {
			this.flagArguments[flag] = true;
			return;
		}

		console.error("Commander: Command flag argument should be --[flag]");
		process.exit(1);
	}
}
