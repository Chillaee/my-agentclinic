import { Layout } from "../components/Layout.js";

export type Therapist = {
	id: number;
	name: string;
	specialty: string;
	created_at: string;
	modified_at: string;
};

function TherapistRow(therapist: Therapist) {
	return (
		<tr key={therapist.id}>
			<td style={{ padding: "0.5rem" }}>{therapist.name}</td>
			<td style={{ padding: "0.5rem" }}>{therapist.specialty}</td>
		</tr>
	);
}

export function Staff({ therapists }: { therapists: Therapist[] }) {
	return (
		<Layout>
			<h1>Staff</h1>
			<table style={{ borderCollapse: "collapse", width: "100%" }}>
				<thead>
					<tr>
						<th style={{ textAlign: "left", padding: "0.5rem" }}>
							Name
						</th>
						<th style={{ textAlign: "left", padding: "0.5rem" }}>
							Specialty
						</th>
					</tr>
				</thead>
				<tbody>{therapists.map(TherapistRow)}</tbody>
			</table>
		</Layout>
	);
}
