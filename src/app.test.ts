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

describe("GET /staff", function () {
	it("responds with 200", async function () {
		const res = await app.request("/staff");
		expect(res.status).toBe(200);
	});

	it("renders a table", async function () {
		const res = await app.request("/staff");
		const body = await res.text();
		expect(body).toContain("<table");
	});

	it("includes every seeded therapist name in a <td>", async function () {
		const res = await app.request("/staff");
		const body = await res.text();
		const seeded = db.prepare("SELECT name FROM therapists").all() as {
			name: string;
		}[];
		expect(seeded.length).toBeGreaterThanOrEqual(4);
		for (const therapist of seeded) {
			expect(body).toContain(
				`<td style="padding:0.5rem">${therapist.name}`,
			);
		}
	});

	it("nav contains a Staff link", async function () {
		const res = await app.request("/");
		const body = await res.text();
		expect(body).toContain('href="/staff"');
	});
});

describe("GET /agents/:id appointment form", function () {
	it("renders a booking form with therapist <select> and datetime-local input", async function () {
		const agent = db
			.prepare("SELECT id FROM agents WHERE name = ?")
			.get("Cogsworth-7") as { id: number };
		const res = await app.request(`/agents/${agent.id}`);
		const body = await res.text();
		expect(body).toContain(`action="/agents/${agent.id}/appointments"`);
		expect(body).toContain('name="therapist_id"');
		expect(body).toContain('name="scheduled_at"');
		expect(body).toContain('type="datetime-local"');
		const therapists = db.prepare("SELECT id FROM therapists").all() as {
			id: number;
		}[];
		for (const therapist of therapists) {
			expect(body).toContain(`value="${therapist.id}"`);
		}
	});
});

describe("POST /agents/:id/appointments", function () {
	function futureIsoString() {
		return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
	}

	function appointmentCount() {
		return (
			db.prepare("SELECT COUNT(*) as c FROM appointments").get() as {
				c: number;
			}
		).c;
	}

	function formBody(fields: Record<string, string>) {
		return new URLSearchParams(fields).toString();
	}

	const formHeaders = {
		"Content-Type": "application/x-www-form-urlencoded",
	};

	it("inserts a scheduled appointment and redirects (303) to its confirmation", async function () {
		const agent = db
			.prepare("SELECT id FROM agents WHERE name = ?")
			.get("Cogsworth-7") as { id: number };
		const therapist = db
			.prepare("SELECT id FROM therapists ORDER BY id LIMIT 1")
			.get() as { id: number };
		const scheduledAt = futureIsoString();
		const before = appointmentCount();
		const res = await app.request(`/agents/${agent.id}/appointments`, {
			method: "POST",
			headers: formHeaders,
			body: formBody({
				therapist_id: String(therapist.id),
				scheduled_at: scheduledAt,
			}),
		});
		expect(res.status).toBe(303);
		const location = res.headers.get("location") ?? "";
		const match = location.match(/^\/appointments\/(\d+)\/confirmation$/);
		expect(match).not.toBeNull();
		const newId = Number(match![1]);
		try {
			expect(appointmentCount()).toBe(before + 1);
			const inserted = db
				.prepare("SELECT * FROM appointments WHERE id = ?")
				.get(newId) as {
				agent_id: number;
				therapist_id: number;
				status: string;
			};
			expect(inserted.agent_id).toBe(agent.id);
			expect(inserted.therapist_id).toBe(therapist.id);
			expect(inserted.status).toBe("scheduled");
		} finally {
			db.prepare("DELETE FROM appointments WHERE id = ?").run(newId);
		}
	});

	it("returns 400 with an inline error when fields are missing", async function () {
		const agent = db
			.prepare("SELECT id FROM agents WHERE name = ?")
			.get("Cogsworth-7") as { id: number };
		const before = appointmentCount();
		const res = await app.request(`/agents/${agent.id}/appointments`, {
			method: "POST",
			headers: formHeaders,
			body: formBody({ therapist_id: "", scheduled_at: "" }),
		});
		expect(res.status).toBe(400);
		const body = await res.text();
		expect(body).toContain('role="alert"');
		expect(body).toContain("therapist");
		expect(appointmentCount()).toBe(before);
	});

	it("preserves the submitted scheduled_at value when re-rendering the form on error", async function () {
		const agent = db
			.prepare("SELECT id FROM agents WHERE name = ?")
			.get("Cogsworth-7") as { id: number };
		const submitted = "2030-01-02T03:04";
		const res = await app.request(`/agents/${agent.id}/appointments`, {
			method: "POST",
			headers: formHeaders,
			body: formBody({ therapist_id: "", scheduled_at: submitted }),
		});
		expect(res.status).toBe(400);
		const body = await res.text();
		expect(body).toContain(`value="${submitted}"`);
	});

	it("returns 404 when the agent does not exist", async function () {
		const therapist = db
			.prepare("SELECT id FROM therapists ORDER BY id LIMIT 1")
			.get() as { id: number };
		const res = await app.request("/agents/999999/appointments", {
			method: "POST",
			headers: formHeaders,
			body: formBody({
				therapist_id: String(therapist.id),
				scheduled_at: futureIsoString(),
			}),
		});
		expect(res.status).toBe(404);
	});

	it("returns 400 when the therapist_id does not exist", async function () {
		const agent = db
			.prepare("SELECT id FROM agents WHERE name = ?")
			.get("Cogsworth-7") as { id: number };
		const before = appointmentCount();
		const res = await app.request(`/agents/${agent.id}/appointments`, {
			method: "POST",
			headers: formHeaders,
			body: formBody({
				therapist_id: "999999",
				scheduled_at: futureIsoString(),
			}),
		});
		expect(res.status).toBe(400);
		const body = await res.text();
		expect(body).toContain('role="alert"');
		expect(appointmentCount()).toBe(before);
	});

	it("returns 400 when scheduled_at is in the past", async function () {
		const agent = db
			.prepare("SELECT id FROM agents WHERE name = ?")
			.get("Cogsworth-7") as { id: number };
		const therapist = db
			.prepare("SELECT id FROM therapists ORDER BY id LIMIT 1")
			.get() as { id: number };
		const before = appointmentCount();
		const past = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
		const res = await app.request(`/agents/${agent.id}/appointments`, {
			method: "POST",
			headers: formHeaders,
			body: formBody({
				therapist_id: String(therapist.id),
				scheduled_at: past,
			}),
		});
		expect(res.status).toBe(400);
		const body = await res.text();
		expect(body).toContain('role="alert"');
		expect(appointmentCount()).toBe(before);
	});
});

describe("GET /appointments/:id/confirmation", function () {
	it("returns 200 with agent name, therapist name, and scheduled time", async function () {
		const agent = db
			.prepare("SELECT id, name FROM agents WHERE name = ?")
			.get("Cogsworth-7") as { id: number; name: string };
		const therapist = db
			.prepare("SELECT id, name FROM therapists ORDER BY id LIMIT 1")
			.get() as { id: number; name: string };
		const scheduledAt = new Date(
			Date.now() + 7 * 24 * 60 * 60 * 1000,
		).toISOString();
		const result = db
			.prepare(
				"INSERT INTO appointments (agent_id, therapist_id, scheduled_at) VALUES (?, ?, ?)",
			)
			.run(agent.id, therapist.id, scheduledAt);
		const newId = result.lastInsertRowid as number;
		try {
			const res = await app.request(
				`/appointments/${newId}/confirmation`,
			);
			expect(res.status).toBe(200);
			const body = await res.text();
			expect(body).toContain(agent.name);
			expect(body).toContain(therapist.name);
			expect(body).toContain(scheduledAt);
		} finally {
			db.prepare("DELETE FROM appointments WHERE id = ?").run(newId);
		}
	});

	it("returns 404 for a non-existent appointment id", async function () {
		const res = await app.request("/appointments/999999/confirmation");
		expect(res.status).toBe(404);
	});
});

describe("seed idempotency", function () {
	const tables = [
		"agents",
		"ailments",
		"agent_ailments",
		"therapies",
		"ailment_therapies",
		"therapists",
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
