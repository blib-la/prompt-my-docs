import { ANSWER, PATH_DOCS } from "../docs/weaviate.js";
import { createClass } from "./create-class.js";
import { getDirectories } from "./get-directories.js";
import { populate } from "./populate.js";

const refresh = true;

try {
	// The class needed to store the AI answers
	await createClass(ANSWER, refresh);

	console.log("Read /docs and vectorize it's data");
	console.log("---");

	// The classes for all folders inside of docs
	await getDirectories(PATH_DOCS).then(async directories => {
		for (const directory of directories) {
			await createClass(directory.className, refresh);
			await populate(refresh, directory.className, directory.name);
		}
	});

	console.log("---");
	console.log("Vector database has been populated");
} catch (error) {
	console.log("STORE SETUP FAILED");
	console.log(error);
}
