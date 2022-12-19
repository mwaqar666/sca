const { createGlobPatternsForDependencies } = require("@nrwl/angular/tailwind");
const { join } = require("path");

/** @type {import("tailwindcss").Config} */
module.exports = {
	content: [
		// Contents

		join(__dirname, "src/**/!(*.stories|*.spec).{ts,html}"),
		...createGlobPatternsForDependencies(__dirname),
	],
	theme: {
		extend: {},
	},
	plugins: [],
};
