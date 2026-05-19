import type { Therapist } from "../pages/Staff.js";

export type AppointmentFormValues = {
	therapist_id?: string;
	scheduled_at?: string;
};

function TherapistOption({
	therapist,
	selected,
}: {
	therapist: Therapist;
	selected: boolean;
}) {
	return (
		<option value={therapist.id} selected={selected}>
			{therapist.name} ({therapist.specialty})
		</option>
	);
}

export function AppointmentForm({
	agentId,
	therapists,
	error,
	values,
}: {
	agentId: number;
	therapists: Therapist[];
	error?: string;
	values?: AppointmentFormValues;
}) {
	const selectedTherapistId = values?.therapist_id ?? "";
	const scheduledAt = values?.scheduled_at ?? "";
	return (
		<section style={{ marginTop: "2rem" }}>
			<h2>Book an appointment</h2>
			{error ? (
				<p
					role="alert"
					style={{
						color: "#b91c1c",
						fontWeight: 600,
					}}
				>
					{error}
				</p>
			) : null}
			<form method="post" action={`/agents/${agentId}/appointments`}>
				<p>
					<label>
						Therapist
						<br />
						<select name="therapist_id" required>
							<option value="">Select a therapist</option>
							{therapists.map(function (therapist) {
								return (
									<TherapistOption
										therapist={therapist}
										selected={
											String(therapist.id) ===
											selectedTherapistId
										}
									/>
								);
							})}
						</select>
					</label>
				</p>
				<p>
					<label>
						Scheduled at
						<br />
						<input
							type="datetime-local"
							name="scheduled_at"
							value={scheduledAt}
							required
						/>
					</label>
				</p>
				<button type="submit">Book appointment</button>
			</form>
		</section>
	);
}
