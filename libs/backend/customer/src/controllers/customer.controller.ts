import { Body, Controller, Post, Request as NestRequest } from "@nestjs/common";
import { CustomerApiRoutes } from "@sca-shared/dto";
import type { Request } from "express";
import { HandleCustomerRequestDto, HandleCustomerResponseDto } from "../dto";
import { CustomerHandleService } from "../services";

@Controller(CustomerApiRoutes.Prefix)
export class CustomerController {
	public constructor(
		// Dependencies

		private readonly customerHandleService: CustomerHandleService,
	) {}

	@Post(CustomerApiRoutes.Routes.HandleCustomer.Path)
	public async initializeCustomer(@NestRequest() request: Request, @Body() handleCustomerRequestDto: HandleCustomerRequestDto): Promise<HandleCustomerResponseDto> {
		return await this.customerHandleService.handleCustomer(request, handleCustomerRequestDto);
	}
}
