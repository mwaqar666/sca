import { Inject, Injectable } from "@nestjs/common";
import { AgentUtilitiesAggregateConst } from "../../const";
import type { AggregateService } from "@sca-backend/aggregate";
import type { IAgentUtilitiesAggregate } from "../../types";
import { SocketService } from "@sca-backend/socket";
import type { AuthUserSocket } from "@sca-backend/auth";
import { AuthUser } from "@sca-backend/auth";
import { AgentQueryDalService, CustomerQueryDalService, SessionDalService } from "@sca-backend/data-access-layer";
import type { IAgentAssigned, IAgentUnAssigned, ICustomerAssignment, ICustomerReservation } from "@sca-backend/service-bus";
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

				let customer = await this.customerQueryDalService.fetchCustomerForAgentSession(customerUuid, authenticatedAgentProjectUuid);
				if (!customer) return;

				// await this.customerChatService.closeConversations(customer);
				customer = await this.sessionDalService.assignAgentToCustomer(customer, authenticatedAgent.userUuid);

				const customerReservation: ICustomerReservation = { byAgentUuid: authenticatedAgent.userUuid, customer: customer };
				const customerAssignment: ICustomerAssignment = { toAgentUuid: authenticatedAgent.userUuid, customer: customer };
				const agentAssigned: IAgentAssigned = { toAgentUuid: authenticatedAgent.userUuid, customer: customer };

				await this.socketBusService.publishMessage<ICustomerReservation>(SocketBusMessages.CustomerReservedNotification, customerReservation);
				await this.socketBusService.publishMessage<ICustomerAssignment>(SocketBusMessages.CustomerAssignedNotification, customerAssignment);
				await this.socketBusService.publishMessage<IAgentAssigned>(SocketBusMessages.AgentAssignedNotification, agentAssigned);
			},
		});
	}

	public async endSessionWithCustomer(agentSocket: AuthUserSocket, customerUuid: string): Promise<void> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				const authenticatedAgent = agentSocket.data[AuthUser];
				const authenticatedAgentProjectUuid = authenticatedAgent.userCurrentProject.projectUserProject.projectUuid;

				let customer = await this.customerQueryDalService.fetchCustomerForAgentSession(customerUuid, authenticatedAgentProjectUuid);
				if (!customer) return;

				// await this.customerChatService.closeConversations(customer, socket.data.agent.user_uuid);
				customer = await this.sessionDalService.unAssignAgentFromCustomer(customer);

				const customerReservation: ICustomerReservation = { byAgentUuid: authenticatedAgent.userUuid, customer: customer };
				const customerAssignment: ICustomerAssignment = { toAgentUuid: authenticatedAgent.userUuid, customer: customer };
				const agentUnAssigned: IAgentUnAssigned = { customer: customer };

				await this.socketBusService.publishMessage<ICustomerReservation>(SocketBusMessages.CustomerUnReservedNotification, customerReservation);
				await this.socketBusService.publishMessage<ICustomerAssignment>(SocketBusMessages.CustomerUnAssignedNotification, customerAssignment);
				await this.socketBusService.publishMessage<IAgentUnAssigned>(SocketBusMessages.AgentUnAssignedNotification, agentUnAssigned);
			},
		});
	}
}
