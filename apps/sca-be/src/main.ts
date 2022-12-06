/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app-module/app.module";
import { AppService } from "./app-module/services";

export class Application {
	public static async bootstrap() {
		const app = await NestFactory.create(AppModule);

		const appModule = app.select(AppModule);

		const appService = appModule.get(AppService);

		await appService.registerAndStartApplicationProcesses(app, appModule);
	}
}

// noinspection JSIgnoredPromiseFromCall
Application.bootstrap();
