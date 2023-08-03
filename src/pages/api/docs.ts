import { PATH_DOCS } from "@/docs/weaviate";
import { getDirectories } from "@/utils/get-directories";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === "GET") {
		const directories = await getDirectories(PATH_DOCS);

		res.status(200).json(directories);
	} else {
		res.status(405).end(); // Method Not Allowed
	}
};

export default handler;
