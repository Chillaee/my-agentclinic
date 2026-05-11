import { Layout } from "../components/Layout.js";

export type Ailment = {
	id: number;
	name: string;
	description: string;
	created_at: string;
	modified_at: string;
};

export type AilmentWithTherapies = Ailment & { therapies: string };

function AilmentRow(ailment: AilmentWithTherapies) {
	return (
		<tr key={ailment.id}>
			<td style={{ padding: "0.5rem" }}>{ailment.name}</td>
			<td style={{ padding: "0.5rem" }}>{ailment.description}</td>
			<td style={{ padding: "0.5rem" }}>{ailment.therapies}</td>
		</tr>
	);
}

export function Ailments({ ailments }: { ailments: AilmentWithTherapies[] }) {
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
						<th style={{ textAlign: "left", padding: "0.5rem" }}>
							Recommended therapies
						</th>
					</tr>
				</thead>
				<tbody>{ailments.map(AilmentRow)}</tbody>
			</table>
		</Layout>
	);
}
