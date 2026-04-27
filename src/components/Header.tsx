export function Header() {
	return (
		<header
			style={{
				borderBottom: "1px solid #e5e7eb",
				paddingBottom: "1rem",
				marginBottom: "1rem",
			}}
		>
			<a
				href="/"
				style={{
					fontWeight: 700,
					fontSize: "1.125rem",
					textDecoration: "none",
					color: "inherit",
				}}
			>
				AgentClinic
			</a>
		</header>
	);
}
