import { Body, Controller, Post } from "@nestjs/common";
import { BaseController } from "@sca-backend/utils";
import { AuthApiRoutes } from "@sca-shared/dto";
import { ProjectUserSignInRequestDto, ProjectUserSignInResponseDto } from "../dto";
import { AuthService } from "../services";

@Controller(AuthApiRoutes.prefix)
export class AuthController extends BaseController {
	public constructor(
		// Dependencies

		private readonly authService: AuthService,
	) {
		super();
	}

	@Post(AuthApiRoutes.routes.signIn.path)
	public async projectUserSignIn(@Body() projectUserSignInRequestDto: ProjectUserSignInRequestDto): Promise<ProjectUserSignInResponseDto> {
		return this.authService.projectUserSignIn(projectUserSignInRequestDto);
	}
}
