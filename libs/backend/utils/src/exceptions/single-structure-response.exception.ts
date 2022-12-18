import { type ArgumentsHost, Catch, type ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import type { Response } from "express";
import { AppDefaultException } from "../const";
import type { AppExceptionDto } from "../dto";
import { AppUnsuccessfulResponseDto } from "../dto";

@Catch()
export class SingleStructureResponseException implements ExceptionFilter {
	public catch(exception: unknown, host: ArgumentsHost): void {
		const response = host.switchToHttp().getResponse<Response<AppUnsuccessfulResponseDto>>();
		const statusCode = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
		const error: AppExceptionDto = exception instanceof HttpException ? <AppExceptionDto>exception.getResponse() : AppDefaultException;

		response.status(statusCode).json({ data: null, error });
	}
}
