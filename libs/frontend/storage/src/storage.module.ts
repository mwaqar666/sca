import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { StorageDriverProvider } from "./config";
import { StorageService } from "./services";

@NgModule({
	imports: [CommonModule],
	providers: [StorageService, StorageDriverProvider],
})
export class StorageModule {}
