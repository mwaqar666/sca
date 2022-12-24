import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { BaseRepository, EntityTableColumnProperties, type EntityType, SequelizeScopeConst } from "@sca-backend/db";
import type { Nullable } from "@sca-shared/utils";
import type { Transaction } from "sequelize";
import { CustomerIdentifierEntity } from "../entities";

@Injectable()
export class CustomerIdentifierRepository extends BaseRepository<CustomerIdentifierEntity> {
	public constructor(
		// Dependencies

		@InjectModel(CustomerIdentifierEntity) private readonly customerIdentifierEntity: EntityType<CustomerIdentifierEntity>,
	) {
		super(customerIdentifierEntity);
	}

	public async createCustomerIdentifier(customerIdentifierValues: Partial<EntityTableColumnProperties<CustomerIdentifierEntity>>, transaction: Transaction): Promise<CustomerIdentifierEntity> {
		return await this.createEntity({ valuesToCreate: customerIdentifierValues, transaction });
	}

	public async findCustomerIdentifierByCookie(cookieValue: string): Promise<Nullable<CustomerIdentifierEntity>> {
		return await this.findEntity({
			findOptions: { where: { customerIdentifierCookie: cookieValue } },
			scopes: [SequelizeScopeConst.withoutTimestamps],
		});
	}

	public async findCustomerIdentifierByIp(ipValue: string): Promise<Nullable<CustomerIdentifierEntity>> {
		return await this.findEntity({
			findOptions: { where: { customerIdentifierIp: ipValue } },
			scopes: [SequelizeScopeConst.withoutTimestamps],
		});
	}
}
