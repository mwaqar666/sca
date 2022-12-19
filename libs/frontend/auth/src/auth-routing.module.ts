import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AuthRoutes } from "./const";

@NgModule({
	imports: [RouterModule.forChild(AuthRoutes)],
	exports: [RouterModule],
})
export class AuthRoutingModule {}
