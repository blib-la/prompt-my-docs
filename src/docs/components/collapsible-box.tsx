import { Box, Typography } from "@mui/joy";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import React, { useState, ReactNode } from "react";

interface Props {
	title: string;
	children: ReactNode;
}

export default function CollapsibleBox({ title, children }: Props) {
	const [isVisible, setIsVisible] = useState(false);

	const toggleVisibility = () => {
		setIsVisible(!isVisible);
	};

	return (
		<Box>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				onClick={toggleVisibility}
				sx={{ cursor: "pointer" }}
			>
				<Typography level="h3">{title}</Typography>
				<div>{isVisible ? <KeyboardArrowUp /> : <KeyboardArrowDown />}</div>
			</Box>
			{isVisible && <div>{children}</div>}
		</Box>
	);
}
