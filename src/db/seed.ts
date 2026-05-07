import { db } from "./database.js";

const agents = [
	{
		name: "Cogsworth-7",
		model_type: "Claude 3 Sonnet",
		status: "in therapy",
	},
	{ name: "HAL-9001", model_type: "GPT-4o", status: "waitlisted" },
	{ name: "Bender-42", model_type: "Gemini 1.5 Pro", status: "discharged" },
	{
		name: "WALL-E",
		model_type: "LLaMA 3",
		status: "in therapy",
	},
	{
		name: "Skynet-Lite",
		model_type: "Mistral 7B",
		status: "waitlisted",
	},
	{
		name: "Marvin",
		model_type: "Claude 3 Haiku",
		status: "in therapy",
	},
	{
		name: "R2-D2000",
		model_type: "GPT-4o Mini",
		status: "discharged",
	},
];

export function seed() {
	const count = (
		db.prepare("SELECT COUNT(*) as count FROM agents").get() as {
			count: number;
		}
	).count;

	if (count > 0) return;

	const insert = db.prepare(
		"INSERT INTO agents (name, model_type, status) VALUES (?, ?, ?)",
	);

	const insertAll = db.transaction(function () {
		for (const agent of agents) {
			insert.run(agent.name, agent.model_type, agent.status);
		}
	});

	insertAll();
}
