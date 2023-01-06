import { BaseRepository, type EntityType } from "@sca-backend/db";
import { TrackerEntity } from "../entities";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import type { ICustomerTrackingInfo } from "@sca-shared/dto";
import type { Transaction } from "sequelize";

@Injectable()
export class TrackerRepository extends BaseRepository<TrackerEntity> {
	public constructor(
		// Dependencies

		@InjectModel(TrackerEntity) private readonly trackerEntity: EntityType<TrackerEntity>,
	) {
		super(trackerEntity);
	}

	public async createNewTracker(customerId: number, projectId: number, trackingInfo: ICustomerTrackingInfo, transaction: Transaction): Promise<TrackerEntity> {
		return await this.createSingleEntity({
			transaction,
			valuesToCreate: { trackerCustomerId: customerId, trackerProjectId: projectId, trackerTrackingInfo: trackingInfo },
		});
	}

	public async updateTrackerInfo(tracker: TrackerEntity, trackingInfo: ICustomerTrackingInfo, transaction: Transaction): Promise<TrackerEntity> {
		return await this.updateSingleEntity({ entity: tracker, transaction, valuesToUpdate: { trackerTrackingInfo: trackingInfo } });
	}
}
