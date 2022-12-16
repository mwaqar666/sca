import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { WebsocketService } from "./services";

@NgModule({
	imports: [CommonModule],
	providers: [WebsocketService],
})
export class WebsocketModule {}
