import { PassportStrategy } from "@nestjs/passport";
import { Strategy, type StrategyOptions } from "passport-jwt";

export function BaseJwtStrategyFactory(strategyName: string) {
	return class BaseJwtStrategy extends PassportStrategy(Strategy, strategyName) {
		public constructor(strategyOptions: StrategyOptions) {
			super(strategyOptions);
		}
	};
}
