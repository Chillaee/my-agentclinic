import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { Home } from "./pages/Home.js";

const app = new Hono();

app.get("/", (c) => c.html(<Home />));

serve({ fetch: app.fetch, port: 3000 }, () => {
	console.log("AgentClinic running on http://localhost:3000");
});
