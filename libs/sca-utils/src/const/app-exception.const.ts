import { AppExceptionDto } from "@/dto";
import { HttpStatus } from "@nestjs/common";

export const AppDefaultException: AppExceptionDto = {
	error: "Internal Server Error",
	message: "Internal Server Error",
	statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
};
