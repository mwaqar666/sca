import { Inject, Injectable } from "@nestjs/common";
import type { AggregateService } from "@sca-backend/aggregate";
import { type EntityTableColumnProperties, type RunningTransaction, SequelizeScopeConst } from "@sca-backend/db";
import type { Nullable } from "@sca-shared/utils";
import { DomainExtensionsAggregateConst, DomainUtilitiesAggregateConst } from "../../../const";
import type { IDomainExtensionsAggregate, IDomainUtilitiesAggregate } from "../../../types";
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

	public async findUserUsingEmail(userEmail: string): Promise<Nullable<UserEntity>> {
		return await this.userRepository.findEntity({
			findOptions: { where: { userEmail } },
			scopes: [SequelizeScopeConst.withoutTimestamps, SequelizeScopeConst.isActive],
		});
	}

	public async findUserUsingUuid(userUuid: string): Promise<Nullable<UserEntity>> {
		return await this.userRepository.resolveEntity(userUuid, [SequelizeScopeConst.withoutTimestamps, SequelizeScopeConst.isActive]);
	}

	public async findOrFailUserUsingUuid(userUuid: string): Promise<UserEntity> {
		return await this.userRepository.resolveOrFailEntity(userUuid, [SequelizeScopeConst.withoutTimestamps, SequelizeScopeConst.isActive]);
	}

	public async createUser(createUserData: Partial<EntityTableColumnProperties<UserEntity>>, userUserTypeId: number, withTransaction?: RunningTransaction): Promise<UserEntity> {
		return await this.extensionsAggregateService.services.sequelize.executeTransactionalOperation({
			withTransaction,
			transactionCallback: async (runningTransaction: RunningTransaction) => {
				if (createUserData.userPassword) createUserData.userPassword = await this.utilitiesAggregateService.services.hash.hashString(createUserData.userPassword);

				return await this.userRepository.createSingleEntity({
					transaction: runningTransaction.currentTransaction.transaction,
					valuesToCreate: { ...createUserData, userUserTypeId },
				});
			},
		});
	}
}
