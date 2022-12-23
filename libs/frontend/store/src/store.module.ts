import { NgModule } from "@angular/core";
import { NgxsModule } from "@ngxs/store";
import { States } from "./const";

@NgModule({
	imports: [NgxsModule.forRoot(States)],
})
export class StoreModule {}
