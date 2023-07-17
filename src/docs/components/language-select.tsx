import { Avatar, ListItemDecorator, Option, Select, SelectOption } from "@mui/joy";
import { useAtom } from "jotai";
import type { SyntheticEvent } from "react";

import { languageAtom } from "@/docs/atoms";
import FlagCn from "@/docs/components/flags/cn";
import FlagCz from "@/docs/components/flags/cz";
import FlagDe from "@/docs/components/flags/de";
import FlagEs from "@/docs/components/flags/es";
import FlagFr from "@/docs/components/flags/fr";
import FlagIt from "@/docs/components/flags/it";
import FlagJp from "@/docs/components/flags/jp";
import FlagNl from "@/docs/components/flags/nl";
import FlagPirate from "@/docs/components/flags/pirate";
import FlagPl from "@/docs/components/flags/pl";
import FlagPt from "@/docs/components/flags/pt";
import FlagUs from "@/docs/components/flags/us";

const options = [
	{ id: "en-US", value: "english", flag: <FlagUs />, label: "English" },
	{ id: "de-DE", value: "german", flag: <FlagDe />, label: "Deutsch" },
	{ id: "es-ES", value: "spanish", flag: <FlagEs />, label: "Español" },
	{ id: "pt-PT", value: "portugese", flag: <FlagPt />, label: "Português" },
	{ id: "it-IT", value: "italian", flag: <FlagIt />, label: "Italiano" },
	{ id: "fr-FR", value: "french", flag: <FlagFr />, label: "Français" },
	{ id: "nl-NL", value: "dutch", flag: <FlagNl />, label: "Nederlands" },
	{ id: "pl-PL", value: "polish", flag: <FlagPl />, label: "Polski" },
	{ id: "cs-CZ", value: "czech", flag: <FlagCz />, label: "Čeština" },
	{ id: "zh-CN", value: "chinese", flag: <FlagCn />, label: "中文" },
	{ id: "ja-JP", value: "japanese", flag: <FlagJp />, label: "日本語" },
	{ id: "en-pirate", value: "pirate", flag: <FlagPirate />, label: "Pirate" },
];

export function LanguageSelect() {
	const [language, setLanguage] = useAtom(languageAtom);
	function renderValue(option: SelectOption<string> | null) {
		if (!option) {
			return null;
		}

		return (
			<>
				<ListItemDecorator sx={{ mr: 1 }}>
					<Avatar variant="outlined" size="sm">
						{options.find(o => o.value === option.value)?.flag}
					</Avatar>
				</ListItemDecorator>
				{option.label}
			</>
		);
	}

	return (
		<Select
			name="language"
			aria-label="Select a language"
			variant="soft"
			value={language}
			sx={{ flex: 1 }}
			renderValue={renderValue}
			onChange={(event: SyntheticEvent, value) => {
				setLanguage(value);
			}}
		>
			{options.map(option => (
				<Option key={option.id} value={option.value}>
					<ListItemDecorator>
						<Avatar variant="outlined" size="sm">
							{option.flag}
						</Avatar>
					</ListItemDecorator>
					{option.label}
				</Option>
			))}
		</Select>
	);
}
