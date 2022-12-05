import { NODE_ENV } from "@sca/config";
import * as dotenv from "dotenv";

const nodeEnvironment = process.env[NODE_ENV] ?? "development";
dotenv.config({ path: `${process.cwd()}/.env.${nodeEnvironment}` });

export class Commander {
	public static async start() {
		const { CommandManager } = await import("@/commander/command-manager");

		return CommandManager.getInstance();
	}
}
