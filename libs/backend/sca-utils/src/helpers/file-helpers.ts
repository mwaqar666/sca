import { createReadStream, existsSync, ReadStream } from "fs";
import { copyFile as copyFileNode, mkdir } from "fs/promises";
import { dirname, extname } from "path";

export abstract class FileHelpers {
	public static async copyFile(fromFilePath: string, toFilePath: string): Promise<void> {
		if (!existsSync(toFilePath)) await mkdir(dirname(toFilePath), { recursive: true });

		return copyFileNode(fromFilePath, toFilePath);
	}

	public static extension(fileName: string): [string, string] {
		const fileNameWithoutExtension = fileName.slice(0, fileName.lastIndexOf("."));
		const fileExtension = extname(fileName);

		return [fileNameWithoutExtension, fileExtension];
	}

	public static async readFile(fileName: string): Promise<string> {
		const [chunks, stream]: [Array<Buffer>, ReadStream] = [[], createReadStream(fileName)];

		for await (const chunk of stream) chunks.push(Buffer.from(chunk));

		return Buffer.concat(chunks).toString("utf-8");
	}
}
