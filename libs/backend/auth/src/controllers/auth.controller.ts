import { Body, Controller, Post } from "@nestjs/common";
import { BaseController } from "@sca-backend/utils";
import { AuthApiRoutes } from "@sca-shared/dto";
import { SignInRequestDto, SignInResponseDto, SignUpRequestDto, SignUpResponseDto } from "../dto";
import { AuthService } from "../services";

@Controller(AuthApiRoutes.Prefix)
export class AuthController extends BaseController {
	public constructor(
		// Dependencies

		private readonly authService: AuthService,
	) {
		super();
	}

	@Post(AuthApiRoutes.Routes.SignIn.Path)
	public async userSignIn(@Body() signInRequestDto: SignInRequestDto): Promise<SignInResponseDto> {
		return this.authService.signIn(signInRequestDto);
	}

	@Post(AuthApiRoutes.Routes.SignUp.Path)
	public async userSignUp(@Body() signUpRequestDto: SignUpRequestDto): Promise<SignUpResponseDto> {
		return this.authService.signUp(signUpRequestDto);
	}
}
