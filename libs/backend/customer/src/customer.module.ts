import { Module } from "@nestjs/common";
import { CustomerController } from "./controllers";

@Module({
	controllers: [CustomerController],
})
export class CustomerModule {}
