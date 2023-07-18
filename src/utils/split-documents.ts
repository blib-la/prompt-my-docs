import { Document } from "langchain/document";
import { JavaScriptTextSplitter } from "../docs/splitter/javascript-text-splitter.js";
import { MarkdownTextSplitter } from "langchain/text_splitter";
import { TYPE_MARKDOWN, TYPE_TYPESCRIPT } from "../docs/weaviate.js";

export async function splitDocuments(type: string, docs: Document<Record<string, any>>[]) {
	let splitter = null;

	if (type === TYPE_TYPESCRIPT) {
		splitter = new JavaScriptTextSplitter({
			chunkSize: 1000,
			chunkOverlap: 0,
		});
	}

	if (type === TYPE_MARKDOWN) {
		splitter = new MarkdownTextSplitter({
			chunkSize: 1000,
			chunkOverlap: 0,
		});
	}

	if (splitter === null) {
		throw new Error("no splitter specified");
	}

	const chunkedDocs = await splitter.splitDocuments(docs);

	return chunkedDocs;
}
