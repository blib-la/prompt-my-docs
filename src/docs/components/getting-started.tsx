import { Box, Link, Typography } from "@mui/joy";

export default function GettingStarted() {
	return (
		<Box>
			<Typography level="h1" sx={{ mb: 3 }}>
				Prompt my Docs
			</Typography>
			<Typography level="h2" sx={{ mb: 1 }}>
				Getting started
			</Typography>
			<Typography level="body1">
				It seems that the setup is not done yet, as there are no <b>docs</b> that I can show
				you. Please follow these steps:
			</Typography>
			<ul>
				<li>
					<Link href="https://github.com/failfa-st/prompt-my-docs#setup" target="_blank">
						Setup
					</Link>{" "}
					(make sure to have an OpenAI API key + Weaviate API Key & Host)
				</li>
				<li>
					<Link
						href="https://github.com/failfa-st/prompt-my-docs#bring-your-docs"
						target="_blank"
					>
						Bring your docs
					</Link>{" "}
					(this makes sure that the files that you want to ask questions about are in the{" "}
					<i>/docs</i> folder and that the Vector DB is updated)
				</li>
				<li>Reload this page and start asking questions</li>
			</ul>
		</Box>
	);
}
