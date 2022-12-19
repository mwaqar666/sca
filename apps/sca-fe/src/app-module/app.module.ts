import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";

import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { ApiModule } from "@sca-frontend/api";
import { AuthModule } from "@sca-frontend/auth";
import { ConfigModule } from "@sca-frontend/config";
import { RouterModule } from "@sca-frontend/router";
import { StorageModule } from "@sca-frontend/storage";
import { StoreModule } from "@sca-frontend/store";
import { UtilsModule } from "@sca-frontend/utils";
import { AppComponent } from "./components";

@NgModule({
	declarations: [AppComponent],
	imports: [
		// Angular Modules
		BrowserAnimationsModule,
		BrowserModule,

		// Material Modules
		MatSidenavModule,
		MatToolbarModule,
		MatIconModule,
		MatButtonModule,

		// Application Modules
		UtilsModule,
		ConfigModule,
		StorageModule,
		ApiModule,
		RouterModule,
		AuthModule,
		StoreModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
