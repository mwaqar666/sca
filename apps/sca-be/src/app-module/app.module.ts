import { Module } from "@nestjs/common";
import { ConfigModule } from "@sca-backend/config";
import { CustomerModule } from "@sca-backend/customer";
import { BaseModule } from "@sca-backend/utils";
import { AppService } from "./services";

@Module({
	imports: [ConfigModule, CustomerModule],
	providers: [...Object.values([AppService])],
})
export class AppModule extends BaseModule {}
