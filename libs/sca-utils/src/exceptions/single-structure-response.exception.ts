import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { AppDefaultException } from "../const";
import { AppExceptionDto } from "../dto";

@Catch()
export class SingleStructureResponseException implements ExceptionFilter<unknown> {
	catch(exception: unknown, host: ArgumentsHost): void {
		const response = host.switchToHttp().getResponse<Response>();
		const statusCode = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
		const error: AppExceptionDto = exception instanceof HttpException ? (exception.getResponse() as AppExceptionDto) : AppDefaultException;

		response.status(statusCode).json({ data: null, error });
	}
}
