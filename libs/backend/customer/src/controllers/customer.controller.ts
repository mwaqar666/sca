import { Body, Controller, Get } from "@nestjs/common";
import { CustomerApiRoutes } from "@sca-shared/dto";
import { HandleCustomerRequestDto, HandleCustomerResponseDto } from "../dto";

@Controller(CustomerApiRoutes.Prefix)
export class CustomerController {
	@Get(CustomerApiRoutes.Routes.HandleCustomer.Path)
	public async initializeCustomer(@Body() handleCustomerRequestDto: HandleCustomerRequestDto): Promise<HandleCustomerResponseDto> {
		console.log(handleCustomerRequestDto);

		return { customerToken: "" };
	}
}
