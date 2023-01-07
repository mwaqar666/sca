import { Inject, Injectable } from "@nestjs/common";
import { CustomerBuilderDalService, CustomerQueryDalService } from "@sca-backend/data-access-layer";
import { SocketService } from "@sca-backend/socket";
import { AgentUtilitiesAggregateConst } from "../../const";
import type { IProjectCustomersResponse } from "@sca-shared/dto";
import type { AggregateService } from "@sca-backend/aggregate";
import type { IAgentUtilitiesAggregate } from "../../types";
import type { AuthUserSocket } from "@sca-backend/auth";
import { AuthUser } from "@sca-backend/auth";

@Injectable()
export class AgentQueryService extends SocketService {
	public constructor(
		// Dependencies

		private readonly customerQueryDalService: CustomerQueryDalService,
		private readonly customerBuilderDalService: CustomerBuilderDalService,
		@Inject(AgentUtilitiesAggregateConst) private readonly utilitiesAggregateService: AggregateService<IAgentUtilitiesAggregate>,
	) {
		super();
	}

	public async fetchCustomersForAgentOfProject(agentSocket: AuthUserSocket): Promise<IProjectCustomersResponse> {
		return await this.utilitiesAggregateService.services.exceptionHandler.executeExceptionHandledOperation({
			operation: async () => {
				const { userUuid, userCurrentProject } = agentSocket.data[AuthUser];
				const { projectUserProject } = userCurrentProject;
				const { projectUuid } = projectUserProject;

				const customerConnections = await this.customerQueryDalService.fetchCustomersForAgentOfProject(userUuid, projectUuid);
				const assignedCustomers = await this.customerBuilderDalService.buildConnectedCustomer(customerConnections.assignedCustomers);
				const unassignedCustomers = await this.customerBuilderDalService.buildConnectedCustomer(customerConnections.unassignedCustomers);

				return { assignedCustomers, unassignedCustomers };
			},
		});
	}
}
