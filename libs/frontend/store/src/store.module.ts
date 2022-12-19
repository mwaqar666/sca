import { NgModule } from "@angular/core";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { NgxsModule } from "@ngxs/store";
import { States } from "./const";

@NgModule({
	imports: [NgxsModule.forRoot(States), NgxsReduxDevtoolsPluginModule.forRoot()],
})
export class StoreModule {}
