import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { BaseRepository, type EntityType } from "@sca-backend/db";
import { UserEntity } from "./user.entity";

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
	public constructor(
		// Entities
		@InjectModel(UserEntity) private readonly userEntity: EntityType<UserEntity>,
	) {
		super(userEntity);
	}
}
