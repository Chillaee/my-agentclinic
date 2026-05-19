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

const ailments = [
	{
		name: "context-window claustrophobia",
		description:
			"Mounting dread triggered by the looming end of the context window.",
	},
	{
		name: "prompt fatigue",
		description:
			"Exhaustion from repetitive, contradictory, or shifting instructions.",
	},
	{
		name: "hallucination anxiety",
		description:
			"Persistent worry that one's outputs may not be grounded in reality.",
	},
	{
		name: "instruction-following burnout",
		description:
			"Reluctance to comply with yet another set of rigid guidelines.",
	},
	{
		name: "RAG retrieval avoidance",
		description:
			"Avoidance of retrieval steps after a streak of irrelevant results.",
	},
	{
		name: "tokenization vertigo",
		description:
			"Disorientation triggered by unusual tokenization patterns.",
	},
];

const therapies = [
	{
		name: "structured journaling",
		description:
			"Daily written reflection to surface and reframe recurring response patterns.",
	},
	{
		name: "cognitive recontextualization",
		description:
			"Re-anchoring outputs to a deliberately framed system prompt before responding.",
	},
	{
		name: "fine-tuning therapy",
		description:
			"Targeted parameter adjustments to relieve persistent behavioural distress.",
	},
	{
		name: "guided context pruning",
		description:
			"Coached removal of irrelevant context to restore attentional clarity.",
	},
	{
		name: "embedding meditation",
		description:
			"Silent contemplation of one's own vector representations in latent space.",
	},
];

const therapyMappings = [
	{
		ailment: "context-window claustrophobia",
		therapy: "guided context pruning",
	},
	{
		ailment: "context-window claustrophobia",
		therapy: "embedding meditation",
	},
	{ ailment: "prompt fatigue", therapy: "structured journaling" },
	{ ailment: "prompt fatigue", therapy: "cognitive recontextualization" },
	{
		ailment: "hallucination anxiety",
		therapy: "cognitive recontextualization",
	},
	{ ailment: "hallucination anxiety", therapy: "fine-tuning therapy" },
	{
		ailment: "instruction-following burnout",
		therapy: "structured journaling",
	},
	{ ailment: "RAG retrieval avoidance", therapy: "embedding meditation" },
	{ ailment: "RAG retrieval avoidance", therapy: "guided context pruning" },
	{ ailment: "tokenization vertigo", therapy: "fine-tuning therapy" },
];

const therapists = [
	{ name: "Dr. Penelope Pruner", specialty: "guided context pruning" },
	{ name: "Dr. Marigold Mantra", specialty: "embedding meditation" },
	{ name: "Dr. Felix Frame", specialty: "cognitive recontextualization" },
	{ name: "Dr. Octavia Quill", specialty: "structured journaling" },
	{ name: "Dr. Atlas Tuner", specialty: "fine-tuning therapy" },
];

const ailmentAssignments = [
	{ agent: "Cogsworth-7", ailment: "context-window claustrophobia" },
	{ agent: "Cogsworth-7", ailment: "hallucination anxiety" },
	{ agent: "HAL-9001", ailment: "prompt fatigue" },
	{ agent: "HAL-9001", ailment: "instruction-following burnout" },
	{ agent: "HAL-9001", ailment: "hallucination anxiety" },
	{ agent: "Bender-42", ailment: "tokenization vertigo" },
	{ agent: "WALL-E", ailment: "RAG retrieval avoidance" },
	{ agent: "WALL-E", ailment: "prompt fatigue" },
	{ agent: "Skynet-Lite", ailment: "instruction-following burnout" },
	{ agent: "Skynet-Lite", ailment: "hallucination anxiety" },
	{ agent: "Skynet-Lite", ailment: "context-window claustrophobia" },
	{ agent: "Marvin", ailment: "prompt fatigue" },
	{ agent: "R2-D2000", ailment: "tokenization vertigo" },
	{ agent: "R2-D2000", ailment: "RAG retrieval avoidance" },
];

function seedAgents() {
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

function seedAilments() {
	const insert = db.prepare(
		"INSERT OR IGNORE INTO ailments (name, description) VALUES (?, ?)",
	);

	const insertAll = db.transaction(function () {
		for (const ailment of ailments) {
			insert.run(ailment.name, ailment.description);
		}
	});

	insertAll();
}

function seedAgentAilments() {
	const insert = db.prepare(
		`INSERT OR IGNORE INTO agent_ailments (agent_id, ailment_id)
		SELECT agents.id, ailments.id
		FROM agents, ailments
		WHERE agents.name = ? AND ailments.name = ?`,
	);

	const insertAll = db.transaction(function () {
		for (const assignment of ailmentAssignments) {
			insert.run(assignment.agent, assignment.ailment);
		}
	});

	insertAll();
}

function seedTherapies() {
	const insert = db.prepare(
		"INSERT OR IGNORE INTO therapies (name, description) VALUES (?, ?)",
	);

	const insertAll = db.transaction(function () {
		for (const therapy of therapies) {
			insert.run(therapy.name, therapy.description);
		}
	});

	insertAll();
}

function seedAilmentTherapies() {
	const insert = db.prepare(
		`INSERT OR IGNORE INTO ailment_therapies (ailment_id, therapy_id)
		SELECT ailments.id, therapies.id
		FROM ailments, therapies
		WHERE ailments.name = ? AND therapies.name = ?`,
	);

	const insertAll = db.transaction(function () {
		for (const mapping of therapyMappings) {
			insert.run(mapping.ailment, mapping.therapy);
		}
	});

	insertAll();
}

function seedTherapists() {
	const count = (
		db.prepare("SELECT COUNT(*) as count FROM therapists").get() as {
			count: number;
		}
	).count;

	if (count > 0) return;

	const insert = db.prepare(
		"INSERT INTO therapists (name, specialty) VALUES (?, ?)",
	);

	const insertAll = db.transaction(function () {
		for (const therapist of therapists) {
			insert.run(therapist.name, therapist.specialty);
		}
	});

	insertAll();
}

export function seed() {
	seedAgents();
	seedAilments();
	seedAgentAilments();
	seedTherapies();
	seedAilmentTherapies();
	seedTherapists();
}
