import { Box, Typography, Sheet } from "@mui/joy";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import React, { useState, ReactNode } from "react";
import { SxProps, Theme } from "@mui/material/styles";

interface Props {
	title: string;
	children: ReactNode;
	sx?: SxProps<Theme>;
}

export default function CollapsibleBox({ title, children, sx = [] }: Props) {
	const [isVisible, setIsVisible] = useState(false);

	const toggleVisibility = () => {
		setIsVisible(!isVisible);
	};

	return (
		<Sheet
			variant="outlined"
			sx={[...(Array.isArray(sx) ? sx : [sx]), { background: "transparent", p: 1 }]}
		>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				onClick={toggleVisibility}
				sx={{ cursor: "pointer" }}
			>
				<Typography level="h4">{title}</Typography>
				<div>{isVisible ? <KeyboardArrowUp /> : <KeyboardArrowDown />}</div>
			</Box>
			{isVisible && <div>{children}</div>}
		</Sheet>
	);
}
