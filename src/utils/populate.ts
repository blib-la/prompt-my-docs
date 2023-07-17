import { TYPE_MARKDOWN, TYPE_TYPESCRIPT } from "../docs/weaviate.js";
import { loadDocuments } from "./load-documents.js";
import { splitDocuments } from "./split-documents.js";
import { fillVectorDatabase } from "./fill-vector-database.js";

export async function populate(force = false) {
	// If we want to refresh (force) the new dataset, we need to populate the vector store
	if (force) {
		const docs = await loadDocuments(TYPE_TYPESCRIPT);
		const chunkedDocs = await splitDocuments(TYPE_TYPESCRIPT, docs);
		await fillVectorDatabase(chunkedDocs);

		console.log(`${docs.length} typescript files`);

		const docsMarkdown = await loadDocuments(TYPE_MARKDOWN);
		const chunkedDocsMarkdown = await splitDocuments(TYPE_MARKDOWN, docsMarkdown);
		await fillVectorDatabase(chunkedDocsMarkdown);

		console.log(`${docsMarkdown.length} markdown files`);

		console.log("Vector database has been populated");
	}
}
