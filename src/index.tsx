import { serve } from "@hono/node-server";
import { app } from "./app.js";
import { migrate } from "./db/migrate.js";
import { seed } from "./db/seed.js";

migrate();
seed();

serve({ fetch: app.fetch, port: 3000 }, function () {
	console.log("AgentClinic running on http://localhost:3000");
});
