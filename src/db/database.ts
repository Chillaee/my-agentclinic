import Database from "better-sqlite3";
import { mkdirSync } from "fs";
import { join } from "path";

const dataDir = join(process.cwd(), "database");
mkdirSync(dataDir, { recursive: true });

export const db = new Database(join(dataDir, "agentclinic.db"));
