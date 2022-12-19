import type { ProjectEntity, ProjectUserEntity, UserEntity } from "../../domains";

export class LinkUserProjectDto {
	user: UserEntity;
	project: ProjectEntity;
	projectUser?: ProjectUserEntity;
}
