import { Optional } from "@sca-shared/utils";
import * as process from "process";
import type { BaseCommand } from "../base";
import type { ArgumentDetails, CommandArguments, CommandFlagArguments, CommandHelp, CommandKeyValueArguments } from "../type";

export class CommandHelper {
	private command: BaseCommand;
	private name: string;
	private args: Optional<CommandArguments>;
	private help: CommandHelp;
	private sectionSeparator = "\n \n \n";
	private headingUnderLineStyle = "=";

	public showCommandHelp(command: BaseCommand): never {
		this.command = command;

		this.extractCommandHelpData();

		console.clear();

		console.log(this.generateHelpText());

		process.exit();
	}

	private extractCommandHelpData(): void {
		this.name = this.command.commandName();
		this.args = this.command.commandArguments();
		this.help = this.command.commandHelp();
	}

	private generateHelpText(): string {
		const description = this.generateDescription();
		const syntax = this.generateSyntax();
		const argumentDetails = this.generateArgumentDetails();

		return this.generateConcatenatedSections(description, syntax, argumentDetails);
	}

	private generateDescription(): string {
		const heading = this.generateHeading("Description");
		const description = this.help.commandDescription;

		return `${heading}\n${description}`;
	}

	private generateSyntax(): string {
		const heading = this.generateHeading("Syntax");
		const commandSyntax = `\nnx run sca-cmd:run:[dev|qa|uat|prod] -- ${this.name}`;
		const argumentSyntax = this.generateArgumentSyntax();

		return `${heading}${commandSyntax}${argumentSyntax}`;
	}

	private generateArgumentSyntax(): string {
		let [flagNames, argumentNames]: [Array<string>, Array<string>] = [[], []];

		if (!this.args) return "";

		if (this.args.flagArguments) flagNames = Object.keys(this.args.flagArguments);

		if (this.args.keyValueArguments) argumentNames = Object.keys(this.args.keyValueArguments);

		const argumentSyntax = argumentNames.reduce((argumentSyntaxString: string, argumentName: string) => `${argumentSyntaxString} ${argumentName}=[${argumentName}]`, "");

		const flagSyntax = flagNames.reduce((flagSyntaxString: string, flagName: string) => `${flagSyntaxString} [--${flagName}]`, "");

		return argumentSyntax.concat(flagSyntax);
	}

	private generateArgumentDetails(): string {
		const keyValueArgumentDetails = this.generateGeneralizedArgumentDetails("Key=Value Arguments", "KVArgs");
		const flagArgumentDetails = this.generateGeneralizedArgumentDetails("--Flag Arguments", "FArgs");

		return this.generateConcatenatedSections(keyValueArgumentDetails, flagArgumentDetails);
	}

	private generateGeneralizedArgumentDetails(heading: string, argumentType: "KVArgs" | "FArgs"): string {
		heading = this.generateHeading(heading);
		if (!this.args) return `${heading}\nNo arguments`;

		const argumentDescription = argumentType === "KVArgs" ? this.generateKeyValueArgumentDescription(this.args.keyValueArguments) : this.generateFlagArgumentDescription(this.args.flagArguments);

		return `${heading}${argumentDescription}`;
	}

	private generateKeyValueArgumentDescription(keyValueArguments: Optional<CommandKeyValueArguments>): string {
		if (!keyValueArguments || !this.help.argumentDescription || !this.help.argumentDescription.keyValueArguments) return "\nNo Arguments";

		const keyValueArgumentDescription = this.help.argumentDescription.keyValueArguments;

		return Object.entries(keyValueArguments).reduce((argumentDescriptionString: string, [argumentName, argumentDescription]: [string, ArgumentDetails]) => {
			const argumentInfo = keyValueArgumentDescription[argumentName];
			const requiredOrOptional = `[${argumentDescription.required ? "required" : "optional"}]`;
			const argumentType = `[type: ${argumentDescription.type}]`;
			const argumentDefault = !argumentDescription.required ? `[default: ${argumentDescription.defaultValue}]` : "";

			const argumentDetailString = `${argumentName}: ${argumentInfo} ${requiredOrOptional}${argumentType}${argumentDefault}`;

			return `${argumentDescriptionString}\n${argumentDetailString}`;
		}, "");
	}

	private generateFlagArgumentDescription(flagArguments: Optional<CommandFlagArguments>): string {
		if (!flagArguments || !this.help.argumentDescription || !this.help.argumentDescription.flagArguments) return "\nNo Arguments";

		const flagArgumentDescription = this.help.argumentDescription.flagArguments;

		return Object.entries(flagArguments).reduce((argumentDescriptionString: string, [argumentName, defaultFlag]: [string, boolean]) => {
			const argumentInfo = flagArgumentDescription[argumentName];
			const argumentDefault = `[default: ${defaultFlag}]`;

			const argumentDetailString = `--${argumentName}: ${argumentInfo} ${argumentDefault}`;

			return `${argumentDescriptionString}\n${argumentDetailString}`;
		}, "");
	}

	private generateHeading(heading: string): string {
		heading = `${heading}:`;

		const headingUnderLine = this.generateUnderLine(heading);

		return `${heading}\n${headingUnderLine}`;
	}

	private generateUnderLine(forText: string): string {
		return this.headingUnderLineStyle.repeat(forText.length);
	}

	private generateConcatenatedSections(...sections: Array<string>): string {
		return sections.join(this.sectionSeparator);
	}
}
