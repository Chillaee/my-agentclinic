import { Layout } from "../components/Layout.js";

export type Therapy = {
	id: number;
	name: string;
	description: string;
	created_at: string;
	modified_at: string;
};

function TherapyRow(therapy: Therapy) {
	return (
		<tr key={therapy.id}>
			<td style={{ padding: "0.5rem" }}>{therapy.name}</td>
			<td style={{ padding: "0.5rem" }}>{therapy.description}</td>
		</tr>
	);
}

export function Therapies({ therapies }: { therapies: Therapy[] }) {
	return (
		<Layout>
			<h1>Therapies</h1>
			<table style={{ borderCollapse: "collapse", width: "100%" }}>
				<thead>
					<tr>
						<th style={{ textAlign: "left", padding: "0.5rem" }}>
							Name
						</th>
						<th style={{ textAlign: "left", padding: "0.5rem" }}>
							Description
						</th>
					</tr>
				</thead>
				<tbody>{therapies.map(TherapyRow)}</tbody>
			</table>
		</Layout>
	);
}
