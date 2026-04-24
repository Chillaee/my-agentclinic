import { describe, it, expect } from "vitest";
import { app } from "./app.js";

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
});
