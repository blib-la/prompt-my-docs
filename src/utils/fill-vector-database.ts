import { store } from "../docs/weaviate.js";
import { Document } from "langchain/document";

export function fillVectorDatabase(docs: Document<Record<string, any>>[], className: string) {
	let batcher = store.client.batch.objectsBatcher();

	docs.map(document => {
		const {
			pageContent,
			metadata: { source },
		} = document;

		batcher = batcher.withObject({
			class: className,
			properties: { content: pageContent, path: source },
		});
	});

	return batcher.do();
}
