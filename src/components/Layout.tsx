import type { PropsWithChildren } from "hono/jsx";
import { Footer } from "./Footer.js";
import { Header } from "./Header.js";
import { Nav } from "./Nav.js";

export function Layout({ children }: PropsWithChildren) {
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
				<Header />
				<Nav />
				<main style={{ maxWidth: "40rem", margin: "0 auto" }}>
					{children}
				</main>
				<Footer />
			</body>
		</html>
	);
}
