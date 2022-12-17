import { ViewEncapsulation } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app-module/app.module";

platformBrowserDynamic()
	.bootstrapModule(AppModule, {
		defaultEncapsulation: ViewEncapsulation.Emulated,
	})
	.catch((err) => console.error(err));
