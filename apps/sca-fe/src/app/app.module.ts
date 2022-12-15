import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { appRoutes } from "./app.routes";
import { NxWelcomeComponent } from "./nx-welcome.component";
import { RouterModule } from "@angular/router";

@NgModule({
	declarations: [AppComponent, NxWelcomeComponent],
	imports: [BrowserModule, RouterModule.forRoot(appRoutes, { initialNavigation: "enabledBlocking" })],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
