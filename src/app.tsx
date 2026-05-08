import { Hono } from "hono";
import { db } from "./db/database.js";
import { AgentDetail } from "./pages/AgentDetail.js";
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

app.get("/agents/:id", function (c) {
	const id = c.req.param("id");
	const agent = db.prepare("SELECT * FROM agents WHERE id = ?").get(id) as
		| Agent
		| undefined;
	if (!agent) return c.notFound();
	return c.html(<AgentDetail agent={agent} />);
});
