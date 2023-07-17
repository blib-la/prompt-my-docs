import type { NextApiRequest, NextApiResponse } from "next";

import { ama } from "@/docs/agents/ama";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
	switch (request.method) {
		case "POST":
			try {
				const { question, language } = request.body;
				const hyvResponse = await ama({ question, language });

				response.status(200).json(hyvResponse);
			} catch (error) {
				console.log(error);
				response.status(400).send("Bad Request");
			}

			break;

		default:
			response.status(404).send("Not Found");
			break;
	}
}
