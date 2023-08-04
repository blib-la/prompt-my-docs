import { Document } from "langchain/document";
import { JavaScriptTextSplitter } from "../docs/splitter/javascript-text-splitter.js";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { config } from "../config/config.js";

export async function splitDocuments(type: string, docs: Document<Record<string, any>>[]) {
	let splitter = null;

	if (config.get(`fileTypes.${type}.enabled`)) {
		switch (type) {
			case "ts":
			case "js":
				splitter = RecursiveCharacterTextSplitter.fromLanguage("js", {
					chunkSize: config.get(`fileTypes.${type}.chunkSize`),
					chunkOverlap: config.get(`fileTypes.${type}.chunkOverlap`),
				});
				break;
			case "markdown":
				splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
					chunkSize: config.get(`fileTypes.${type}.chunkSize`),
					chunkOverlap: config.get(`fileTypes.${type}.chunkOverlap`),
				});
				break;
		}
	}

	if (splitter === null) {
		throw new Error("no splitter specified");
	}

	const chunkedDocs = await splitter.splitDocuments(docs);

	return chunkedDocs;
}
