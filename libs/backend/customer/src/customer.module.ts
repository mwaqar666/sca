import { Module } from "@nestjs/common";
import { CustomerController } from "./controllers";
import { CustomerHandleService } from "./services";

@Module({
	controllers: [CustomerController],
	providers: [CustomerHandleService],
})
export class CustomerModule {}
