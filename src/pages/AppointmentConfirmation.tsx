import { Layout } from "../components/Layout.js";

export type AppointmentDetail = {
	id: number;
	agent_id: number;
	therapist_id: number;
	agent_name: string;
	therapist_name: string;
	scheduled_at: string;
	status: string;
};

export function AppointmentConfirmation({
	appointment,
}: {
	appointment: AppointmentDetail;
}) {
	return (
		<Layout>
			<h1>Appointment confirmed</h1>
			<p>The appointment has been booked.</p>
			<dl>
				<dt>Agent</dt>
				<dd>
					<a href={`/agents/${appointment.agent_id}`}>
						{appointment.agent_name}
					</a>
				</dd>
				<dt>Therapist</dt>
				<dd>{appointment.therapist_name}</dd>
				<dt>Scheduled at</dt>
				<dd>{appointment.scheduled_at}</dd>
				<dt>Status</dt>
				<dd>{appointment.status}</dd>
			</dl>
		</Layout>
	);
}
