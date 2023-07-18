import SendIcon from "@mui/icons-material/Send";
import { Box, CircularProgress, IconButton, Textarea } from "@mui/joy";
import { useAtom } from "jotai";
import { useState } from "react";
import { questionAtom } from "@/docs/atoms";

export interface ChatInputProps {
	loading: boolean;

	onSubmit(): void;
}

export function ChatInput({ loading, onSubmit }: ChatInputProps) {
	const [question, setQuestion] = useAtom(questionAtom);
	const [focus, setFocus] = useState(false);
	return (
		<Box
			sx={{
				position: "relative",
				zIndex: 2,
				height: 40,
			}}
		>
			<Textarea
				name="question"
				placeholder="Your question goes here 🤓"
				aria-label="Write your question and press Enter to sumbit"
				minRows={1}
				maxRows={focus ? 20 : 1}
				variant="soft"
				value={question}
				sx={{
					width: "100%",
					"&:focus-within": { boxShadow: "md" },
					".MuiTextarea-endDecorator": {
						position: "absolute",
						bottom: 4,
						right: -4,
					},
					".MuiTextarea-startDecorator": {
						position: "absolute",
						top: 4,
						left: 8,
					},
					".MuiTextarea-textarea": {
						pr: 5,
					},
				}}
				endDecorator={
					<IconButton
						disabled={loading}
						variant="solid"
						aria-label="Submit"
						tabIndex={-1}
						onClick={() => {
							onSubmit();
						}}
					>
						{loading ? <CircularProgress size="sm" /> : <SendIcon />}
					</IconButton>
				}
				onFocus={() => {
					setFocus(true);
				}}
				onBlur={() => {
					setFocus(false);
				}}
				onKeyDown={event => {
					if (event.key === "Enter" && !event.shiftKey) {
						event.preventDefault();
						if (!loading) {
							onSubmit();
						}
					}
				}}
				onChange={event => {
					setQuestion(event.target.value);
				}}
			/>
		</Box>
	);
}
