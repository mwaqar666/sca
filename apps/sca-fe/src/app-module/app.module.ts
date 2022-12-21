import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";

import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AuthModule } from "@sca-frontend/auth";
import { RouterModule } from "@sca-frontend/router";
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
		RouterModule,
		StoreModule,
		AuthModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
