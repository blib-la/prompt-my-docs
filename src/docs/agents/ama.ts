import { inspect } from "node:util";

import { Agent } from "@hyv/core";
import { GPTModelAdapter } from "@hyv/openai";
import { createInstructionPersona } from "@hyv/openai";
import { config } from "dotenv";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ANSWER, DOCS, store } from "@/docs/weaviate";

config();

inspect.defaultOptions.depth = null;

const agent = new Agent(
	new GPTModelAdapter({
		model: "gpt-4",
		historySize: 4,
		temperature: 1,
		maxTokens: 4096,
		systemInstruction: createInstructionPersona(
			{
				profession: "Expert developer",
				job: ["help and mentor users", "answer the user's questions", "use the {{docs}}"],
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
						"never reference or link to {{previousAnswers}}, just evaluate and use the information",
					],
				},
				{
					priority: "high",
					rules: [
						"You have no references? ask the user to rephrase",
						"Are you unsure? Ask the user to rephrase",
						"only use imports that are in the {{docs}}",
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
		// We add the store here so that all answers are vectorized
		store,
		verbosity: 1337,
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

export async function ama({ question, language }: { question: string; language: string }) {
	const task = {
		message: `Question: ${question}`,
		language,
	};

	const docsResults = await store.searchNearText(DOCS, "content path", [question], {
		distance: 0.24,
		limit: 8,
	});
	console.log("✅  Done getting docs");

	let answerResults = { data: { Get: { [ANSWER]: [] } } };
	try {
		answerResults = await store.searchNearText(ANSWER, "answer", [question], {
			distance: 0.24,
			limit: 1,
		});
		console.log("✅  Done getting answers");
	} catch (error) {
		console.log("⚠️ No answers set");
	}

	agent.after = async message => ({
		...message,
		// We want to add the original question to allow finding the solution if the same or
		// similar question is asked.
		originalQuestion: task.message,
	});

	return agent.assign(
		{
			...task,
			previousAnswers: extractResults(answerResults, ANSWER),
			docs: extractResults(docsResults, DOCS),
		},
		ANSWER
	);
}
