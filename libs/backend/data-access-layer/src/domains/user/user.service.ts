import { Injectable } from "@nestjs/common";
import { SequelizeScopeConst } from "@sca/db";
import { Nullable } from "@sca/utils";
import { UserEntity } from "./user.entity";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
	public constructor(
		// Dependencies

		private readonly userRepository: UserRepository,
	) {}

	public async findUser(userEmail: string): Promise<Nullable<UserEntity>> {
		return await this.userRepository.findEntity({
			scopes: [SequelizeScopeConst.isActive],
			findOptions: { where: { userEmail } },
		});
	}
}
