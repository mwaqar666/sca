import { resolve } from "path";
import type { Optional } from "../types";

export abstract class PathHelpers {
	public static libraryPath(pathSegments: string): string;
	public static libraryPath(pathSegments: Array<string>): string;
	public static libraryPath(pathSegments: string | Array<string>): string {
		if (typeof pathSegments === "string") pathSegments = this.splitRawPath(pathSegments);

		return PathHelpers.rootPath(["libs", ...pathSegments]);
	}

	public static applicationPath(pathSegments: string): string;
	public static applicationPath(pathSegments: Array<string>): string;
	public static applicationPath(pathSegments: string | Array<string>): string {
		if (typeof pathSegments === "string") pathSegments = this.splitRawPath(pathSegments);

		return PathHelpers.rootPath(["apps", ...pathSegments]);
	}

	public static rootPath(pathSegments: string): string;
	public static rootPath(pathSegments: Array<string>): string;
	public static rootPath(pathSegments: string | Array<string>): string {
		if (typeof pathSegments === "string") pathSegments = this.splitRawPath(pathSegments);

		pathSegments = this.preparePathSegments(pathSegments);

		return resolve(process.cwd(), ...pathSegments);
	}

	private static splitRawPath(rawPath: string): Array<string> {
		return rawPath.split(/[\\/]/);
	}

	private static preparePathSegments(pathSegments: Array<Optional<string>>): Array<string> {
		const preparedPathSegments: Array<string> = [];

		for (const pathSegment of pathSegments) {
			if (pathSegment === null || pathSegment === undefined || pathSegment === "") continue;

			preparedPathSegments.push(pathSegment);
		}

		return preparedPathSegments;
	}
}
