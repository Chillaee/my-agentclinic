CREATE TABLE ailments (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL UNIQUE,
	description TEXT NOT NULL,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	modified_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE agent_ailments (
	agent_id INTEGER NOT NULL,
	ailment_id INTEGER NOT NULL,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	modified_at TEXT NOT NULL DEFAULT (datetime('now')),
	PRIMARY KEY (agent_id, ailment_id),
	FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
	FOREIGN KEY (ailment_id) REFERENCES ailments(id) ON DELETE CASCADE
);
