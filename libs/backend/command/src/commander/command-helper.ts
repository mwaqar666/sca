import { Optional } from "@sca/utils";
import * as process from "process";
import { BaseCommand } from "../base";
import { ArgumentDetails, CommandArguments, CommandHelp, CommandKeyValueArguments } from "../type";

export class CommandHelper {
	private command: BaseCommand;
	private name: string;
	private args: Optional<CommandArguments>;
	private help: CommandHelp;
	private sectionSeparator = "\n\n";
	private headingUnderLineStyle = "=";

	public showCommandHelp(command: BaseCommand): never {
		this.command = command;

		this.extractCommandHelpData();

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

	private generateArgumentDetails(): string {
		const heading = this.generateHeading("Arguments");
		if (!this.args) return `${heading}\nNo arguments`;

		const argumentDescription = this.generateKeyValueArgumentDetails(this.args.keyValueArguments);

		return `${heading}${argumentDescription}`;
	}

	private generateKeyValueArgumentDetails(keyValueArguments: Optional<CommandKeyValueArguments>): string {
		if (!keyValueArguments) return "";

		return Object.entries(keyValueArguments).reduce((argumentDescriptionString: string, [argumentName, argumentDescription]: [string, ArgumentDetails]) => {
			const argumentInfo = this.help.argumentDescription[argumentName];
			const requiredOrOptional = `[${argumentDescription.required ? "required" : "optional"}]`;
			const argumentType = `[type: ${argumentDescription.type}]`;
			const argumentDefault = "defaultValue" in argumentDescription ? `[default: ${argumentDescription.defaultValue}]` : "";

			const argumentDetailString = `${argumentName}: ${argumentInfo} ${requiredOrOptional}${argumentType}${argumentDefault}`;

			return `${argumentDescriptionString}\n${argumentDetailString}`;
		}, "");
	}

	private generateHeading(heading: string): string {
		const headingUnderLine = this.generateUnderLine(heading);

		return `${heading}\n${headingUnderLine}`;
	}

	private generateUnderLine(forText: string): string {
		return this.headingUnderLineStyle.repeat(forText.length);
	}

	private generateArgumentSyntax(): string {
		let [flagNames, argumentNames]: [Array<string>, Array<string>] = [[], []];

		if (!this.args) return "";

		if (this.args.flagArguments) flagNames = this.args.flagArguments;

		if (this.args.keyValueArguments) argumentNames = Object.keys(this.args.keyValueArguments);

		const argumentSyntax = argumentNames.reduce((argumentSyntaxString: string, argumentName: string) => `${argumentSyntaxString} ${argumentName}=[${argumentName}]`, "");

		const flagSyntax = flagNames.reduce((flagSyntaxString: string, flagName: string) => `${flagSyntaxString} [--${flagName}]`, "");

		return argumentSyntax.concat(flagSyntax);
	}

	private generateConcatenatedSections(...sections: Array<string>): string {
		return sections.join(this.sectionSeparator);
	}
}
