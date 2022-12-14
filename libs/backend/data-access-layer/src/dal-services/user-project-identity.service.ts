import { Injectable } from "@nestjs/common";
import { SignInRequestDto } from "@sca/dto";
import { Nullable } from "@sca/utils";
import { ProjectService, UserEntity, UserService } from "../domains";

@Injectable()
export class UserProjectIdentityService {
	public constructor(
		// Dependencies

		private readonly userService: UserService,
		private readonly projectService: ProjectService,
	) {}

	public async authenticateUserWithProject(signInRequestDto: SignInRequestDto): Promise<Nullable<UserEntity>> {
		const user = await this.userService.findUser(signInRequestDto.userEmail);

		if (!user) return null;

		const project = await this.projectService.findProject(user.userId, signInRequestDto.projectDomain);

		if (!project) return null;

		user.userAuthenticatedProject = project;

		return user;
	}
}
