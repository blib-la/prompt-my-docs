export default function FlagUs() {
	return (
		<svg viewBox="0 0 512 512">
			<path fill="#bd3d44" d="M0 0h512v512H0" />
			<path
				stroke="#fff"
				strokeWidth="40"
				d="M0 58h512M0 137h512M0 216h512M0 295h512M0 374h512M0 453h512"
			/>
			<path fill="#192f5d" d="M0 0h390v275H0z" />
			<marker id="a" markerHeight="30" markerWidth="30">
				<path fill="#fff" d="m15 0 9.3 28.6L0 11h30L5.7 28.6" />
			</marker>
			<path
				fill="none"
				markerMid="url(#a)"
				d="m0 0 18 11h65 65 65 65 66L51 39h65 65 65 65L18 66h65 65 65 65 66L51 94h65 65 65 65L18 121h65 65 65 65 66L51 149h65 65 65 65L18 177h65 65 65 65 66L51 205h65 65 65 65L18 232h65 65 65 65 66L0 0"
			/>
		</svg>
	);
}
