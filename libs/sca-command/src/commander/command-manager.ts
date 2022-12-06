import { LoadableCommands } from "../type";
import { ArgumentsLoader } from "./arguments-loader";
import { CommandLoader } from "./command-loader";
import { CommandRunner } from "./command-runner";

export class CommandManager {
	private static instance: CommandManager;

	static {
		const argumentsLoader = new ArgumentsLoader(process.argv);
		const commandLoader = new CommandLoader();
		const commandRunner = new CommandRunner();

		CommandManager.instance = new CommandManager(argumentsLoader, commandLoader, commandRunner);
	}

	private constructor(
		// Loaders
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

		this.commandRunner.prepareCommand(loadedCommands, loadedArguments);

		await this.commandRunner.runCommand();
	}
}
