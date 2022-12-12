import { ValidationPipe as NestValidationPipe } from "@nestjs/common";
import { ValidationConfig } from "../config";

export const ValidationPipe = new NestValidationPipe(ValidationConfig);
