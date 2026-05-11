import { Layout } from "../components/Layout.js";
import type { Agent } from "./Agents.js";
import type { Ailment } from "./Ailments.js";

function AilmentListItem(ailment: Ailment) {
	return (
		<li key={ailment.id}>
			<strong>{ailment.name}</strong>: {ailment.description}
		</li>
	);
}

export function AgentDetail({
	agent,
	ailments,
}: {
	agent: Agent;
	ailments: Ailment[];
}) {
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
				{ailments.length === 0 ? (
					<p>None recorded.</p>
				) : (
					<ul>{ailments.map(AilmentListItem)}</ul>
				)}
			</section>
		</Layout>
	);
}
