import { store } from "../docs/weaviate.js";

export async function createClass(className: string, force: boolean | undefined) {
	await store.createClass(
		{
			class: className,
			vectorizer: "text2vec-openai",
			moduleConfig: {
				"text2vec-openai": {
					model: "ada",
					modelVersion: "002",
					type: "text",
				},
			},
		},
		force
	);
}
