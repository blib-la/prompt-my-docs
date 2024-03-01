import {
	Alert,
	Box,
	Button,
	List,
	ListItem,
	ListItemDecorator,
	Sheet,
	Stack,
	Typography,
} from "@mui/joy";
import axios from "axios";
import { AxiosError } from "axios";

import { useAtom } from "jotai";

import {
	conversationAtom,
	docSelectStateAtom,
	errorAtom,
	languageAtom,
	loadingAtom,
	questionAtom,
	selectedDocAtom,
} from "@/docs/atoms";
import { ChatInput } from "@/docs/components/chat-input";
import { LanguageSelect } from "@/docs/components/language-select";
import { SimpleMarkdown } from "@/docs/components/markdown";
import ClearIcon from "@mui/icons-material/Clear";
import { useRef } from "react";
import DocSelect, { DOC_SELECT_NO_DATA } from "@/docs/components/doc-select";
import CollapsibleBox from "@/docs/components/collapsible-box";
import GettingStarted from "./getting-started";

export function Bot({
	onConversation,
}: {
	onConversation?(data: {
		answer: Record<string, any>;
		source: string[];
		question: string;
	}): void;
}) {
	const abortController = useRef<AbortController | null>(null);

	const [loading, setLoading] = useAtom(loadingAtom);
	const [error, setError] = useAtom(errorAtom);

	const [question, setQuestion] = useAtom(questionAtom);
	const [language] = useAtom(languageAtom);

	const [doc] = useAtom(selectedDocAtom);

	async function handleSubmit() {
		abortController.current = new AbortController();
		setLoading(true);
		setError("");

		try {
			const { data } = await axios.post(
				"/api/ama",
				{
					question,
					language,
					doc,
				},
				{ signal: abortController.current.signal }
			);

			if (onConversation) {
				onConversation({
					answer: data.message,
					source: data.paths,
					question,
				});

				setQuestion("");
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
		<Stack sx={{ gap: 1, position: "fixed", bottom: 0, width: "100%", zIndex: 1337 }}>
			{loading && (
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						width: "100%",
					}}
				>
					<Button
						startDecorator={<ClearIcon />}
						onClick={handleCancel}
						color="neutral"
						variant="soft"
					>
						Stop generating
					</Button>
				</Box>
			)}

			<Sheet variant="plain" sx={{ p: 1, justifyContent: "center", display: "flex" }}>
				<Stack
					sx={{
						gap: 1,
						width: "100%",
						maxWidth: { xs: "100%", md: 800, lg: 900 },
					}}
				>
					<Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
						<ChatInput
							loading={loading}
							onSubmit={handleSubmit}
							sx={{
								order: { xs: 2, md: 1 },
								gridColumn: { lg: "1 / span 2" },
								position: "relative",
								zIndex: 2,
								width: "100%",
							}}
						/>
					</Box>

					{error && <Alert color="danger">{error}</Alert>}

					<Stack
						direction="row"
						sx={{
							gap: 1,
						}}
					>
						<DocSelect />

						<LanguageSelect />

						<Box sx={{ flex: 3 }}></Box>
					</Stack>
				</Stack>
			</Sheet>
		</Stack>
	);
}

export default function ChatBot() {
	const [conversations, setConversations] = useAtom(conversationAtom);
	const [docSelectState] = useAtom(docSelectStateAtom);

	const noDocs = docSelectState === DOC_SELECT_NO_DATA;

	function handleConversation(data) {
		const newConversation = { ...data };
		setConversations(prevConversations => {
			return [...prevConversations, newConversation];
		});
	}

	return (
		<Box sx={{ height: "calc(100% - 6rem)", pb: 8 }}>
			{!noDocs && <Bot onConversation={handleConversation} />}

			{noDocs && (
				<Stack sx={{ alignItems: "center", height: "100%", justifyContent: "center" }}>
					<Box
						sx={{
							width: { xs: "100%", sm: "100%", md: 720, lg: 720 },
							px: { xs: 4 },
						}}
					>
						<GettingStarted />
					</Box>
				</Stack>
			)}

			{conversations.map((conversation, index) => (
				<Box key={index}>
					<Sheet
						variant="outlined"
						sx={{ py: 2, width: "100%", borderLeft: 0, borderRight: 0 }}
					>
						<Stack sx={{ alignItems: "center" }}>
							<Box
								sx={{
									width: { xs: "100%", sm: "100%", md: 720, lg: 720 },
									px: { xs: 4 },
								}}
							>
								<Typography fontWeight="lg">{conversation.question}</Typography>
							</Box>
						</Stack>
					</Sheet>

					<Stack sx={{ alignItems: "center", pb: 4 }}>
						<Box
							sx={{
								maxWidth: { xs: "100%", sm: "100%", md: 720, lg: 720 },
								p: { xs: 4 },
							}}
						>
							<SimpleMarkdown content={conversation.answer} />
							{conversation.source && conversation.source.length > 0 && (
								<CollapsibleBox title="Sources" sx={{ mt: 3 }}>
									<List size="sm" sx={{ width: "100%" }}>
										{conversation.source.map((item, index) => (
											<ListItem key={index}>
												<ListItemDecorator>📄</ListItemDecorator>
												{item}
											</ListItem>
										))}
									</List>
								</CollapsibleBox>
							)}
						</Box>
					</Stack>
				</Box>
			))}
		</Box>
	);
}
