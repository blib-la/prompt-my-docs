import { DOCS, store } from "../docs/weaviate.js";
import { Document } from "langchain/document";

export async function fillVectorDatabase(docs: Document<Record<string, any>>[]) {
	docs.map(async document => {
		const {
			pageContent,
			metadata: { source },
		} = document;

		return store.set({ content: pageContent, path: source }, DOCS);
	});
}
