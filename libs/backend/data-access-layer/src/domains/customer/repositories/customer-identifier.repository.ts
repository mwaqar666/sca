import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { BaseRepository, EntityType } from "@sca-backend/db";
import { CustomerIdentifierEntity } from "../entities";

@Injectable()
export class CustomerIdentifierRepository extends BaseRepository<CustomerIdentifierEntity> {
	public constructor(
		// Dependencies

		@InjectModel(CustomerIdentifierEntity) private readonly customerIdentifierEntity: EntityType<CustomerIdentifierEntity>,
	) {
		super(customerIdentifierEntity);
	}
}
