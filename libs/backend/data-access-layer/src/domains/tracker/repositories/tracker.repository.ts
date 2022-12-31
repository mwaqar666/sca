import { BaseRepository, type EntityType } from "@sca-backend/db";
import { TrackerEntity } from "../entities";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

@Injectable()
export class TrackerRepository extends BaseRepository<TrackerEntity> {
	public constructor(
		// Dependencies

		@InjectModel(TrackerEntity) private readonly trackerEntity: EntityType<TrackerEntity>,
	) {
		super(trackerEntity);
	}
}
