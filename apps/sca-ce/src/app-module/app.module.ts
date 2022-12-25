import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppComponent } from "./components";

@NgModule({
	declarations: [AppComponent],
	imports: [
		// Angular Modules
		BrowserAnimationsModule,
		BrowserModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
