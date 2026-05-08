import { Layout } from "../components/Layout.js";
import type { Agent } from "./Agents.js";

export function AgentDetail({ agent }: { agent: Agent }) {
	return (
		<Layout>
			<h1>{agent.name}</h1>
			<dl>
				<dt>Model Type</dt>
				<dd>{agent.model_type}</dd>
				<dt>Status</dt>
				<dd>{agent.status}</dd>
				<dt>Created</dt>
				<dd>{agent.created_at}</dd>
				<dt>Last Modified</dt>
				<dd>{agent.modified_at}</dd>
			</dl>
			<section>
				<h2>Presenting Complaints</h2>
				<p>None recorded.</p>
			</section>
		</Layout>
	);
}
