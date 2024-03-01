import type { NextApiRequest, NextApiResponse } from "next";
import { AxiosError } from "axios";

import { ama } from "@/docs/agents/ama";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
	switch (request.method) {
		case "POST":
			try {
				const { question, language, doc } = request.body;
				const { message, paths } = await ama({ question, language, doc });

				response.status(200).json({ message, paths });
			} catch (error) {
				const err = error as AxiosError;
				let errorMessage = "";

				// If we have an error message from the data.error.message, use that
				if (err.response?.data?.error?.message && err.response.data.error.message !== "") {
					errorMessage = err.response.data.error.message;
				}
				// If there's no message but there's a code, use the code
				else if (err.response?.data?.error?.code) {
					errorMessage = err.response.data.error.code;
				}
				// If there's neither a message nor a code, use the error's own message
				else if (err.message) {
					errorMessage = err.message;
				} else {
					errorMessage = "UNKNOWN_ERROR";
				}

				if (errorMessage.includes("JSON5: invalid character")) {
					errorMessage =
						"There was a problem when interacting with the AI, please try again!";
				}

				console.log(errorMessage);

				response.status(500).json({ message: errorMessage });
			}

			break;

		default:
			response.status(404).send("Not Found");
			break;
	}
}
