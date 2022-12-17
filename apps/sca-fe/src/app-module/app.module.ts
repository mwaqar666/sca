import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ConfigModule } from "@sca-frontend/config";
import { StorageModule } from "@sca-frontend/storage";
import { AppComponent } from "./components";

@NgModule({
	declarations: [AppComponent],
	imports: [BrowserModule, ConfigModule, StorageModule],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
