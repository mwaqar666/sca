import { AppModule } from "~/app-module/app.module";
import { AppService } from "~/app-module/services";
import { NestFactory } from "@nestjs/core";

export class Application {
	public static async boot(): Promise<void> {
		const app = await NestFactory.create(AppModule);

		const appModule = app.select(AppModule);

		const appService = appModule.get(AppService);

		await appService.registerAndStartApplicationProcesses(app, appModule);
	}
}

// noinspection JSIgnoredPromiseFromCall
Application.boot();
