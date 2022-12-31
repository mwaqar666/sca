import { Inject, Injectable } from "@nestjs/common";
import { TrackerRepository } from "../repositories";
import { DomainExtensionsAggregateConst } from "../../../const";
import type { AggregateService } from "@sca-backend/aggregate";
import type { IDomainExtensionsAggregate } from "../../../types";
import type { TrackerEntity } from "../entities";
import type { RunningTransaction } from "@sca-backend/db";
import { SequelizeScopeConst } from "@sca-backend/db";
import type { ICustomerPageVisitInfo, ICustomerTrackingInfo } from "../types";
import type { PartialExcept } from "@sca-shared/utils";

@Injectable()
export class TrackerService {
	public constructor(
		// Dependencies

		private readonly trackerRepository: TrackerRepository,
		@Inject(DomainExtensionsAggregateConst) private readonly extensionsAggregateService: AggregateService<IDomainExtensionsAggregate>,
	) {}

	public async findTrackingRecord(trackingNumber: string): Promise<TrackerEntity> {
		return await this.trackerRepository.findOrFailEntity({
			scopes: [SequelizeScopeConst.withoutTimestamps],
			findOptions: { where: { trackerTrackingNumber: trackingNumber } },
		});
	}

	public async startTracker(customerId: number, projectId: number, connectionId: string, pageUrl: string, withTransaction?: RunningTransaction): Promise<TrackerEntity> {
		return await this.extensionsAggregateService.services.sequelize.executeTransactionalOperation({
			withTransaction,
			transactionCallback: async (runningTransaction: RunningTransaction): Promise<TrackerEntity> => {
				const trackerStartTime = new Date().toISOString();
				const pageVisitInfo = this.preparePageVisitInfo({ pageUrl, pageArrivalTime: trackerStartTime });
				const trackingInfo = this.prepareTrackingInfo({ arrivalTime: trackerStartTime, pageVisits: { [connectionId]: [pageVisitInfo] } });

				return await this.trackerRepository.createNewTracker(customerId, projectId, trackingInfo, runningTransaction.currentTransaction.transaction);
			},
		});
	}

	public async finishTracker(trackingNumber: string, withTransaction?: RunningTransaction): Promise<TrackerEntity> {
		return await this.extensionsAggregateService.services.sequelize.executeTransactionalOperation({
			withTransaction,
			transactionCallback: async (runningTransaction: RunningTransaction) => {
				const tracker = await this.findTrackingRecord(trackingNumber);

				const trackingInfo = tracker.trackerTrackingInfo;
				trackingInfo.departureTime = new Date().toISOString();

				return await this.trackerRepository.updateTrackerInfo(tracker, trackingInfo, runningTransaction.currentTransaction.transaction);
			},
		});
	}

	public async addPageArrivalTrack(trackingNumber: string, connectionId: string, pageUrl: string, withTransaction?: RunningTransaction): Promise<TrackerEntity> {
		return await this.extensionsAggregateService.services.sequelize.executeTransactionalOperation({
			withTransaction,
			transactionCallback: async (runningTransaction: RunningTransaction) => {
				const tracker = await this.findTrackingRecord(trackingNumber);

				const trackingInfo = tracker.trackerTrackingInfo;
				const pageVisitInfo = this.preparePageVisitInfo({ pageUrl });
				const connectionIdPreviousTracks: Array<ICustomerPageVisitInfo> = trackingInfo.pageVisits[connectionId] ?? [];
				trackingInfo.pageVisits[connectionId] = [...connectionIdPreviousTracks, pageVisitInfo];

				return await this.trackerRepository.updateTrackerInfo(tracker, trackingInfo, runningTransaction.currentTransaction.transaction);
			},
		});
	}

	public async addPageDepartureTrack(trackingNumber: string, connectionId: string, withTransaction?: RunningTransaction): Promise<TrackerEntity> {
		return await this.extensionsAggregateService.services.sequelize.executeTransactionalOperation({
			withTransaction,
			transactionCallback: async (runningTransaction: RunningTransaction) => {
				const tracker = await this.findTrackingRecord(trackingNumber);

				const trackingInfo = tracker.trackerTrackingInfo;
				const connectionIdPreviousTracks: Array<ICustomerPageVisitInfo> = trackingInfo.pageVisits[connectionId];
				connectionIdPreviousTracks[connectionIdPreviousTracks.length - 1].pageDepartureTime = new Date().toISOString();
				trackingInfo.pageVisits[connectionId] = connectionIdPreviousTracks;

				return await this.trackerRepository.updateTrackerInfo(tracker, trackingInfo, runningTransaction.currentTransaction.transaction);
			},
		});
	}

	private prepareTrackingInfo(providedTrackingInfo: PartialExcept<ICustomerTrackingInfo, "pageVisits">): ICustomerTrackingInfo {
		return {
			arrivalTime: providedTrackingInfo.arrivalTime ?? new Date().toISOString(),
			departureTime: providedTrackingInfo.departureTime ?? null,
			customerSource: providedTrackingInfo.customerSource ?? "website",
			pageVisits: providedTrackingInfo.pageVisits,
		};
	}

	private preparePageVisitInfo(providedPageVisitInfo: Partial<ICustomerPageVisitInfo>): ICustomerPageVisitInfo {
		return {
			pageArrivalTime: providedPageVisitInfo.pageArrivalTime ?? new Date().toISOString(),
			pageDepartureTime: providedPageVisitInfo.pageDepartureTime ?? null,
			pageUrl: providedPageVisitInfo.pageUrl ?? "Unknown",
		};
	}
}
