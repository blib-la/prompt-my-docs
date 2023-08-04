import convict, { Config, Schema } from "convict";
import fs from "node:fs";
import path from "node:path";

const PATH_USER_CONFIG = path.join(process.cwd(), "config.json");

interface GptConfig {
	temperature: number;
	maxNewTokens: number;
}
interface VectorDatabaseConfig {
	maxDocs: number;
	docSearchDistance: number;
	answerSearchDistance: number;
}

interface FileType {
	enabled: boolean;
	extensions: string[];
	ignorePaths: string[];
	chunkSize: number;
	chunkOverlap: number;
}

interface MyConfig {
	gpt: GptConfig;
	vectorDatabase: VectorDatabaseConfig;

	fileTypes: {
		[key: string]: FileType;
	};
}

const schema: Schema<MyConfig> = {
	gpt: {
		temperature: {
			default: 0.2,
			format: "Number",
		},
		maxNewTokens: {
			default: 3048,
			format: "nat",
		},
	},
	vectorDatabase: {
		maxDocs: {
			default: 6,
			format: "nat",
		},
		docSearchDistance: {
			default: 0.24,
			format: "Number",
		},
		answerSearchDistance: {
			default: 0.24,
			format: "Number",
		},
	},
	fileTypes: {
		markdown: {
			enabled: {
				doc: "Whether the markdown type is enabled",
				format: Boolean,
				default: true,
				env: "DOC_ENABLED",
			},
			extensions: {
				doc: "File extensions for the markdown type",
				format: Array,
				default: [".md", ".mdx"],
			},
			ignorePaths: {
				doc: "Paths to ignore for the markdown type",
				format: Array,
				default: ["node_modules", "dist", ".github"],
			},
			chunkSize: {
				doc: "Chunk size for the markdown type",
				format: "nat",
				default: 1000,
			},
			chunkOverlap: {
				doc: "Chunk overlap for the markdown type",
				format: "nat",
				default: 0,
			},
		},
		js: {
			enabled: {
				doc: "Whether the js type is enabled",
				format: Boolean,
				default: true,
				env: "JS_ENABLED",
			},
			extensions: {
				doc: "File extensions for the js type",
				format: Array,
				default: [".js"],
			},
			ignorePaths: {
				doc: "Paths to ignore for the js type",
				format: Array,
				default: ["node_modules", "dist", ".github"],
			},
			chunkSize: {
				doc: "Chunk size for the js type",
				format: "nat",
				default: 1000,
			},
			chunkOverlap: {
				doc: "Chunk overlap for the js type",
				format: "nat",
				default: 0,
			},
		},
		ts: {
			enabled: {
				doc: "Whether the ts type is enabled",
				format: Boolean,
				default: true,
				env: "TS_ENABLED",
			},
			extensions: {
				doc: "File extensions for the ts type",
				format: Array,
				default: [".ts"],
			},
			ignorePaths: {
				doc: "Paths to ignore for the ts type",
				format: Array,
				default: ["node_modules", "dist", ".github", ".d.ts"],
			},
			chunkSize: {
				doc: "Chunk size for the ts type",
				format: "nat",
				default: 1000,
			},
			chunkOverlap: {
				doc: "Chunk overlap for the ts type",
				format: "nat",
				default: 0,
			},
		},
	},
};

export const config: Config<MyConfig> = convict(schema);

// Check if user configuration exists and load it
if (fs.existsSync(PATH_USER_CONFIG)) {
	try {
		config.loadFile(PATH_USER_CONFIG);
	} catch (error) {
		console.error("There was a problem reading the config file, are you sure it's valid JSON?");
		throw error;
	}
}

// Perform validation
config.validate({ allowed: "strict" });
