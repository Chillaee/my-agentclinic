import { App } from "../components/App.js";

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
				<App />
			</body>
		</html>
	);
}
