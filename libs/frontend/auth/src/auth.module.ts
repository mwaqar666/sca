import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTabsModule } from "@angular/material/tabs";
import { ApiModule } from "@sca-frontend/api";
import { StorageModule } from "@sca-frontend/storage";
import { AuthRoutingModule } from "./auth-routing.module";
import { SignInComponent, SignUpComponent } from "./components";
import { AuthApiRoutesConst } from "./const";
import { AuthGuard, GuestGuard } from "./guards";
import { AccessTokenInterceptor, RefreshTokenInterceptor } from "./interceptors";
import { AuthPageComponent } from "./pages";
import { SignInApiService, SignInService, SignUpApiService, SignUpService } from "./services";

@NgModule({
	declarations: [AuthPageComponent, SignUpComponent, SignInComponent],
	imports: [
		// Angular Modules
		CommonModule,
		ReactiveFormsModule,

		// Material Modules
		MatTabsModule,
		MatInputModule,
		MatIconModule,
		MatButtonModule,

		// Application Modules
		ApiModule.forFeature(AuthApiRoutesConst),
		AuthRoutingModule,
		StorageModule,
	],
	providers: [SignInService, SignUpService, SignInApiService, SignUpApiService, AccessTokenInterceptor, RefreshTokenInterceptor, AuthGuard, GuestGuard],
})
export class AuthModule {}
