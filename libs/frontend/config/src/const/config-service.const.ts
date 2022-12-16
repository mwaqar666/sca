import { InjectionToken } from "@angular/core";
import type { ConfigType } from "../types";

export const ConfigServiceInjectionToken = new InjectionToken<ConfigType>("config");
