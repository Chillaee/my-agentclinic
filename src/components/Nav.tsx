export function Nav() {
	return (
		<nav
			style={{
				display: "flex",
				gap: "1.5rem",
				marginBottom: "2rem",
				fontSize: "0.9375rem",
			}}
		>
			<a href="/" style={{ color: "#374151", textDecoration: "none" }}>
				Home
			</a>
			<a
				href="/agents"
				style={{ color: "#374151", textDecoration: "none" }}
			>
				Agents
			</a>
			<a
				href="/ailments"
				style={{ color: "#374151", textDecoration: "none" }}
			>
				Ailments
			</a>
			<a
				href="/therapies"
				style={{ color: "#374151", textDecoration: "none" }}
			>
				Therapies
			</a>
		</nav>
	);
}
