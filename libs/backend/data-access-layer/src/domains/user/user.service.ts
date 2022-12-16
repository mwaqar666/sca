import { Injectable } from "@nestjs/common";
import { type EntityScope, SequelizeScopeConst } from "@sca-backend/db";
import type { Nullable } from "@sca-backend/utils";
import type { UserEntity } from "./user.entity";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
	public constructor(
		// Dependencies

		private readonly userRepository: UserRepository,
	) {}

	public async findUser(userEmail: string, ...scopes: EntityScope): Promise<Nullable<UserEntity>> {
		return await this.userRepository.findEntity({
			scopes: [SequelizeScopeConst.isActive, ...scopes],
			findOptions: { where: { userEmail } },
		});
	}
}
