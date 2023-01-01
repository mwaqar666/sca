import { Injectable } from "@nestjs/common";
import type { UserTypeEnum } from "@sca-shared/dto";
import type { UserTypeEntity } from "../entities";
import { UserTypeRepository } from "../repositories";
import { SequelizeScopeConst } from "@sca-backend/db";

@Injectable()
export class UserTypeService {
	public constructor(
		// Dependencies

		private readonly userTypeRepository: UserTypeRepository,
	) {}

	public async findUserType(userType: UserTypeEnum): Promise<UserTypeEntity> {
		return await this.userTypeRepository.findOrFailEntity({
			scopes: [SequelizeScopeConst.withoutTimestamps, SequelizeScopeConst.isActive],
			findOptions: { where: { userTypeIdentifier: userType } },
		});
	}
}
