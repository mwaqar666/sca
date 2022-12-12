import { CommandType } from "../type";

export abstract class BaseCommandProvider<T = any> {
	public constructor(public readonly data: T) {}

	public abstract provide(): Array<Promise<CommandType<T>>>;
}
