import { HttpStatus, Injectable, InternalServerErrorException } from "@nestjs/common";
import type { IExceptionHandler } from "../types";
import type { AppExceptionDto } from "../dto";

@Injectable()
export class ExceptionHandlerService {
	public async executeExceptionHandledOperation<T>(exceptionHandler: IExceptionHandler<T>): Promise<T> {
		try {
			return await exceptionHandler.operation();
		} catch (error) {
			if (exceptionHandler.exceptionHandler) await exceptionHandler.exceptionHandler(error);

			throw this.createInternalServerError(error);
		}
	}

	private createInternalServerError(error: unknown): InternalServerErrorException {
		if (error instanceof InternalServerErrorException) return error;

		const caughtException = error as Error;
		const httpErrorResponse: AppExceptionDto = { error: caughtException.message, message: caughtException.message, statusCode: HttpStatus.INTERNAL_SERVER_ERROR };
		return new InternalServerErrorException(httpErrorResponse);
	}
}
