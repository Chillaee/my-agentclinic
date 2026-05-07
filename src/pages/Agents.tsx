import { Layout } from "../components/Layout.js";

export type Agent = {
	id: number;
	name: string;
	model_type: string;
	status: string;
	created_at: string;
	modified_at: string;
};

function AgentRow(agent: Agent) {
	return (
		<tr key={agent.id}>
			<td style={{ padding: "0.5rem" }}>{agent.name}</td>
			<td style={{ padding: "0.5rem" }}>{agent.model_type}</td>
			<td style={{ padding: "0.5rem" }}>{agent.status}</td>
		</tr>
	);
}

export function Agents({ agents }: { agents: Agent[] }) {
	return (
		<Layout>
			<h1>Agents</h1>
			<table style={{ borderCollapse: "collapse", width: "100%" }}>
				<thead>
					<tr>
						<th style={{ textAlign: "left", padding: "0.5rem" }}>
							Name
						</th>
						<th style={{ textAlign: "left", padding: "0.5rem" }}>
							Model Type
						</th>
						<th style={{ textAlign: "left", padding: "0.5rem" }}>
							Status
						</th>
					</tr>
				</thead>
				<tbody>{agents.map(AgentRow)}</tbody>
			</table>
		</Layout>
	);
}
