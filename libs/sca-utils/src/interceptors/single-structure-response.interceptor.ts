import { AppSuccessfulResponseDto } from "@/dto";
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

@Injectable()
export class SingleStructureResponseInterceptor<T> implements NestInterceptor<T, AppSuccessfulResponseDto<T>> {
	intercept(context: ExecutionContext, next: CallHandler<T>): Observable<AppSuccessfulResponseDto<T>> {
		return next.handle().pipe(
			map((data: T) => {
				return { data, error: null };
			}),
		);
	}
}
