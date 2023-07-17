import { ANSWER, DOCS } from "../docs/weaviate.js";
import { createClass } from "./create-class.js";
import { populate } from "./populate.js";

const refresh = true;

try {
	await createClass(ANSWER, refresh);
	await createClass(DOCS, refresh);
	await populate(refresh);
} catch (error) {
	console.log("STORE SETUP FAILED");
	console.log(error);
}
