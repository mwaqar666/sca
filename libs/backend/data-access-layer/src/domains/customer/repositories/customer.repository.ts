import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { BaseRepository, type EntityType, SequelizeScopeConst } from "@sca-backend/db";
import type { Transaction } from "sequelize";
import { CustomerEntity } from "../entities";
import type { ICustomerIpInfo, ICustomerPersonalInfo } from "@sca-shared/dto";

@Injectable()
export class CustomerRepository extends BaseRepository<CustomerEntity> {
	public constructor(
		// Dependencies

		@InjectModel(CustomerEntity) private readonly customerEntity: EntityType<CustomerEntity>,
	) {
		super(customerEntity);
	}

	public async updateOrCreateCustomer(customerCookie: string, customerPersonalInfo: ICustomerPersonalInfo, customerIpInfo: ICustomerIpInfo, transaction: Transaction): Promise<CustomerEntity> {
		return this.updateOrCreateEntity({
			findOptions: { where: { customerCookie } },
			valuesToUpdate: { customerIpInfo },
			valuesToCreate: { customerCookie, customerPersonalInfo, customerIpInfo },
			transaction,
			scopes: [SequelizeScopeConst.withoutTimestamps],
		});
	}

	public async createCustomer(customerCookie: string, customerPersonalInfo: ICustomerPersonalInfo, customerIpInfo: ICustomerIpInfo, transaction: Transaction) {
		return await this.createSingleEntity({
			valuesToCreate: { customerCookie, customerPersonalInfo, customerIpInfo },
			transaction,
		});
	}
}
