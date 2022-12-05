import { BaseModule } from "~/base";
import { ControlDbService, ControlService } from "~/control-flow/aggregate";
import { TInjectable, TInjectableRegister, TInjectableToken, TResolvedInjectable, TResolvedInjectableToken } from "~/control-flow/types";
import { Key } from "~/types";
import { DynamicModule, FactoryProvider, Global, Module } from "@nestjs/common";

@Global()
@Module({})
export class ControlFlowModule extends BaseModule {
	public static forRoot<TService extends TInjectable, TDalService extends TInjectable>(
		serviceInjectables: TInjectableRegister<TService>,
		dalServiceInjectables: TInjectableRegister<TDalService>,
	): DynamicModule {
		const controlServiceFactoryProvider = this.createControlServiceFactoryProvider(serviceInjectables);

		const controlDalServiceFactoryProvider = this.createControlDalServiceFactoryProvider(dalServiceInjectables);

		const dependenciesA = this.stripInjectableTokensForInjection(serviceInjectables);
		const dependenciesB = this.stripInjectableTokensForInjection(dalServiceInjectables);

		return {
			providers: [...dependenciesA, ...dependenciesB, controlServiceFactoryProvider, controlDalServiceFactoryProvider],
			exports: [controlServiceFactoryProvider, controlDalServiceFactoryProvider],
			module: ControlFlowModule,
		};
	}

	private static createControlServiceFactoryProvider<T extends TInjectable>(serviceInjectables: TInjectableRegister<T>): FactoryProvider<ControlService<T>> {
		return {
			useFactory: (...resolvedInjectables: Array<TResolvedInjectableToken<T>>) => {
				const injectables = this.mergeResolvedInjectablesWithInjectionTokens(serviceInjectables, resolvedInjectables);

				return new ControlService<T>(injectables);
			},
			inject: [...this.stripInjectableTokensForInjection(serviceInjectables)],
			provide: ControlService,
		};
	}

	private static createControlDalServiceFactoryProvider<T extends TInjectable>(serviceInjectables: TInjectableRegister<T>): FactoryProvider<ControlDbService<T>> {
		return {
			useFactory: (...resolvedInjectables: Array<TResolvedInjectableToken<T>>) => {
				const injectables = this.mergeResolvedInjectablesWithInjectionTokens(serviceInjectables, resolvedInjectables);

				return new ControlDbService<T>(injectables);
			},
			inject: [...this.stripInjectableTokensForInjection(serviceInjectables)],
			provide: ControlDbService,
		};
	}

	private static stripInjectableTokensForInjection<T extends TInjectable>(injectables: TInjectableRegister<T>): Array<TInjectableToken<T>> {
		return Object.values(injectables);
	}

	private static mergeResolvedInjectablesWithInjectionTokens<T extends TInjectable>(initialInjectables: T, resolvedInjectables: Array<TResolvedInjectableToken<T>>): TResolvedInjectable<T> {
		const resolvedInjectablesRegister: Partial<TResolvedInjectable<T>> = {};

		Object.keys(initialInjectables).forEach((injectableName: Key<T>, index: number) => {
			resolvedInjectablesRegister[injectableName] = resolvedInjectables[index] as InstanceType<T[Key<T>]>;
		});

		return resolvedInjectablesRegister as TResolvedInjectable<T>;
	}
}
