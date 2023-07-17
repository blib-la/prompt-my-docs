import path from "node:path";
import process from "node:process";

import { WeaviateAdapter } from "@hyv/store";
import { config } from "dotenv";
import { ApiKey } from "weaviate-ts-client";

config();

export const store = new WeaviateAdapter({
	scheme: "https",
	host: process.env.WEAVIATE_HOST || "",
	apiKey: new ApiKey(process.env.WEAVIATE_API_KEY || ""),
	headers: { "X-OpenAI-Api-Key": process.env.OPENAI_API_KEY },
});

export const ANSWER = "Answer";
export const DOCS = "Docs";
export const TYPE_TYPESCRIPT = "typescript";
export const TYPE_MARKDOWN = "markdown";
export const PATH_DOCS = path.join(process.cwd(), "docs");
export const IGNORE_PATHS = ["node_modules", "dist", ".github", ".d.ts"];
