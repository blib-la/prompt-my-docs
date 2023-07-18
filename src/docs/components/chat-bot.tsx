import { Box, Card, CardContent, Checkbox, CircularProgress, Container, Modal } from "@mui/joy";
import axios from "axios";
import { useAtom } from "jotai";

import { answerAtom, languageAtom, loadingAtom, questionAtom } from "@/docs/atoms";
import { ChatInput } from "@/docs/components/chat-input";
import { LanguageSelect } from "@/docs/components/language-select";
import { SimpleMarkdown } from "@/docs/components/markdown";

export function Bot({
	onAnswer,
	onQuestion,
}: {
	onQuestion?(): void;
	onAnswer?(data: { id: string; message: Record<string, any> }): void;
}) {
	const [loading, setLoading] = useAtom(loadingAtom);

	const [question] = useAtom(questionAtom);
	const [language] = useAtom(languageAtom);

	async function handleSubmit() {
		setLoading(true);

		if (onQuestion) {
			onQuestion();
		}

		try {
			const { data } = await axios.post("/api/ama", {
				question,
				language,
			});

			if (onAnswer) {
				onAnswer(data);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Box>
			<Box sx={{ maxWidth: { md: 600, lg: 600 }, mx: "auto" }}>
				<Box component="form" sx={{ p: 1 }} onSubmit={handleSubmit}>
					<ChatInput loading={loading} onSubmit={handleSubmit} />
					<Box mt={1} sx={{ display: "flex", gap: 2, alignItems: "center" }}>
						<LanguageSelect />
					</Box>
				</Box>
			</Box>
		</Box>
	);
}

export default function ChatBot() {
	const [answer, setAnswer] = useAtom(answerAtom);
	const [loading] = useAtom(loadingAtom);

	function handleAnswer(data) {
		setAnswer(data.message.answer);
	}

	function handleQuestion() {
		setAnswer("");
	}

	return (
		<Box>
			<Container sx={{ height: "calc(100% - 6rem)" }}>
				<Card variant="plain" sx={{ boxShadow: "lg", height: "100%" }}>
					<Bot onAnswer={handleAnswer} onQuestion={handleQuestion} />
					<Box
						sx={{
							display: "flex",
							flex: 1,
							overflow: "auto",
							overscrollBehavior: "contain",
						}}
					>
						<CardContent
							sx={{
								display: "flex",
								flexDirection: "column",
								flex: 1,
								minHeight: "max-content",
							}}
						>
							{loading ? (
								<Box
									sx={{
										width: "100%",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<CircularProgress size="lg" />
								</Box>
							) : (
								<SimpleMarkdown content={answer} />
							)}
						</CardContent>
					</Box>
				</Card>
			</Container>
		</Box>
	);
}
