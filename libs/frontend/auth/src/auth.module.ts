import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AuthRoutingModule } from "./auth-routing.module";
import { AuthRouterComponent } from "./components";
import { AuthGuard, GuestGuard } from "./guards";
import { AccessTokenInterceptor, RefreshTokenInterceptor } from "./interceptors";
import { SignInPageComponent, SignUpPageComponent } from "./pages";

@NgModule({
	declarations: [AuthRouterComponent, SignUpPageComponent, SignInPageComponent],
	imports: [CommonModule, AuthRoutingModule],
	providers: [AccessTokenInterceptor, RefreshTokenInterceptor, AuthGuard, GuestGuard],
})
export class AuthModule {}
