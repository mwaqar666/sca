import { Commander, CommandManager } from "@sca-backend/command";

Commander.start()
	.then((commandManager: CommandManager) => {
		return commandManager.registerCommands([
			// Command Providers
			//
			import("@sca-backend/db").then(({ MigrationManagerCommandProvider }) => MigrationManagerCommandProvider),
		]);
	})
	.then((commandManager: CommandManager) => {
		return commandManager.run();
	});
