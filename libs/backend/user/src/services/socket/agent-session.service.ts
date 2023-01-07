import { Inject, Injectable } from "@nestjs/common";
import { AgentUtilitiesAggregateConst } from "../../const";
import type { AggregateService } from "@sca-backend/aggregate";
import type { IAgentUtilitiesAggregate } from "../../types";
import { SocketService } from "@sca-backend/socket";
import type { AuthUserSocket } from "@sca-backend/auth";
import { AuthUser } from "@sca-backend/auth";
import { AgentQueryDalService, CustomerQueryDalService, SessionDalService } from "@sca-backend/data-access-layer";
import type { IAgentAssigned, ICustomerAssigned, ICustomerReserved } from "@sca-backend/service-bus";
import { SocketBusMessages, SocketBusService } from "@sca-backend/service-bus";

@Injectable()
export class AgentSessionService extends SocketService {
	public constructor(
		// Dependencies

		private readonly socketBusService: SocketBusService,
		private readonly sessionDalService: SessionDalService,
		private readonly agentQueryDalService: AgentQueryDalService,
		private readonly customerQueryDalService: CustomerQueryDalService,
		@Inject(AgentUtilitiesAggregateConst) private readonly utilitiesAggregateService: AggregateService<IAgentUtilitiesAggregate>,
	) {
		super();
	}

	public async startSessionWithCustomer(agentSocket: AuthUserSocket, customerUuid: string): Promise<void> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				const authenticatedAgent = agentSocket.data[AuthUser];
				const authenticatedAgentProjectUuid = authenticatedAgent.userCurrentProject.projectUserProject.projectUuid;

				let customerToAssign = await this.customerQueryDalService.fetchCustomerToStartSessionWith(customerUuid, authenticatedAgentProjectUuid);
				if (!customerToAssign) return;

				// await this.customerChatService.closeConversations(customerToAssign);
				customerToAssign = await this.sessionDalService.assignAgentToCustomer(customerToAssign, authenticatedAgent.userUuid);

				await this.socketBusService.publishMessage<ICustomerReserved>(SocketBusMessages.CustomerReservedNotification, { byAgentUuid: authenticatedAgent.userUuid, customer: customerToAssign });
				await this.socketBusService.publishMessage<ICustomerAssigned>(SocketBusMessages.CustomerAssignedNotification, { toAgentUuid: authenticatedAgent.userUuid, customer: customerToAssign });
				await this.socketBusService.publishMessage<IAgentAssigned>(SocketBusMessages.AgentAssignedNotification, { toAgentUuid: authenticatedAgent.userUuid, customer: customerToAssign });
			},
		});
	}
}
