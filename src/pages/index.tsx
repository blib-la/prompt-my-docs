import { Box, Typography } from "@mui/joy";

import ChatBot from "@/docs/components/chat-bot";

export default function Page() {
	return (
		<Box>
			<Typography level="h1" my={2.5} sx={{ textAlign: "center" }}>
				Prompt my Docs
			</Typography>

			<ChatBot />
		</Box>
	);
}
