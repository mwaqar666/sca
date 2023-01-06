import { Inject, Injectable } from "@nestjs/common";
import { AgentUtilitiesAggregateConst } from "../../const";
import type { AggregateService } from "@sca-backend/aggregate";
import type { IAgentUtilitiesAggregate } from "../../types";

@Injectable()
export class AgentSessionService {
	public constructor(
		// Dependencies

		@Inject(AgentUtilitiesAggregateConst) private readonly utilitiesAggregateService: AggregateService<IAgentUtilitiesAggregate>,
	) {}
}
