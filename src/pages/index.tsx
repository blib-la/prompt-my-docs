/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import WarningIcon from "@mui/icons-material/Warning";
import { Alert, Box, List, ListItem, ListItemButton, Typography } from "@mui/joy";
import { useAtom } from "jotai";
// @ts-ignore
import Image from "next/image";

// @ts-ignore
import { questionAtom } from "@/docs/atoms";
import Bot from "@/docs/components/bot";
/* eslint-enable @typescript-eslint/ban-ts-comment */

const texts = [
	"How can I write a custom model adapter in Hyv?",
	"Show me how to get started with Hyv and GPT-4",
	"Give me details on creating custom personas for Hyv agents",
	"I want to create a debate between two Hyv agents with GPT-4",
	"How can I use custom GPT functions in my Hyv agent?",
	"Explain how to use DALL-E in Hyv",
];

export default function Page() {
	const [, setQuestion] = useAtom(questionAtom);
	return (
		<Box>
			<Typography level="h1" mb={2.5} sx={{ textAlign: "center" }}>
				Prompt my Docs
			</Typography>

			<Bot />
		</Box>
	);
}
