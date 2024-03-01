import { inspect } from "node:util";

import { config as dotenvconfig } from "dotenv";
import { config } from "@/config/config";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ANSWER, store } from "@/docs/weaviate";
import { openai } from "@/ions/openai";

dotenvconfig();

inspect.defaultOptions.depth = null;

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
		message: `${question}`,
		language,
	};

	const docsResults = await store.searchNearText(doc, "content path", [question], {
		distance: config.get("vectorDatabase.docSearchDistance"),
		limit: config.get("vectorDatabase.maxDocs"),
	});
	console.log("✅  Done getting docs");

	const system = `You are a mentor for a wide range of topics with these skills:
- ability to explain complex things in easy language
- writing clear and concise guides
- writing simple code examples
- paraphrasing resourced content
- respond ONLY in valid markdown format
- always respond in requested LANGUAGE
- use the provided DOCS for your answer
- ask the user to rephrase if something is not clear
- hallucinations are prohibited
`;

	//
	// 	const system = `**PRECISELY act as this persona**:
	// {"profession":"Expert developer","job":["help the user","use the {{docs}}"],"skills":
	//["ability to explain complex things in easy language","writing clear and concise guides","writing simple code examples","writing unique and customized code examples","paraphrasing resourced content"]}

	// **STRICTLY follow these rules**:
	// [{"importance":"highest","rule":"ONLY respond using **valid** Markdown format"},{"importance":"highest","rule":"ONLY respond in form of the provided **TEMPLATE**"},{"priority":"high","rule":"ALWAYS respond in the requested {{language}}"},{"priority":"high","rules":["refer to {{docs}}"]},{"priority":"high","rules":["Are you unsure? Ask the user to rephrase","Only use imports that are in the {{docs}}"],"reasons":["hallucinations are prohibited","Responses must be valid"]},{"priority":"normal","rule":"ONLY complete responses"}]
	// `;

	const docs = extractResults(docsResults, doc);

	const response = await openai.chat.completions.create({
		messages: [
			{ role: "system", content: system },
			{ role: "system", content: `## DOCS\n\n${JSON.stringify(docs)}` },
			{ role: "user", content: `## LANGUAGE\n\n${task.language}` },
			{ role: "user", content: `## TASK\n\n${task.message}` },
		],
		model: "gpt-4-1106-preview",
		// eslint-disable-next-line camelcase
		max_tokens: 4048,
	});

	if (
		!response.choices ||
		response.choices.length === 0 ||
		!response.choices[0].message ||
		response.choices[0].message.content === null
	) {
		throw new Error("No valid choices available in the response");
	}

	const { content } = response.choices[0].message;

	console.log(content);
	console.log("---------------------------------------------------------");
	console.log(extractMarkdownContent(content));

	return {
		message: extractMarkdownContent(content),
		paths: extractPaths(docs),
	};
}

function extractMarkdownContent(input: string): string {
	const lines = input.split("\n");
	let isInsideMarkdownBlock = false;
	let extractedContent = "";
	let codeBlockDepth = 0;
	let markdownBlockFound = false;

	for (const line of lines) {
		// Check if the markdown block starts
		if (line.trim() === "```markdown") {
			isInsideMarkdownBlock = true;
			markdownBlockFound = true;
			continue;
		}

		// Check if the markdown block ends
		if (line.trim() === "```" && isInsideMarkdownBlock) {
			if (codeBlockDepth === 0) {
				break;
			} else {
				codeBlockDepth--;
			}
		}

		if (isInsideMarkdownBlock) {
			// Handle nested code blocks
			if (line.trim().startsWith("```")) {
				codeBlockDepth++;
			}

			extractedContent += line + "\n";
		}
	}

	// Return the original string if no markdown block was found
	return markdownBlockFound ? extractedContent.trim() : input;
}
