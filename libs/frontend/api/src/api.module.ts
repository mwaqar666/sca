import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ApiRouteLoaderService, ApiRouteService } from "./services";

@NgModule({
	imports: [CommonModule],
	providers: [ApiRouteService, ApiRouteLoaderService],
})
export class ApiModule {}
