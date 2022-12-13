import { Body, Controller, Post } from "@nestjs/common";
import { SignInResponseDto, UserCredentialsDto } from "@sca/dto";
import { BaseController } from "@sca/utils";
import { AuthService } from "../services";

@Controller("auth")
export class AuthController extends BaseController {
	public constructor(private readonly authService: AuthService) {
		super();
	}

	@Post("/sign-in")
	public async signIn(@Body() userCredentialsDto: UserCredentialsDto): Promise<SignInResponseDto> {
		return this.authService.signIn(userCredentialsDto);
	}
}
