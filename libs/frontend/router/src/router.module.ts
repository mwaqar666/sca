import { NgModule } from "@angular/core";
import { RouterModule as NgRouterModule } from "@angular/router";
import { Routes } from "./const";

@NgModule({
	imports: [NgRouterModule.forRoot(Routes)],
	exports: [NgRouterModule],
})
export class RouterModule {}
