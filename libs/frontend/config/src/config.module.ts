import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AngularConfigProvider } from "./provider";
import { ConfigService } from "./services";

@NgModule({
	imports: [CommonModule],
	providers: [ConfigService, AngularConfigProvider],
})
export class ConfigModule {}
