import { describe, it, expect, beforeAll } from "vitest";
import { app } from "./app.js";
import { db } from "./db/database.js";
import { migrate } from "./db/migrate.js";
import { seed } from "./db/seed.js";

beforeAll(function () {
	migrate();
	seed();
});

describe("GET /", function () {
	it("responds with 200", async function () {
		const res = await app.request("/");
		expect(res.status).toBe(200);
	});

	it("returns the site title", async function () {
		const res = await app.request("/");
		const body = await res.text();
		expect(body).toContain("AgentClinic");
	});

	it("returns the strapline", async function () {
		const res = await app.request("/");
		const body = await res.text();
		expect(body).toContain("AI agents have feelings too.");
	});

	it("renders a header element", async function () {
		const res = await app.request("/");
		const body = await res.text();
		expect(body).toContain("<header");
	});

	it("renders a nav element", async function () {
		const res = await app.request("/");
		const body = await res.text();
		expect(body).toContain("<nav");
	});

	it("renders a footer element", async function () {
		const res = await app.request("/");
		const body = await res.text();
		expect(body).toContain("<footer");
	});

	it("nav contains links to all top-level routes", async function () {
		const res = await app.request("/");
		const body = await res.text();
		expect(body).toContain('href="/agents"');
		expect(body).toContain('href="/ailments"');
		expect(body).toContain('href="/therapies"');
	});

	it("page content is wrapped in a main element", async function () {
		const res = await app.request("/");
		const body = await res.text();
		expect(body).toContain("<main");
	});
});

describe("GET /agents", function () {
	it("responds with 200", async function () {
		const res = await app.request("/agents");
		expect(res.status).toBe(200);
	});

	it("renders a table", async function () {
		const res = await app.request("/agents");
		const body = await res.text();
		expect(body).toContain("<table");
	});

	it("includes at least one seeded agent name", async function () {
		const res = await app.request("/agents");
		const body = await res.text();
		expect(body).toContain("Cogsworth-7");
	});

	it("renders each agent name as a link to its detail page", async function () {
		const res = await app.request("/agents");
		const body = await res.text();
		const agents = db.prepare("SELECT id FROM agents").all() as {
			id: number;
		}[];
		expect(agents.length).toBeGreaterThan(0);
		for (const agent of agents) {
			expect(body).toContain(`href="/agents/${agent.id}"`);
		}
	});
});

describe("GET /agents/:id", function () {
	it("returns 200 for a seeded agent", async function () {
		const agent = db
			.prepare("SELECT id FROM agents WHERE name = ?")
			.get("Cogsworth-7") as { id: number };
		const res = await app.request(`/agents/${agent.id}`);
		expect(res.status).toBe(200);
	});

	it("body contains the agent's name and model type", async function () {
		const agent = db
			.prepare("SELECT id, name, model_type FROM agents WHERE name = ?")
			.get("Cogsworth-7") as {
			id: number;
			name: string;
			model_type: string;
		};
		const res = await app.request(`/agents/${agent.id}`);
		const body = await res.text();
		expect(body).toContain(agent.name);
		expect(body).toContain(agent.model_type);
	});

	it("renders inside the shared layout", async function () {
		const agent = db
			.prepare("SELECT id FROM agents WHERE name = ?")
			.get("Cogsworth-7") as { id: number };
		const res = await app.request(`/agents/${agent.id}`);
		const body = await res.text();
		expect(body).toContain("<header");
		expect(body).toContain("<nav");
		expect(body).toContain("<footer");
	});

	it("renders a Presenting Complaints section", async function () {
		const agent = db
			.prepare("SELECT id FROM agents WHERE name = ?")
			.get("Cogsworth-7") as { id: number };
		const res = await app.request(`/agents/${agent.id}`);
		const body = await res.text();
		expect(body).toContain("Presenting Complaints");
	});

	it("lists at least one ailment for an agent with seeded ailments", async function () {
		const agent = db
			.prepare("SELECT id FROM agents WHERE name = ?")
			.get("Cogsworth-7") as { id: number };
		const res = await app.request(`/agents/${agent.id}`);
		const body = await res.text();
		expect(body).toContain("context-window claustrophobia");
	});

	it("shows 'None recorded.' for an agent with no ailments", async function () {
		const result = db
			.prepare(
				"INSERT INTO agents (name, model_type, status) VALUES (?, ?, ?)",
			)
			.run("Solo-Test-Agent", "TestModel", "in therapy");
		const newId = result.lastInsertRowid as number;
		try {
			const res = await app.request(`/agents/${newId}`);
			const body = await res.text();
			expect(body).toContain("Presenting Complaints");
			expect(body).toContain("None recorded.");
		} finally {
			db.prepare("DELETE FROM agents WHERE id = ?").run(newId);
		}
	});

	it("returns 404 for a non-existent id", async function () {
		const res = await app.request("/agents/999999");
		expect(res.status).toBe(404);
	});
});

describe("GET /ailments", function () {
	it("responds with 200", async function () {
		const res = await app.request("/ailments");
		expect(res.status).toBe(200);
	});

	it("renders a table", async function () {
		const res = await app.request("/ailments");
		const body = await res.text();
		expect(body).toContain("<table");
	});

	it("includes every seeded ailment name in a <td>", async function () {
		const res = await app.request("/ailments");
		const body = await res.text();
		const seeded = db.prepare("SELECT name FROM ailments").all() as {
			name: string;
		}[];
		expect(seeded.length).toBeGreaterThanOrEqual(6);
		for (const ailment of seeded) {
			expect(body).toContain(
				`<td style="padding:0.5rem">${ailment.name}`,
			);
		}
	});

	it("includes a 'Recommended therapies' column header", async function () {
		const res = await app.request("/ailments");
		const body = await res.text();
		expect(body).toContain("Recommended therapies");
	});

	it("renders at least one therapy name in the recommended-therapies column", async function () {
		const res = await app.request("/ailments");
		const body = await res.text();
		const therapy = db
			.prepare(
				`SELECT therapies.name FROM therapies
				JOIN ailment_therapies ON ailment_therapies.therapy_id = therapies.id
				LIMIT 1`,
			)
			.get() as { name: string };
		expect(body).toContain(therapy.name);
	});

	it("renders an empty cell for an ailment with no mapped therapies", async function () {
		const result = db
			.prepare("INSERT INTO ailments (name, description) VALUES (?, ?)")
			.run("orphan-ailment", "A condition with no recommended therapy.");
		const newId = result.lastInsertRowid as number;
		try {
			const res = await app.request("/ailments");
			expect(res.status).toBe(200);
			const body = await res.text();
			expect(body).toContain("orphan-ailment");
			expect(body).toContain(
				`<td style="padding:0.5rem">A condition with no recommended therapy.</td><td style="padding:0.5rem"></td>`,
			);
		} finally {
			db.prepare("DELETE FROM ailments WHERE id = ?").run(newId);
		}
	});
});

describe("GET /therapies", function () {
	it("responds with 200", async function () {
		const res = await app.request("/therapies");
		expect(res.status).toBe(200);
	});

	it("renders a table", async function () {
		const res = await app.request("/therapies");
		const body = await res.text();
		expect(body).toContain("<table");
	});

	it("includes every seeded therapy name in a <td>", async function () {
		const res = await app.request("/therapies");
		const body = await res.text();
		const seeded = db.prepare("SELECT name FROM therapies").all() as {
			name: string;
		}[];
		expect(seeded.length).toBeGreaterThanOrEqual(5);
		for (const therapy of seeded) {
			expect(body).toContain(
				`<td style="padding:0.5rem">${therapy.name}`,
			);
		}
	});
});

describe("seed idempotency", function () {
	const tables = [
		"agents",
		"ailments",
		"agent_ailments",
		"therapies",
		"ailment_therapies",
	];

	function rowCounts() {
		const result: Record<string, number> = {};
		for (const table of tables) {
			result[table] = (
				db.prepare(`SELECT COUNT(*) as c FROM ${table}`).get() as {
					c: number;
				}
			).c;
		}
		return result;
	}

	it("re-running seed does not duplicate rows", function () {
		const before = rowCounts();
		seed();
		const after = rowCounts();
		expect(after).toEqual(before);
	});
});
