import { Inject, Injectable } from "@nestjs/common";
import { ConversationRepository } from "../repositories";
import { DomainExtensionsAggregateConst } from "../../../const";
import type { AggregateService } from "@sca-backend/aggregate";
import type { IDomainExtensionsAggregate } from "../../../types";

@Injectable()
export class ConversationService {
	public constructor(
		// Dependencies

		private readonly conversationRepository: ConversationRepository,
		@Inject(DomainExtensionsAggregateConst) private readonly extensionsAggregateService: AggregateService<IDomainExtensionsAggregate>,
	) {}

	// public async closeConversation(closeConversationDto: ICloseConversation, withTransaction?: RunningTransaction): Promise<Array<ConversationEntity>> {
	// 	if (closeConversationDto.trackingIds.length === 0) return [];
	//
	// 	return await this.extensionsAggregateService.services.sequelize.executeTransactionalOperation({
	// 		withTransaction,
	// 		transactionCallback: async (): Promise<Array<ConversationEntity>> => {
	// 			async (transaction: Transaction) => {
	// 				let customerChatHistories = await this.findCustomerChatHistories(customerTrackers, agent);
	//
	// 				[, customerChatHistories] = await this.chatHistoryRepository.updateEntities(customerChatHistories, { chat_history_conversation_closed: true }, transaction);
	//
	// 				return customerChatHistories;
	// 			};
	// 		},
	// 	});
	// }

	// private async findClosedCustomerConversations(trackerIds: Array<number>, agentId: Nullable<number>): Promise<ChatHistoryEntity[]> {
	// 	return await this.conversationRepository.findEntities({
	// 		findOptions: {
	// 			where: {
	// 				conversationAgentId: agentId ?? { [Op.is]: null },
	// 				conversationTrackerId: trackerIds,
	// 				conversationClosed: false,
	// 			},
	// 		},
	// 		scopes: [SequelizeScopeConst.withoutTimestamps],
	// 	});
	// }
}
