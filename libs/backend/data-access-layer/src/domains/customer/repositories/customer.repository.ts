import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { BaseRepository, EntityType } from "@sca-backend/db";
import { CustomerEntity } from "../entities";

@Injectable()
export class CustomerRepository extends BaseRepository<CustomerEntity> {
	public constructor(
		// Dependencies

		@InjectModel(CustomerEntity) private readonly customerEntity: EntityType<CustomerEntity>,
	) {
		super(customerEntity);
	}
}
