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
