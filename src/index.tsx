import { serve } from "@hono/node-server";
import { app } from "./app.js";

serve({ fetch: app.fetch, port: 3000 }, function () {
	console.log("AgentClinic running on http://localhost:3000");
});
