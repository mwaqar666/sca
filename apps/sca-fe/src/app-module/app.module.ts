import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ApiModule } from "@sca-frontend/api";
import { ConfigModule } from "@sca-frontend/config";
import { StorageModule } from "@sca-frontend/storage";
import { AppComponent } from "./components";

@NgModule({
	declarations: [AppComponent],
	imports: [BrowserAnimationsModule, BrowserModule, ConfigModule, StorageModule, ApiModule],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
