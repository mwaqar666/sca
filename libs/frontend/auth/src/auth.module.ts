import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTabsModule } from "@angular/material/tabs";
import { AuthRoutingModule } from "./auth-routing.module";
import { SignInComponent, SignUpComponent } from "./components";
import { AuthGuard, GuestGuard } from "./guards";
import { AccessTokenInterceptor, RefreshTokenInterceptor } from "./interceptors";
import { AuthPageComponent } from "./pages";
import { SignInApiService, SignInService } from "./services";

@NgModule({
	declarations: [AuthPageComponent, SignUpComponent, SignInComponent],
	imports: [CommonModule, AuthRoutingModule, MatTabsModule, MatInputModule, MatIconModule, ReactiveFormsModule, MatButtonModule],
	providers: [SignInService, SignInApiService, AccessTokenInterceptor, RefreshTokenInterceptor, AuthGuard, GuestGuard],
})
export class AuthModule {}
