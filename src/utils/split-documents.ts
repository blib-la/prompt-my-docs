import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { config } from "../config/config.js";

export async function splitDocuments(type: string, docs: Document<Record<string, any>>[]) {
	let splitter = null;

	if (config.get(`dataType.${type}.enabled`)) {
		switch (type) {
			case "ts":
			case "js":
				splitter = RecursiveCharacterTextSplitter.fromLanguage("js", {
					chunkSize: config.get(`dataType.${type}.chunkSize`),
					chunkOverlap: config.get(`dataType.${type}.chunkOverlap`),
				});
				break;
			case "markdown":
				splitter = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
					chunkSize: config.get(`dataType.${type}.chunkSize`),
					chunkOverlap: config.get(`dataType.${type}.chunkOverlap`),
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
