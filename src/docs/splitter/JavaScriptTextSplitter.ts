import type { RecursiveCharacterTextSplitterParams } from "langchain/text_splitter";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

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

	async splitText(text: string): Promise<string[]> {
		const noIndentText = this.removeIndentation(text);
		return super.splitText(noIndentText);
	}

	private removeIndentation(text: string): string {
		return text
			.split("\n")
			.map(line => line.trimStart())
			.join("\n");
	}
}
