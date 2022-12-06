import { Commander, CommandManager } from "@sca/command";

Commander.start()
	.then((commandManager: CommandManager) => {
		return commandManager.registerCommands([
			// Command Providers

			import("@sca/db").then(({ MigrationManagerCommandProvider }) => MigrationManagerCommandProvider),
		]);
	})
	.then((commandManager: CommandManager) => {
		return commandManager.run();
	});
