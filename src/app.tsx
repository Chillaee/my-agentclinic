import { Hono } from "hono";
import { db } from "./db/database.js";
import { AgentDetail } from "./pages/AgentDetail.js";
import { Agents, type Agent } from "./pages/Agents.js";
import {
	Ailments,
	type Ailment,
	type AilmentWithTherapies,
} from "./pages/Ailments.js";
import { Home } from "./pages/Home.js";
import { Therapies, type Therapy } from "./pages/Therapies.js";

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
		.prepare(
			`SELECT
				ailments.*,
				COALESCE(GROUP_CONCAT(therapies.name, ', '), '') AS therapies
			FROM ailments
			LEFT JOIN ailment_therapies ON ailment_therapies.ailment_id = ailments.id
			LEFT JOIN therapies ON therapies.id = ailment_therapies.therapy_id
			GROUP BY ailments.id
			ORDER BY ailments.name ASC`,
		)
		.all() as AilmentWithTherapies[];
	return c.html(<Ailments ailments={ailments} />);
});

app.get("/therapies", function (c) {
	const therapies = db
		.prepare("SELECT * FROM therapies ORDER BY name ASC")
		.all() as Therapy[];
	return c.html(<Therapies therapies={therapies} />);
});
