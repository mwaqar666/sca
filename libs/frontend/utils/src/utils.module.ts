import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ComponentGenericService, RouteDataBusService } from "./services";

@NgModule({
	imports: [CommonModule],
	providers: [RouteDataBusService, ComponentGenericService],
})
export class UtilsModule {}
