import { LoadableCommands } from "../type";
import { ArgumentsLoader } from "./arguments-loader";
import { CommandHelper } from "./command-helper";
import { CommandLoader } from "./command-loader";
import { CommandRunner } from "./command-runner";

export class CommandManager {
	private static instance: CommandManager;

	static {
		const argumentsLoader = new ArgumentsLoader(process.argv);
		const commandLoader = new CommandLoader();
		const commandHelper = new CommandHelper();
		const commandRunner = new CommandRunner(commandHelper);

		CommandManager.instance = new CommandManager(argumentsLoader, commandLoader, commandRunner);
	}

	private constructor(
		// Dependencies
		private readonly argumentsLoader: ArgumentsLoader,
		private readonly commandLoader: CommandLoader,
		private readonly commandRunner: CommandRunner,
	) {}

	public static getInstance(): CommandManager {
		return this.instance;
	}

	public async registerCommands(commands: LoadableCommands): Promise<CommandManager> {
		await this.commandLoader.loadCommands(commands);

		return this;
	}

	public async run(): Promise<void> {
		const loadedCommands = this.commandLoader.getLoadedCommands();
		const loadedArguments = this.argumentsLoader.getLoadedArguments();

		await this.commandRunner.prepareCommand(loadedCommands, loadedArguments).runCommand();
	}
}
