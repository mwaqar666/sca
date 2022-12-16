import { DEVELOPMENT, NODE_ENV } from "@sca-backend/config";
import { PathHelpers } from "@sca-backend/utils";
import { EnvExtractor } from "@sca-shared/utils";
import * as dotenv from "dotenv";

const nodeEnvironment = EnvExtractor.env(NODE_ENV) ?? DEVELOPMENT;
const environmentFilePath = PathHelpers.configPath(`backend/.env.${nodeEnvironment}`);
dotenv.config({ path: environmentFilePath });

export class Commander {
	public static async start() {
		const { CommandManager } = await import("./command-manager");

		return CommandManager.getInstance();
	}
}
