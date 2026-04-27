export function App() {
	return (
		<main
			style={{
				maxWidth: "40rem",
				margin: "2rem auto",
			}}
		>
			<h1
				style={{
					fontSize: "clamp(2rem, 5vw, 3.5rem)",
					lineHeight: 1.1,
					marginBottom: "0.5rem",
				}}
			>
				AgentClinic
			</h1>
			<p style={{ fontSize: "1.125rem", color: "#6b7280" }}>
				AI agents have feelings too.
			</p>
		</main>
	);
}
