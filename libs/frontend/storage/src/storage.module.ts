import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ConfigModule } from "@sca-frontend/config";
import { StorageDriverProvider } from "./config";
import { StorageService } from "./services";

@NgModule({
	imports: [
		// Angular Modules
		CommonModule,

		// Application Modules
		ConfigModule,
	],
	providers: [StorageService, StorageDriverProvider],
})
export class StorageModule {}
