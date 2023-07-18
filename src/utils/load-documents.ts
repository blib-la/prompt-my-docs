import { Document } from "langchain/document";
import { DirectoryLoaderPro } from "../docs/loaders/directory-loader-pro.js";
import { IGNORE_PATHS, PATH_DOCS, TYPE_MARKDOWN, TYPE_TYPESCRIPT } from "../docs/weaviate.js";
import { UnknownHandling } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";

export async function loadDocuments(type: string): Promise<Document<Record<string, any>>[]> {
	let loader = null;

	if (type === TYPE_TYPESCRIPT) {
		loader = new DirectoryLoaderPro(
			PATH_DOCS,
			{
				".ts": (path: string | Blob) => new TextLoader(path),
			},
			IGNORE_PATHS,
			true,
			UnknownHandling.Ignore
		);
	}

	if (type === TYPE_MARKDOWN) {
		loader = new DirectoryLoaderPro(
			PATH_DOCS,
			{
				".md": (path: string | Blob) => new TextLoader(path),
				".mdx": (path: string | Blob) => new TextLoader(path),
			},
			IGNORE_PATHS,
			true,
			UnknownHandling.Ignore
		);
	}

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
