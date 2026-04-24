import { Hono } from "hono";
import { Home } from "./pages/Home.js";

export const app = new Hono();

app.get("/", (c) => c.html(<Home />));
