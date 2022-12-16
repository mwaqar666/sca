import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { BaseRepository, type EntityType } from "@sca-backend/db";
import { UserTypeEntity } from "./user-type.entity";

@Injectable()
export class UserTypeRepository extends BaseRepository<UserTypeEntity> {
	public constructor(
		// Dependencies

		@InjectModel(UserTypeEntity) private readonly userTypeEntity: EntityType<UserTypeEntity>,
	) {
		super(userTypeEntity);
	}
}
