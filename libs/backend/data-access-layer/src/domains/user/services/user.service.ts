import { Inject, Injectable } from "@nestjs/common";
import type { AggregateService } from "@sca-backend/aggregate";
import { type EntityScope, EntityTableColumnProperties, RunningTransaction, SequelizeScopeConst } from "@sca-backend/db";
import type { Nullable } from "@sca-shared/utils";
import { DomainExtensionsAggregateConst, DomainUtilitiesAggregateConst } from "../../../const";
import type { IDomainExtensionsAggregate, IDomainUtilitiesAggregate } from "../../../types";
import { UserTypeEnum } from "../../user-type";
import type { UserEntity } from "../entities";
import { UserRepository } from "../repositories";

@Injectable()
export class UserService {
	public constructor(
		// Dependencies

		private readonly userRepository: UserRepository,
		@Inject(DomainExtensionsAggregateConst) private readonly extensionsAggregateService: AggregateService<IDomainExtensionsAggregate>,
		@Inject(DomainUtilitiesAggregateConst) private readonly utilitiesAggregateService: AggregateService<IDomainUtilitiesAggregate>,
	) {}

	public async findUser(userEmail: string, ...scopes: EntityScope): Promise<Nullable<UserEntity>> {
		return await this.userRepository.findEntity({
			scopes: [SequelizeScopeConst.isActive, ...scopes],
			findOptions: { where: { userEmail } },
		});
	}

	public async createUser(createUserData: Partial<EntityTableColumnProperties<UserEntity>>, withTransaction?: RunningTransaction): Promise<UserEntity> {
		return await this.extensionsAggregateService.services.sequelize.executeTransactionalOperation({
			withTransaction,
			transactionCallback: async (runningTransaction: RunningTransaction) => {
				const userType = UserTypeEnum.ProjectUsers;

				if (createUserData.userPassword) createUserData.userPassword = await this.utilitiesAggregateService.services.hash.hashString(createUserData.userPassword);

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
