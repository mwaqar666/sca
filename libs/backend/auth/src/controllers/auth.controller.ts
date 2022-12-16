import { Body, Controller, Post } from "@nestjs/common";
import { ProjectUserSignInRequestDto, type ProjectUserSignInResponseDto } from "@sca-shared/dto";
import { BaseController } from "@sca-backend/utils";
import { AuthService } from "../services";

@Controller("auth")
export class AuthController extends BaseController {
	public constructor(
		// Dependencies

		private readonly authService: AuthService,
	) {
		super();
	}

	@Post("/project/sign-in")
	public async projectUserSignIn(@Body() projectUserSignInRequestDto: ProjectUserSignInRequestDto): Promise<ProjectUserSignInResponseDto> {
		return this.authService.projectUserSignIn(projectUserSignInRequestDto);
	}
}
