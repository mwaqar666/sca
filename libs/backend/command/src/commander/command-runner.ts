import * as process from "process";
import { BaseCommand } from "../base";
import { HelpFlagArgument } from "../const";
import { CommandArguments, FlagArguments, KeyValueArgument, LoadedCommandArguments, PossibleKeyValueArgumentTypes } from "../type";
import { CommandHelper } from "./command-helper";

export class CommandRunner {
	private loadedCommands: Array<BaseCommand>;
	private loadedArguments: LoadedCommandArguments;

	private commandToExecute: BaseCommand;

	private verifiedCommandKeyValueArguments: KeyValueArgument = {};
	private verifiedCommandFlagArguments: FlagArguments = {};

	public constructor(
		// Dependencies
		private readonly commandHelper: CommandHelper,
	) {}

	public prepareCommand(loadedCommands: Array<BaseCommand>, loadedArguments: LoadedCommandArguments): CommandRunner {
		this.loadedCommands = loadedCommands;
		this.loadedArguments = loadedArguments;

		this.filterRequestedCommand();

		if (this.isHelpCommand()) this.commandHelper.showCommandHelp(this.commandToExecute);

		this.verifyCommandArguments();

		return this;
	}

	public async runCommand(): Promise<void> {
		await this.commandToExecute.commandAction(this.verifiedCommandKeyValueArguments, this.verifiedCommandFlagArguments);
	}

	private filterRequestedCommand(): void {
		const commandToExecute = this.loadedCommands.find((loadedCommand: BaseCommand) => {
			return loadedCommand.commandName() === this.loadedArguments.commandName;
		});

		if (commandToExecute) {
			this.commandToExecute = commandToExecute;

			return;
		}

		console.error(`Commander: Command with name ${this.loadedArguments.commandName} not found!`);
		process.exit(1);
	}

	private verifyCommandArguments(): void {
		const commandArguments = this.commandToExecute.commandArguments();

		if (!commandArguments) return;

		this.verifyCommandKeyValueArguments(commandArguments);

		this.verifyCommandFlagArguments(commandArguments);
	}

	private verifyCommandKeyValueArguments(commandArguments: CommandArguments): void {
		if (!commandArguments.keyValueArguments) return;

		for (const [argumentName, argumentDetails] of Object.entries(commandArguments.keyValueArguments)) {
			const foundArgument = this.loadedArguments.keyValueArguments[argumentName];

			if (foundArgument) {
				this.verifiedCommandKeyValueArguments[argumentName] = this.parseCommandKeyValueArgument(foundArgument, argumentDetails.type);

				continue;
			}

			if (!argumentDetails.required) {
				if (argumentDetails.defaultValue) this.verifiedCommandKeyValueArguments[argumentName] = argumentDetails.defaultValue;

				continue;
			}

			console.error(`Commander: Argument ${argumentName} is required!`);
			process.exit(1);
		}
	}

	private verifyCommandFlagArguments(commandArguments: CommandArguments): void {
		if (!commandArguments.flagArguments) return;

		for (const flagArgument of commandArguments.flagArguments) {
			const foundArgument = this.loadedArguments.flagArguments.find((loadedFlag: string) => loadedFlag === flagArgument);

			this.verifiedCommandFlagArguments[flagArgument] = !!foundArgument;
		}
	}

	private isHelpCommand(): boolean {
		return this.loadedArguments.flagArguments.includes(HelpFlagArgument);
	}

	private parseCommandKeyValueArgument(loadedArgument: string, argumentType: "string" | "number" | "boolean"): PossibleKeyValueArgumentTypes {
		if (argumentType === "number") {
			const parsedNumber = parseInt(loadedArgument, 10);

			if (!Number.isNaN(parsedNumber)) return loadedArgument;

			console.error(`Commander: Argument ${loadedArgument} is expected to be a number`);
			process.exit(1);
		}

		if (argumentType === "boolean") {
			if (loadedArgument === "true") return true;

			if (loadedArgument === "false") return false;

			console.error(`Commander: Argument ${loadedArgument} is expected to be a boolean`);
			process.exit(1);
		}

		return loadedArgument;
	}
}
