CREATE TABLE agents (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	model_type TEXT NOT NULL,
	status TEXT NOT NULL,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	modified_at TEXT NOT NULL DEFAULT (datetime('now'))
);
