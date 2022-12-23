import { Body, Controller, Get } from "@nestjs/common";
import { CustomerApiRoutes } from "@sca-shared/dto";
import { HandleCustomerRequestDto, HandleCustomerResponseDto } from "../dto";

@Controller(CustomerApiRoutes.prefix)
export class CustomerController {
	@Get(CustomerApiRoutes.routes.handleCustomer.path)
	public async initializeCustomer(@Body() handleCustomerRequestDto: HandleCustomerRequestDto): Promise<HandleCustomerResponseDto> {
		console.log(handleCustomerRequestDto);

		return { customerToken: "" };
	}
}
