import { useEffect, useState } from "react";
import axios from "axios";
import { Option, Select } from "@mui/joy";
import { docSelectStateAtom, selectedDocAtom } from "@/docs/atoms";
import { useAtom } from "jotai";
import { SxProps, Theme } from "@mui/material/styles";

export const DOC_SELECT_NO_DATA = "NO_DATA";
export const DOC_SELECT_DATA_LOADED = "DATA_LOADED";

interface Doc {
	name: string;
	className: string;
}

type DocSelectProps = {
	sx?: SxProps<Theme>;
};

export default function DocSelect({ sx = [] }: DocSelectProps) {
	const [docs, setDocs] = useState<Doc[]>([]);
	const [selectedDoc, setSelectedDoc] = useAtom(selectedDocAtom);
	const [state, setState] = useAtom(docSelectStateAtom);

	useEffect(() => {
		const fetchData = async () => {
			const response = await axios.get("/api/docs");

			if (response.data.length === 0) {
				console.error("No docs returned from API.");
				setState(DOC_SELECT_NO_DATA);
			} else {
				setState(DOC_SELECT_DATA_LOADED);
				setDocs(response.data);
				setSelectedDoc(response.data[0].className);
			}
		};

		fetchData();
	}, []);

	const handleChange = (event: React.SyntheticEvent | null, newValue: string | null) => {
		setSelectedDoc(newValue);
	};

	return (
		<>
			<Select
				sx={[...(Array.isArray(sx) ? sx : [sx])]}
				defaultValue={selectedDoc}
				value={selectedDoc}
				onChange={handleChange}
				slotProps={{ listbox: { sx: { zIndex: 4000 } } }}
			>
				{docs.map(doc => (
					<Option key={doc.className} value={doc.className}>
						{doc.name}
					</Option>
				))}
			</Select>
		</>
	);
}
