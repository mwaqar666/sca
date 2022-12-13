import { Injectable } from "@nestjs/common";
import { SequelizeScopeConst } from "@sca/db";
import { UserCredentialsDto } from "@sca/dto";
import { Nullable } from "@sca/utils";
import { UserEntity } from "./user.entity";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserDomainService {
	public constructor(
		// Dependencies

		private readonly userRepository: UserRepository,
	) {}

	public async findUserForSignIn(credentials: UserCredentialsDto): Promise<Nullable<UserEntity>> {
		return await this.userRepository.findEntity({
			scopes: [SequelizeScopeConst.isActive],
			findOptions: { where: { userEmail: credentials.userEmail } },
		});
	}
}
