import { store } from "../docs/weaviate.js";
import { Document } from "langchain/document";

export async function fillVectorDatabase(docs: Document<Record<string, any>>[], className: string) {
	let batcher = store.client.batch.objectsBatcher();
	let counter = 0;

	for (const document of docs) {
		const {
			pageContent,
			metadata: { source },
		} = document;

		batcher = batcher.withObject({
			class: className,
			properties: { content: pageContent, path: source },
		});

		counter++;

		if (counter % 100 === 0) {
			await batcher.do();
			batcher = store.client.batch.objectsBatcher();
		}
	}

	if (counter % 100 !== 0) {
		await batcher.do();
	}
}
