import { SetMetadata } from "@nestjs/common";
import { GuardIdentifier } from "../const";

export const Skip = <TEntity>(entityToSkip: string, entityName: TEntity) => SetMetadata(entityToSkip, entityName);

export const SkipGuard = <TGuard>(guardName: TGuard) => Skip(GuardIdentifier, guardName);
