CREATE TABLE therapies (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL UNIQUE,
	description TEXT NOT NULL,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	modified_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE ailment_therapies (
	ailment_id INTEGER NOT NULL,
	therapy_id INTEGER NOT NULL,
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	modified_at TEXT NOT NULL DEFAULT (datetime('now')),
	PRIMARY KEY (ailment_id, therapy_id),
	FOREIGN KEY (ailment_id) REFERENCES ailments(id) ON DELETE CASCADE,
	FOREIGN KEY (therapy_id) REFERENCES therapies(id) ON DELETE CASCADE
);
