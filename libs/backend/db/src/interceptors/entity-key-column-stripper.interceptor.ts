import { type CallHandler, type ExecutionContext, Injectable, type NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { Association as AssociationType } from "sequelize-typescript";
import { type EntityType, type Relationship, SequelizeBaseEntity } from "../entity";

@Injectable()
export class EntityKeyColumnStripperInterceptor implements NestInterceptor {
	public intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			// Operators

			map((data) => this.filterPrimaryKeysFromResponse(data)),
		);
	}

	public filterPrimaryKeysFromResponse<T>(data: T): T {
		if (this.dataIsAbsent(data)) return data;

		if (Array.isArray(data)) return this.filterArrayData(data) as T;

		if (this.isSequelizeEntity(data)) return this.stripPrimaryAndForeignKeysFromEntity(data) as T;

		if (typeof data === "object") return this.filterObjectData(data);

		return data;
	}

	private filterObjectData(data: any): any {
		const filteredObject: any = {};

		for (const [objectKey, objectValue] of Object.entries(data)) {
			if (this.dataIsAbsent(objectValue)) {
				filteredObject[objectKey] = objectValue;
				continue;
			}

			if (Array.isArray(objectValue)) {
				filteredObject[objectKey] = this.filterArrayData(objectValue);
				continue;
			}

			if (this.isSequelizeEntity(objectValue)) {
				filteredObject[objectKey] = this.stripPrimaryAndForeignKeysFromEntity(objectValue);
				continue;
			}

			if (typeof objectValue === "object") {
				filteredObject[objectKey] = this.filterObjectData(objectValue);
				continue;
			}

			filteredObject[objectKey] = objectValue;
		}

		return filteredObject;
	}

	private filterArrayData(data: any[]): any[] {
		return data.map((dataPiece) => {
			if (this.dataIsAbsent(dataPiece)) return dataPiece;

			if (Array.isArray(dataPiece)) return this.filterArrayData(dataPiece);

			if (this.isSequelizeEntity(dataPiece)) return this.stripPrimaryAndForeignKeysFromEntity(dataPiece);

			if (typeof dataPiece === "object") return this.filterObjectData(dataPiece);

			return dataPiece;
		});
	}

	private dataIsAbsent(data: unknown): data is null | undefined {
		return data === null || data === undefined;
	}

	private isSequelizeEntity(data: any): data is SequelizeBaseEntity<any> {
		return data instanceof SequelizeBaseEntity;
	}

	private stripPrimaryAndForeignKeysFromEntity(data: SequelizeBaseEntity<any>): SequelizeBaseEntity<any> {
		const sequelizeEntityModel = data.constructor as EntityType<SequelizeBaseEntity<any>>;
		const primaryKeyColumnName = sequelizeEntityModel.primaryKeyAttribute;

		const [foreignKeys, relationShips] = this.extractRelationShipEntitiesAndForeignKeys(data, sequelizeEntityModel);

		if (!sequelizeEntityModel.exposePrimaryKey) data.removeDataValue(primaryKeyColumnName);

		foreignKeys.forEach((foreignKey: string) => {
			if (sequelizeEntityModel.exposeForeignKeys.includes(foreignKey)) return;

			data.removeDataValue(foreignKey);
		});

		relationShips.forEach((relationShip: Relationship<any>) => {
			const processedRelationShip = Array.isArray(relationShip.entityOrEntities)
				? relationShip.entityOrEntities.map((eachMultiRelationship: SequelizeBaseEntity<any>) => this.stripPrimaryAndForeignKeysFromEntity(eachMultiRelationship))
				: this.stripPrimaryAndForeignKeysFromEntity(relationShip.entityOrEntities);

			data.setDataValue(relationShip.propertyKey, processedRelationShip);
		});

		return data;
	}

	private extractRelationShipEntitiesAndForeignKeys(data: SequelizeBaseEntity<any>, concreteEntity: EntityType<SequelizeBaseEntity<any>>): [Array<string>, Array<Relationship<any>>] {
		const foreignKeys: Array<string> = [];

		const relationShipData: Array<Relationship<any>> = [];

		for (const { associationType, as: propertyKey, foreignKey } of Object.values(concreteEntity.associations)) {
			if (associationType.toUpperCase() === AssociationType.BelongsTo.toUpperCase()) {
				foreignKeys.push(foreignKey);
			}

			const entityOrEntities = data.getDataValue(propertyKey);
			if (!entityOrEntities) continue;

			relationShipData.push({ propertyKey, entityOrEntities });
		}

		return [foreignKeys, relationShipData];
	}
}
