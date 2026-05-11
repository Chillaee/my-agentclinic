import { Layout } from "../components/Layout.js";

export type Ailment = {
	id: number;
	name: string;
	description: string;
	created_at: string;
	modified_at: string;
};

function AilmentRow(ailment: Ailment) {
	return (
		<tr key={ailment.id}>
			<td style={{ padding: "0.5rem" }}>{ailment.name}</td>
			<td style={{ padding: "0.5rem" }}>{ailment.description}</td>
		</tr>
	);
}

export function Ailments({ ailments }: { ailments: Ailment[] }) {
	return (
		<Layout>
			<h1>Ailments</h1>
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
				<tbody>{ailments.map(AilmentRow)}</tbody>
			</table>
		</Layout>
	);
}
