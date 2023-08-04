export function minifyTs(code: string): string {
	let result = "";
	let isInString = false;
	let currentStringChar = null;
	let isEscaping = false;

	// Remove spaces in import statements
	code = code.replace(/import\s+{\s+(.*?)\s+}\s+from\s+/g, "import {$1} from ");

	// Remove single line comments
	code = code.replace(/\/\/.*?\n/g, "");
	// Remove multi-line comments
	code = code.replace(/\/\*.*?\*\//gs, "");

	for (let i = 0; i < code.length; i++) {
		let char = code[i];

		if (!isEscaping && char === currentStringChar) {
			// End of string literal
			isInString = false;
			currentStringChar = null;
		} else if (!isInString && !isEscaping && (char === '"' || char === "'" || char === "`")) {
			// Start of string literal
			isInString = true;
			currentStringChar = char;
		}

		if (char === "\\") {
			isEscaping = !isEscaping;
		} else {
			isEscaping = false;
		}

		if (!isInString && (char === " " || char === "\n")) {
			// Replace multiple spaces or newlines with a single space
			if (result && result[result.length - 1] !== " ") {
				result += " ";
			}
		} else {
			result += char;
		}
	}

	// Trim leading and trailing spaces
	result = result.trim();

	return result;
}
