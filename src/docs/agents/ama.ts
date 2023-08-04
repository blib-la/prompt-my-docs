import { inspect } from "node:util";

import { Agent } from "@hyv/core";
import { GPTModelAdapter } from "@hyv/openai";
import { createInstructionPersona } from "@hyv/openai";
import { config as dotenvconfig } from "dotenv";
import { config } from "@/config/config";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ANSWER, store } from "@/docs/weaviate";

dotenvconfig();

inspect.defaultOptions.depth = null;

const agent = new Agent(
	new GPTModelAdapter({
		model: "gpt-4",
		historySize: 4,
		temperature: config.get("gpt.temperature"),
		maxTokens: config.get("gpt.maxNewTokens"),
		systemInstruction: createInstructionPersona(
			{
				profession: "Expert developer",
				job: ["help the user", "use the {{docs}}"],
				skills: [
					"ability to explain complex things in easy language",
					"writing clear and concise guides",
					"writing simple code examples",
					"writing unique and customized code examples",
					"paraphrasing resourced content",
				],
			},
			[
				{ priority: "high", rule: "ALWAYS respond in the requested {{language}}" },
				{
					priority: "high",
					rules: [
						"refer to {{docs}}",
						// "never reference or link to {{previousAnswers}}, just evaluate and use the information",
					],
				},
				{
					priority: "high",
					rules: [
						// "You have no references? ask the user to rephrase",
						"Are you unsure? Ask the user to rephrase",
						"Only use imports that are in the {{docs}}",
					],
					reasons: ["hallucinations are prohibited", "Responses must be valid"],
				},
				{ priority: "normal", rule: "ONLY complete responses" },
			],
			{
				thoughts: "your thoughts about the task",
				assurance: "make sure to use this template",
				answer: "a clear and reasonable answer (structured and sectioned (with headlines) Markdown with pretty-print code)",
			},
			{ format: "json" }
		),
	}),
	{
		store,
		verbosity: 0,
	}
);

interface ResultsObject {
	data: {
		Get: Record<string, any[]>;
	};
}

function extractResults(resultsObject: ResultsObject, key: string) {
	return resultsObject.data.Get[key];
}

function extractPaths(docs: any[]) {
	return docs
		.map(doc => doc.path)
		.filter((value, index, self) => {
			return self.indexOf(value) === index;
		});
}

export async function ama({
	question,
	language,
	doc,
}: {
	question: string;
	language: string;
	doc: string;
}) {
	const task = {
		message: `User prompt: ${question}`,
		language,
	};

	const docsResults = await store.searchNearText(doc, "content path", [question], {
		distance: config.get("vectorDatabase.docSearchDistance"),
		limit: config.get("vectorDatabase.maxDocs"),
	});
	console.log("✅  Done getting docs");

	// let answerResults = { data: { Get: { [ANSWER]: [] } } };
	// try {
	// 	answerResults = await store.searchNearText(ANSWER, "answer", [question], {
	// 		distance: config.get("vectorDatabase.answerSearchDistance"),
	// 		limit: 1,
	// 	});
	// 	console.log("✅  Done getting answers");
	// } catch (error) {
	// 	console.log("⚠️ No answers set");
	// }

	// agent.after = async message => ({
	// 	...message,
	// 	// We want to add the original question to allow finding the solution if the same or
	// 	// similar question is asked.
	// 	// This is changing the answer and afterwards it will be saved into the store
	// 	originalQuestion: task.message,
	// });

	const docs = extractResults(docsResults, doc);

	return {
		message: agent.assign(
			{
				...task,
				// previousAnswers: extractResults(answerResults, ANSWER),
				docs,
			},
			ANSWER
		),
		paths: extractPaths(docs),
	};
}
