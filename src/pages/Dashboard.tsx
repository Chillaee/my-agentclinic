import { Layout } from "../components/Layout.js";
import type { Agent } from "./Agents.js";
import type { Therapist } from "./Staff.js";

export type DashboardCounts = {
	agents: number;
	scheduledAppointments: number;
	ailmentsInFlight: number;
};

export type DashboardAppointment = {
	id: number;
	agent_id: number;
	agent_name: string;
	therapist_name: string;
	scheduled_at: string;
	status: string;
};

function StatCard({ heading, count }: { heading: string; count: number }) {
	return (
		<section
			style={{
				flex: "1 1 0",
				padding: "1.5rem",
				border: "1px solid #d1d5db",
				borderRadius: "0.5rem",
				background: "#f9fafb",
			}}
		>
			<h2 style={{ margin: 0, fontSize: "1rem", color: "#374151" }}>
				{heading}
			</h2>
			<p
				style={{
					margin: "0.5rem 0 0",
					fontSize: "2.5rem",
					fontWeight: 700,
				}}
			>
				{count}
			</p>
		</section>
	);
}

function AgentRow(agent: Agent) {
	return (
		<tr key={agent.id}>
			<td style={{ padding: "0.5rem" }}>
				<a href={`/agents/${agent.id}`}>{agent.name}</a>
			</td>
			<td style={{ padding: "0.5rem" }}>{agent.model_type}</td>
			<td style={{ padding: "0.5rem" }}>{agent.status}</td>
		</tr>
	);
}

function AppointmentRow(appointment: DashboardAppointment) {
	return (
		<tr key={appointment.id}>
			<td style={{ padding: "0.5rem" }}>
				<a href={`/appointments/${appointment.id}/confirmation`}>
					{appointment.agent_name}
				</a>
			</td>
			<td style={{ padding: "0.5rem" }}>{appointment.therapist_name}</td>
			<td style={{ padding: "0.5rem" }}>{appointment.scheduled_at}</td>
			<td style={{ padding: "0.5rem" }}>{appointment.status}</td>
		</tr>
	);
}

function TherapistRow(therapist: Therapist) {
	return (
		<tr key={therapist.id}>
			<td style={{ padding: "0.5rem" }}>{therapist.name}</td>
			<td style={{ padding: "0.5rem" }}>{therapist.specialty}</td>
		</tr>
	);
}

export function Dashboard({
	counts,
	agents,
	appointments,
	therapists,
}: {
	counts: DashboardCounts;
	agents: Agent[];
	appointments: DashboardAppointment[];
	therapists: Therapist[];
}) {
	return (
		<Layout>
			<h1>Dashboard</h1>
			<div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
				<StatCard heading="Agents" count={counts.agents} />
				<StatCard
					heading="Scheduled appointments"
					count={counts.scheduledAppointments}
				/>
				<StatCard
					heading="Ailments in-flight"
					count={counts.ailmentsInFlight}
				/>
			</div>

			<h2 style={{ marginTop: "2rem" }}>Agents</h2>
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

			<h2 style={{ marginTop: "2rem" }}>Appointments</h2>
			{appointments.length === 0 ? (
				<p>No appointments booked yet.</p>
			) : (
				<table style={{ borderCollapse: "collapse", width: "100%" }}>
					<thead>
						<tr>
							<th
								style={{ textAlign: "left", padding: "0.5rem" }}
							>
								Agent
							</th>
							<th
								style={{ textAlign: "left", padding: "0.5rem" }}
							>
								Therapist
							</th>
							<th
								style={{ textAlign: "left", padding: "0.5rem" }}
							>
								Scheduled at
							</th>
							<th
								style={{ textAlign: "left", padding: "0.5rem" }}
							>
								Status
							</th>
						</tr>
					</thead>
					<tbody>{appointments.map(AppointmentRow)}</tbody>
				</table>
			)}

			<h2 style={{ marginTop: "2rem" }}>Therapists</h2>
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
