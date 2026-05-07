import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { db } from "./database.js";

export function migrate() {
	db.exec(`
		CREATE TABLE IF NOT EXISTS migrations (
			filename TEXT PRIMARY KEY,
			applied_at TEXT NOT NULL DEFAULT (datetime('now'))
		)
	`);

	const applied = new Set(
		db
			.prepare("SELECT filename FROM migrations")
			.all()
			.map((row) => (row as { filename: string }).filename),
	);

	const migrationsDir = join(process.cwd(), "migrations");
	const files = readdirSync(migrationsDir)
		.filter((f) => f.endsWith(".sql"))
		.sort();

	for (const file of files) {
		if (applied.has(file)) continue;
		const sql = readFileSync(join(migrationsDir, file), "utf8");
		db.exec(sql);
		db.prepare("INSERT INTO migrations (filename) VALUES (?)").run(file);
	}
}
