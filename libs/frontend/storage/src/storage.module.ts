import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { StorageService } from "./services";

@NgModule({
	imports: [CommonModule],
	providers: [StorageService],
})
export class StorageModule {}
