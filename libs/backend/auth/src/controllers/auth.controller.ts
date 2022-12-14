import { Body, Controller, Post } from "@nestjs/common";
import { SignInRequestDto, type SignInResponseDto } from "@sca/dto";
import { BaseController } from "@sca/utils";
import { AuthService } from "../services";

@Controller("auth")
export class AuthController extends BaseController {
	public constructor(
		// Dependencies

		private readonly authService: AuthService,
	) {
		super();
	}

	@Post("/sign-in")
	public async signIn(@Body() signInRequestDto: SignInRequestDto): Promise<SignInResponseDto> {
		return this.authService.signIn(signInRequestDto);
	}
}
