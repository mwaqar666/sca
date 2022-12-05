import { ValidationConfig } from "~/config";
import { ValidationPipe as NestValidationPipe } from "@nestjs/common";

export const ValidationPipe = new NestValidationPipe(ValidationConfig);
