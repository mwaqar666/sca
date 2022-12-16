import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { StorageDriverProvider } from "./config";
import { StorageManager } from "./storage.manager";

@NgModule({
	imports: [CommonModule],
	providers: [StorageManager, StorageDriverProvider],
})
export class StorageModule {}
