import { DynamicModule, FactoryProvider, Global, Module, Type } from "@nestjs/common";
import { BaseModule } from "../base";
import { TInjectable, TInjectableAggregates, TResolvedInjectable } from "./aggregate-services.types";
import { AggregateService } from "./aggregate.service";

@Global()
@Module({})
export class AggregateServicesModule extends BaseModule {
	public static forRoot(injectableAggregates: TInjectableAggregates): DynamicModule {
		const aggregateServiceFactoryProviders = this.createAggregateServiceFactoryProviders(injectableAggregates);

		const aggregateDependencies = this.stripAggregateDependenciesForDependencyResolution(injectableAggregates);

		return {
			providers: [...aggregateDependencies, ...aggregateServiceFactoryProviders],
			exports: aggregateServiceFactoryProviders,
			module: AggregateServicesModule,
		};
	}

	private static createAggregateServiceFactoryProviders(injectableAggregates: TInjectableAggregates): Array<FactoryProvider<AggregateService<TInjectable>>> {
		return Object.entries(injectableAggregates).map(([aggregateName, aggregateInjectables]: [string, TInjectable]) => {
			return {
				useFactory: (...resolvedInjectables: Array<InstanceType<Type>>) => {
					const injectables = this.mergeResolvedInjectablesWithInjectionTokens(aggregateInjectables, resolvedInjectables);

					return new AggregateService(injectables);
				},
				inject: [...this.stripInjectableTokensForInjection(aggregateInjectables)],
				provide: aggregateName,
			};
		});
	}

	private static stripAggregateDependenciesForDependencyResolution(injectableAggregates: TInjectableAggregates): Array<Type> {
		const aggregateDependencies: Array<Type> = [];

		for (const injectableAggregate of Object.values(injectableAggregates)) {
			aggregateDependencies.push(...this.stripInjectableTokensForInjection(injectableAggregate));
		}

		return aggregateDependencies;
	}

	private static stripInjectableTokensForInjection(injectables: TInjectable): Array<Type> {
		return Object.values(injectables);
	}

	private static mergeResolvedInjectablesWithInjectionTokens(initialInjectables: TInjectable, resolvedInjectables: Array<InstanceType<Type>>): TResolvedInjectable {
		const resolvedInjectablesRegister: Partial<TResolvedInjectable> = {};

		Object.keys(initialInjectables).forEach((injectableName: string, index: number) => {
			resolvedInjectablesRegister[injectableName] = resolvedInjectables[index];
		});

		return resolvedInjectablesRegister as TResolvedInjectable;
	}
}
