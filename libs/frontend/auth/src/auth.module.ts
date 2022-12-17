import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AuthGuard } from "./guards";
import { AccessTokenInterceptor, RefreshTokenInterceptor } from "./interceptors";

@NgModule({
	imports: [CommonModule],
	providers: [AccessTokenInterceptor, RefreshTokenInterceptor, AuthGuard],
})
export class AuthModule {}
