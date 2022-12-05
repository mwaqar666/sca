import { BaseCommand, BaseCommandProvider } from "@/base";
import { CommandType, LoadableCommands } from "@/type";
import { Optional } from "@sca/utils";

export class CommandLoader {
	private loadedCommands: Array<BaseCommand> = [];

	public getLoadedCommands(): Array<BaseCommand> {
		return this.loadedCommands;
	}

	public async loadCommands(commands: LoadableCommands): Promise<void> {
		for await (const command of commands) {
			if (command instanceof BaseCommandProvider) {
				await this.loadCommandProvider(command);

				continue;
			}

			this.loadBasicCommand(command);
		}
	}

	private async loadCommandProvider<T>(commandProvider: BaseCommandProvider<T>): Promise<void> {
		const injectableData = commandProvider.data;
		const availableCommands = commandProvider.provide();

		for await (const availableCommand of availableCommands) {
			await this.loadBasicCommand(availableCommand, injectableData);
		}
	}

	private loadBasicCommand(command: CommandType): void;
	private loadBasicCommand<T>(command: CommandType<T>, data: T): void;
	private loadBasicCommand<T>(command: CommandType<Optional<T>>, data?: T): void {
		const loadedCommand = new command(data);
		this.loadedCommands.push(loadedCommand);
	}
}
