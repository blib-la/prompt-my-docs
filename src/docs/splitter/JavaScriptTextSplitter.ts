import type { RecursiveCharacterTextSplitterParams } from "langchain/text_splitter";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

/**
 * `JavaScriptTextSplitter` class is an extension of `RecursiveCharacterTextSplitter`.
 * The class is primarily used for splitting and handling JavaScript / TypeScript code.
 */
export class JavaScriptTextSplitter extends RecursiveCharacterTextSplitter {
	constructor(fields?: Partial<RecursiveCharacterTextSplitterParams>) {
		super(fields);

		const separators = [
			"\nexport",
			"\ndefault",
			"\nfunction",
			"\nasync function",
			"\nclass",
			"\ninterface",
			"\ntype",
			"\n\n",
			"\n",
			" ",
			"",
		];

		this.separators = fields?.separators ?? separators;
	}

	/**
	 * Splits a provided text string into an array of strings, with removed indentation.
	 *
	 * @param text - The input text to be split.
	 *
	 * @returns A promise which resolves with an array of sub-strings.
	 */
	async splitText(text: string): Promise<string[]> {
		const noIndentText = this.removeIndentation(text);
		return super.splitText(noIndentText);
	}

	/**
	 * Removes leading whitespace from each line in a text.
	 *
	 * @param text - The input text from which to remove indentation.
	 *
	 * @returns The text with leading whitespace removed from each line.
	 */
	private removeIndentation(text: string): string {
		return text
			.split("\n")
			.map(line => line.trimStart())
			.join("\n");
	}
}
