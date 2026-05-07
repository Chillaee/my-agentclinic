import { Hono } from "hono";
import { db } from "./db/database.js";
import { Agents, type Agent } from "./pages/Agents.js";
import { Home } from "./pages/Home.js";

export const app = new Hono();

app.get("/", (c) => c.html(<Home />));

app.get("/agents", function (c) {
	const agents = db
		.prepare("SELECT * FROM agents ORDER BY name ASC")
		.all() as Agent[];
	return c.html(<Agents agents={agents} />);
});
