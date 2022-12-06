import * as process from "process";
import { BaseCommand } from "../base";
import { HelpFlagArgument } from "../const";
import { CommandArguments, KeyValueArgument, LoadedCommandArguments } from "../type";

export class CommandRunner {
	private loadedCommands: Array<BaseCommand>;
	private loadedArguments: LoadedCommandArguments;

	private commandToExecute: BaseCommand;
	private shouldRunCommandHelp = false;

	private verifiedCommandKeyValueArguments: Array<KeyValueArgument> = [];
	private verifiedCommandFlagArguments: Array<string> = [];

	public prepareCommand(loadedCommands: Array<BaseCommand>, loadedArguments: LoadedCommandArguments): void {
		this.loadedCommands = loadedCommands;
		this.loadedArguments = loadedArguments;

		this.filterRequestedCommand();

		this.verifyCommandArguments();
	}

	public async runCommand(): Promise<void> {
		if (this.shouldRunCommandHelp) {
			console.log(this.commandToExecute.commandHelp());

			return;
		}

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

		console.error(`Command with name ${this.loadedArguments.commandName} not found!`);
		process.exit(1);
	}

	private verifyCommandArguments(): void {
		if (this.isHelpCommand()) {
			this.shouldRunCommandHelp = true;

			return;
		}

		const commandArguments = this.commandToExecute.commandArguments();

		if (!commandArguments) return;

		this.verifyCommandKeyValueArguments(commandArguments);

		this.verifyCommandFlagArguments(commandArguments);
	}

	private verifyCommandKeyValueArguments(commandArguments: CommandArguments): void {
		if (!commandArguments.keyValueArguments) return;

		for (const [argumentName, argumentDetails] of Object.entries(commandArguments.keyValueArguments)) {
			const foundLoadedKeyValueArgument = this.loadedArguments.keyValueArguments.find((keyValueArgument: KeyValueArgument) => {
				return keyValueArgument.key === argumentName;
			});

			if (foundLoadedKeyValueArgument || argumentDetails.defaultValue !== undefined) {
				const foundOrDefaultValue = foundLoadedKeyValueArgument ? foundLoadedKeyValueArgument : ({ key: argumentName, value: argumentDetails.defaultValue } as KeyValueArgument);
				const parsedArgument = this.parseCommandKeyValueArgument(foundOrDefaultValue, argumentDetails.type);
				this.verifiedCommandKeyValueArguments.push(parsedArgument);

				continue;
			}

			if (!argumentDetails.required) continue;

			console.error(`Argument ${argumentName} is required!`);
			process.exit(1);
		}
	}

	private verifyCommandFlagArguments(commandArguments: CommandArguments): void {
		if (!commandArguments.flagArguments) return;

		for (const flagArgument of commandArguments.flagArguments) {
			if (flagArgument === HelpFlagArgument) {
				console.error(`Cannot use "help" as flag argument as it is a reserved flag!`);
				process.exit(1);
			}

			const foundFlagArgument = this.loadedArguments.flagArguments.find((loadedFlagArgument: string) => {
				return loadedFlagArgument === flagArgument;
			});

			if (!foundFlagArgument) continue;

			this.verifiedCommandFlagArguments.push(foundFlagArgument);
		}
	}

	private isHelpCommand(): boolean {
		return this.loadedArguments.flagArguments.includes(HelpFlagArgument);
	}

	private parseCommandKeyValueArgument(loadedArgument: KeyValueArgument, argumentType: "string" | "number" | "boolean"): KeyValueArgument {
		if (argumentType === "number") {
			loadedArgument.value = parseInt(loadedArgument.value as string, 10);

			if (!Number.isNaN(loadedArgument.value)) return loadedArgument;

			console.error(`Argument ${loadedArgument.key} is expected to be a number`);
			process.exit(1);
		}

		if (argumentType === "boolean") {
			if (loadedArgument.value === "true" || loadedArgument.value === true) return { key: loadedArgument.key, value: true };

			if (loadedArgument.value === "false" || loadedArgument.value === false) return { key: loadedArgument.key, value: false };

			console.error(`Argument ${loadedArgument.key} is expected to be a boolean flag`);
			process.exit(1);
		}

		return loadedArgument;
	}
}
