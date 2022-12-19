import { Inject, Injectable } from "@nestjs/common";
import type { AggregateService } from "@sca-backend/aggregate";
import { type EntityScope, EntityTableColumnProperties, RunningTransaction, SequelizeScopeConst } from "@sca-backend/db";
import type { Nullable } from "@sca-shared/utils";
import { DomainAggregateConst } from "../../const";
import type { IDomainAggregate } from "../../types";
import { UserTypeEnum } from "../user-type";
import type { UserEntity } from "./user.entity";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
	public constructor(
		// Dependencies

		private readonly userRepository: UserRepository,
		@Inject(DomainAggregateConst) private readonly aggregateService: AggregateService<IDomainAggregate>,
	) {}

	public async findUser(userEmail: string, ...scopes: EntityScope): Promise<Nullable<UserEntity>> {
		return await this.userRepository.findEntity({
			scopes: [SequelizeScopeConst.isActive, ...scopes],
			findOptions: { where: { userEmail } },
		});
	}

	public async createProjectUser(createUserData: Partial<EntityTableColumnProperties<UserEntity>>, withTransaction?: RunningTransaction): Promise<UserEntity> {
		return await this.aggregateService.services.sequelize.executeTransactionalOperation({
			withTransaction,
			transactionCallback: async (runningTransaction: RunningTransaction) => {
				const userType = UserTypeEnum.ProjectUsers;

				return await this.userRepository.createEntity({
					transaction: runningTransaction.currentTransaction.transaction,
					valuesToCreate: {
						...createUserData,
						userUserTypeId: userType,
					},
				});
			},
		});
	}
}
