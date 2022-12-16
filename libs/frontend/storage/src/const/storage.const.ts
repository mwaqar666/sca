import { InjectionToken } from "@angular/core";
import type { StorageInterface } from "../interfaces";

export const StorageInjectionToken = new InjectionToken<StorageInterface>("storage");
