import { Commander, CommandManager } from "@sca/command";
import * as process from "process";

console.log(process.argv);

Commander.start()
	.then((commandManager: CommandManager) => {
		return commandManager.registerCommands([
			// Command Providers
			//
			import("@sca/db").then(({ MigrationManagerCommandProvider }) => MigrationManagerCommandProvider),
		]);
	})
	.then((commandManager: CommandManager) => {
		return commandManager.run();
	});
