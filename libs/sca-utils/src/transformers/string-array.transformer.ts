import { TransformFnParams } from "class-transformer";

export const StringArrayTransformer: (params: TransformFnParams) => Array<string> = (params: TransformFnParams) => {
	const filteredSegmentedStrings: string[] = [];
	const segmentedStrings: Array<string> = (params.value as string).split(",");

	for (let segmentedString of segmentedStrings) {
		segmentedString = segmentedString.trim();

		if (segmentedString === "") continue;

		filteredSegmentedStrings.push(segmentedString);
	}

	return filteredSegmentedStrings;
};
