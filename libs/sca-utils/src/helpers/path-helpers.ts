import * as path from "path";
import { Optional } from "../types";

export abstract class PathHelpers {
	public static migrationsPath(moduleName: string, migrationFileName: string): string {
		return PathHelpers.dalPath(moduleName, "migrations", migrationFileName);
	}

	public static dalPath(moduleName: string, ...pathSegments: string[]): string {
		return PathHelpers.modulePath(moduleName, "data-access-layer", ...pathSegments);
	}

	public static modulePath(...pathSegments: string[]): string {
		return PathHelpers.sourcePath("modules", ...pathSegments);
	}

	public static sourcePath(...pathSegments: string[]): string {
		return PathHelpers.rootPath("src", ...pathSegments);
	}

	public static packagePath(...pathSegments: string[]): string {
		return PathHelpers.rootPath("node_modules", ...pathSegments);
	}

	public static rootPath(...pathSegments: string[]): string {
		pathSegments = this.preparePathSegments(...pathSegments);

		return path.resolve(process.cwd(), ...pathSegments);
	}

	private static preparePathSegments(...pathSegments: Array<Optional<string>>): string[] {
		const segments = [];

		for (const pathSegment of pathSegments) {
			if (!pathSegment) continue;

			segments.push(pathSegment);
		}

		return segments;
	}
}
