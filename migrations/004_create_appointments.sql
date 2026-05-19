CREATE TABLE therapists (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	specialty TEXT NOT NULL,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	modified_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE appointments (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	agent_id INTEGER NOT NULL,
	therapist_id INTEGER NOT NULL,
	scheduled_at TEXT NOT NULL,
	status TEXT NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled')) DEFAULT 'scheduled',
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	modified_at TEXT NOT NULL DEFAULT (datetime('now')),
	FOREIGN KEY (agent_id) REFERENCES agents(id),
	FOREIGN KEY (therapist_id) REFERENCES therapists(id)
);
