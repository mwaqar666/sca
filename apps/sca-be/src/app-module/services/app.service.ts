import { ExceptionFilter, INestApplication, INestApplicationContext, Injectable, NestInterceptor, PipeTransform } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AppConfig, ConfigType } from "@sca/config";
import { EntityKeyColumnStripperInterceptor } from "@sca/db";
import { Constructable, SingleStructureResponseException, SingleStructureResponseInterceptor, ValidationPipe, ValidatorContainerConfig } from "@sca/utils";
import { useContainer } from "class-validator";

@Injectable()
export class AppService {
	public constructor(
		// Dependencies

		private readonly configService: ConfigService<ConfigType, true>,
	) {}

	private get applicationRunConfig(): [number, string] {
		const { port, host } = this.configService.get<AppConfig>("app");

		return [port, host];
	}

	private get applicationInterceptors(): NestInterceptor[] {
		const interceptors = [SingleStructureResponseInterceptor, EntityKeyColumnStripperInterceptor];

		return interceptors.map((interceptor: Constructable<NestInterceptor>) => new interceptor());
	}

	private get applicationExceptionFilters(): ExceptionFilter[] {
		const exceptionFilters = [SingleStructureResponseException];

		return exceptionFilters.map((exceptionFilter: Constructable<ExceptionFilter>) => new exceptionFilter());
	}

	private get applicationPipes(): PipeTransform[] {
		return [ValidationPipe];
	}

	public async registerAndStartApplicationProcesses(app: INestApplication, appModule: INestApplicationContext): Promise<void> {
		useContainer(appModule, ValidatorContainerConfig);

		app.enableCors();

		await app
			.useGlobalInterceptors(...this.applicationInterceptors)
			.useGlobalPipes(...this.applicationPipes)
			.useGlobalFilters(...this.applicationExceptionFilters)
			.listen(...this.applicationRunConfig);
	}
}
