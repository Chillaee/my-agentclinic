import { Hono } from "hono";
import { db } from "./db/database.js";
import { AgentDetail } from "./pages/AgentDetail.js";
import { Agents, type Agent } from "./pages/Agents.js";
import { Ailments, type Ailment } from "./pages/Ailments.js";
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
	const ailments = db
		.prepare(
			`SELECT ailments.* FROM ailments
			JOIN agent_ailments ON agent_ailments.ailment_id = ailments.id
			WHERE agent_ailments.agent_id = ?
			ORDER BY ailments.name ASC`,
		)
		.all(id) as Ailment[];
	return c.html(<AgentDetail agent={agent} ailments={ailments} />);
});

app.get("/ailments", function (c) {
	const ailments = db
		.prepare("SELECT * FROM ailments ORDER BY name ASC")
		.all() as Ailment[];
	return c.html(<Ailments ailments={ailments} />);
});
