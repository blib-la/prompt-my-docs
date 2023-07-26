import { Document } from "langchain/document";
import { DirectoryLoaderPro } from "../docs/loaders/directory-loader-pro.js";
import { IGNORE_PATHS, PATH_DOCS, TYPE_MARKDOWN, TYPE_TYPESCRIPT } from "../docs/weaviate.js";
import { UnknownHandling } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { config } from "../config/config.js";

export async function loadDocuments(type: string): Promise<Document<Record<string, any>>[]> {
	let loader = null;

	const loaders: { [extension: string]: (path: string | Blob) => TextLoader } = {};
	config.get(`fileTypes.${type}.extensions`).forEach((extension: string) => {
		loaders[extension] = (path: string | Blob) => new TextLoader(path);
	});

	loader = new DirectoryLoaderPro(
		PATH_DOCS,
		loaders,
		config.get(`fileTypes.${type}.ignorePaths`),
		true,
		UnknownHandling.Ignore
	);

	if (loader === null) {
		throw new Error("No loader specified");
	}

	const docs = await loader.load();

	// Fix the source for each document to point to relative path instead of full local path
	docs.map((doc: { metadata: { source: any } }) => {
		const { source } = doc.metadata;

		const localPath = source.split("/docs/")[1].replaceAll("\\", "/");
		const newSource = `docs/${localPath}`;

		doc.metadata.source = newSource;

		return doc;
	});

	return docs;
}
