import {
	Alert,
	Box,
	Button,
	List,
	ListItem,
	ListItemContent,
	ListItemDecorator,
	Sheet,
	Stack,
	Typography,
} from "@mui/joy";
import axios from "axios";
import { AxiosError } from "axios";

import { useAtom } from "jotai";

import {
	answerAtom,
	errorAtom,
	languageAtom,
	loadingAtom,
	questionAtom,
	sourceAtom,
} from "@/docs/atoms";
import { ChatInput } from "@/docs/components/chat-input";
import { LanguageSelect } from "@/docs/components/language-select";
import { SimpleMarkdown } from "@/docs/components/markdown";
import ClearIcon from "@mui/icons-material/Clear";
import { useRef } from "react";

export function Bot({
	onAnswer,
	onQuestion,
	onSource,
}: {
	onQuestion?(): void;
	onAnswer?(data: { id: string; message: Record<string, any> }): void;
	onSource?(data: { paths: string[] }): void;
}) {
	const abortController = useRef<AbortController | null>(null);

	const [loading, setLoading] = useAtom(loadingAtom);
	const [error, setError] = useAtom(errorAtom);

	const [question] = useAtom(questionAtom);
	const [language] = useAtom(languageAtom);

	async function handleSubmit() {
		abortController.current = new AbortController();
		setLoading(true);
		setError("");

		if (onQuestion) {
			onQuestion();
		}

		try {
			const { data } = await axios.post(
				"/api/ama",
				{
					question,
					language,
				},
				{ signal: abortController.current.signal }
			);

			if (onAnswer) {
				onAnswer(data.message);
			}

			if (onSource) {
				onSource(data.paths);
			}
		} catch (error) {
			const err = error as AxiosError;
			if (err.message !== "canceled") {
				console.error(err);
				setError(
					err.response?.data?.message ||
						"There was a problem interacting with the AI, please try again!"
				);
			}
		} finally {
			setLoading(false);
		}
	}

	async function handleCancel() {
		if (abortController.current) {
			abortController.current.abort();
		}
		setLoading(false);
	}

	return (
		<Box>
			<Box sx={{ maxWidth: { md: 800, lg: 800 }, mx: "auto" }}>
				<Stack sx={{ gap: 1 }}>
					<Box component="form" onSubmit={handleSubmit}>
						<ChatInput loading={loading} onSubmit={handleSubmit} />
						<Box mt={1} sx={{ display: "flex", gap: 2, alignItems: "center" }}>
							<LanguageSelect />
						</Box>
					</Box>
					{error && <Alert color="danger">{error}</Alert>}

					{loading && (
						<Box
							sx={{
								width: "100%",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Button
								startDecorator={<ClearIcon />}
								onClick={handleCancel}
								color="neutral"
								variant="outlined"
							>
								Stop generating
							</Button>
						</Box>
					)}
				</Stack>
			</Box>
		</Box>
	);
}

export default function ChatBot() {
	const [answer, setAnswer] = useAtom(answerAtom);
	const [source, setSource] = useAtom(sourceAtom);
	const [loading] = useAtom(loadingAtom);

	function handleAnswer(data) {
		setAnswer(data.message.answer);
	}

	function handleQuestion() {
		setAnswer("");
		setSource([]);
	}

	function handleSource(data) {
		setSource(data);
	}

	return (
		<Box sx={{ height: "calc(100% - 6rem)" }}>
			<Sheet variant="plain" sx={{ height: "100%", p: 2 }}>
				<Bot onAnswer={handleAnswer} onQuestion={handleQuestion} onSource={handleSource} />
			</Sheet>

			<Stack sx={{ alignItems: "center" }}>
				<Box sx={{ maxWidth: { md: 720, lg: 720 } }}>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							flex: 1,
							minHeight: "max-content",
							p: 2,
						}}
					>
						{!loading && (
							<Box>
								<SimpleMarkdown content={answer} />
							</Box>
						)}
					</Box>

					{source.length > 0 && (
						<Sheet sx={{ p: 2 }}>
							<Typography level="h4">Sources</Typography>
							<List size="sm" sx={{ width: "100%" }}>
								{source.map((item, index) => (
									<ListItem key={index}>
										<ListItemDecorator>📄</ListItemDecorator>
										{item}
									</ListItem>
								))}
							</List>
						</Sheet>
					)}
				</Box>
			</Stack>
		</Box>
	);
}
