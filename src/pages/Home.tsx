export function Home() {
	return (
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0"
				/>
				<title>AgentClinic</title>
			</head>
			<body
				style={{
					margin: 0,
					padding: "1rem",
					fontFamily: "system-ui, -apple-system, sans-serif",
					lineHeight: 1.6,
				}}
			>
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
			</body>
		</html>
	);
}
