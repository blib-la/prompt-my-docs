import { Box, Typography } from "@mui/joy";
import { useAtom } from "jotai";

import Bot from "@/docs/components/bot";

export default function Page() {
	return (
		<Box>
			<Typography level="h1" mb={2.5} sx={{ textAlign: "center" }}>
				Prompt my Docs
			</Typography>

			<Bot />
		</Box>
	);
}
