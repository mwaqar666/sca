import { HttpStatus } from "@nestjs/common";
import { AppExceptionDto } from "../dto";

export const AppDefaultException: AppExceptionDto = {
	error: "Internal Server Error",
	message: "Internal Server Error",
	statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
};
