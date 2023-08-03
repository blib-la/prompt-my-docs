import { loadDocuments } from "./load-documents.js";
import { splitDocuments } from "./split-documents.js";
import { fillVectorDatabase } from "./fill-vector-database.js";
import { config } from "../config/config.js";

export async function populate(force = false, className: string, directory: string) {
	// If we want to refresh (force) the new dataset, we need to populate the vector store
	if (force) {
		const fileTypes = config.get("fileTypes");

		for (const fileType in fileTypes) {
			if (fileTypes[fileType].enabled) {
				try {
					const docs = await loadDocuments(fileType, directory);
					const chunkedDocs = await splitDocuments(fileType, docs);
					await fillVectorDatabase(chunkedDocs, className);

					console.log(`${directory}: ${docs.length} ${fileType} file(s)`);
				} catch (error) {
					console.error(`There was an error when processing ${fileType}:`, error);
				}
			}
		}
	}
}
