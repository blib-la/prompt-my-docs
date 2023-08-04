import path from "node:path";

import { Document } from "langchain/document";
import { DirectoryLoaderPro } from "../docs/loaders/directory-loader-pro.js";
import { PATH_DOCS } from "../docs/weaviate.js";
import { UnknownHandling } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { config } from "../config/config.js";
import { minifyConfig } from "../config/minify-config.js";
import { minify } from "terser";
import { minifyTs } from "./minify-ts.js";

export async function loadDocuments(
	type: string,
	directory: string
): Promise<Document<Record<string, any>>[]> {
	let loader = null;

	const loaders: { [extension: string]: (path: string | Blob) => TextLoader } = {};
	config.get(`fileTypes.${type}.extensions`).forEach((extension: string) => {
		loaders[extension] = (path: string | Blob) => new TextLoader(path);
	});

	loader = new DirectoryLoaderPro(
		path.join(PATH_DOCS, directory),
		loaders,
		config.get(`fileTypes.${type}.ignorePaths`),
		true,
		UnknownHandling.Ignore
	);

	if (loader === null) {
		throw new Error("No loader specified");
	}

	const docs = await loader.load();

	docs.map(async (doc: { pageContent: string; metadata: { source: any } }) => {
		const {
			metadata: { source },
			pageContent,
		} = doc;

		// Fix the "source" to point to relative path instead of full local path
		const localPath = source.split("/prompt-my-docs/docs/")[1].replaceAll("\\", "/");
		const newSource = `docs/${localPath}`;
		doc.metadata.source = newSource;

		// Minify the pageContent to get rid of unneeded new lines, spaces, comments
		// to save tokens
		if (type === "js") {
			try {
				doc.pageContent = (await minify(pageContent, minifyConfig)).code as string;
			} catch (error) {}
		}

		if (type === "ts") {
			try {
				doc.pageContent = minifyTs(pageContent);
			} catch (error) {}
		}

		return doc;
	});

	return docs;
}
