import { Inject, Injectable } from "@nestjs/common";
import { TrackerRepository } from "../repositories";
import { DomainExtensionsAggregateConst } from "../../../const";
import type { AggregateService } from "@sca-backend/aggregate";
import type { IDomainExtensionsAggregate } from "../../../types";

@Injectable()
export class TrackerService {
	public constructor(
		// Dependencies

		private readonly trackerRepository: TrackerRepository,
		@Inject(DomainExtensionsAggregateConst) private readonly extensionsAggregateService: AggregateService<IDomainExtensionsAggregate>,
	) {}
}
