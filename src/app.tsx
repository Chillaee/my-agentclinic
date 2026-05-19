import { Hono } from "hono";
import type { AppointmentFormValues } from "./components/AppointmentForm.js";
import { db } from "./db/database.js";
import { AgentDetail } from "./pages/AgentDetail.js";
import { Agents, type Agent } from "./pages/Agents.js";
import {
	Ailments,
	type Ailment,
	type AilmentWithTherapies,
} from "./pages/Ailments.js";
import {
	AppointmentConfirmation,
	type AppointmentDetail,
} from "./pages/AppointmentConfirmation.js";
import { Dashboard, type DashboardAppointment } from "./pages/Dashboard.js";
import { Home } from "./pages/Home.js";
import { Staff, type Therapist } from "./pages/Staff.js";
import { Therapies, type Therapy } from "./pages/Therapies.js";

export const app = new Hono();

function loadAgentDetailData(agentId: string) {
	const agent = db
		.prepare("SELECT * FROM agents WHERE id = ?")
		.get(agentId) as Agent | undefined;
	if (!agent) return null;
	const ailments = db
		.prepare(
			`SELECT ailments.* FROM ailments
			JOIN agent_ailments ON agent_ailments.ailment_id = ailments.id
			WHERE agent_ailments.agent_id = ?
			ORDER BY ailments.name ASC`,
		)
		.all(agentId) as Ailment[];
	const therapists = db
		.prepare("SELECT * FROM therapists ORDER BY name ASC")
		.all() as Therapist[];
	return { agent, ailments, therapists };
}

app.get("/", (c) => c.html(<Home />));

app.get("/agents", function (c) {
	const agents = db
		.prepare("SELECT * FROM agents ORDER BY name ASC")
		.all() as Agent[];
	return c.html(<Agents agents={agents} />);
});

app.get("/agents/:id", function (c) {
	const data = loadAgentDetailData(c.req.param("id"));
	if (!data) return c.notFound();
	return c.html(
		<AgentDetail
			agent={data.agent}
			ailments={data.ailments}
			therapists={data.therapists}
		/>,
	);
});

app.post("/agents/:id/appointments", async function (c) {
	const id = c.req.param("id");
	const data = loadAgentDetailData(id);
	if (!data) return c.notFound();

	const body = await c.req.parseBody();
	const therapistId =
		typeof body.therapist_id === "string" ? body.therapist_id : "";
	const scheduledAt =
		typeof body.scheduled_at === "string" ? body.scheduled_at : "";
	const formValues: AppointmentFormValues = {
		therapist_id: therapistId,
		scheduled_at: scheduledAt,
	};

	function renderError(error: string) {
		return c.html(
			<AgentDetail
				agent={data!.agent}
				ailments={data!.ailments}
				therapists={data!.therapists}
				error={error}
				formValues={formValues}
			/>,
			400,
		);
	}

	if (!therapistId || !scheduledAt) {
		return renderError("Please select a therapist and a scheduled time.");
	}

	const therapist = db
		.prepare("SELECT id FROM therapists WHERE id = ?")
		.get(therapistId) as { id: number } | undefined;
	if (!therapist) {
		return renderError("Selected therapist does not exist.");
	}

	const parsed = new Date(scheduledAt);
	if (isNaN(parsed.getTime())) {
		return renderError("Scheduled time is not a valid datetime.");
	}
	if (parsed.getTime() <= Date.now()) {
		return renderError("Scheduled time must be in the future.");
	}

	const result = db
		.prepare(
			"INSERT INTO appointments (agent_id, therapist_id, scheduled_at) VALUES (?, ?, ?)",
		)
		.run(id, therapistId, parsed.toISOString());
	const newId = result.lastInsertRowid as number;
	return c.redirect(`/appointments/${newId}/confirmation`, 303);
});

app.get("/appointments/:id/confirmation", function (c) {
	const id = c.req.param("id");
	const appointment = db
		.prepare(
			`SELECT
				appointments.id,
				appointments.agent_id,
				appointments.therapist_id,
				agents.name AS agent_name,
				therapists.name AS therapist_name,
				appointments.scheduled_at,
				appointments.status
			FROM appointments
			JOIN agents ON agents.id = appointments.agent_id
			JOIN therapists ON therapists.id = appointments.therapist_id
			WHERE appointments.id = ?`,
		)
		.get(id) as AppointmentDetail | undefined;
	if (!appointment) return c.notFound();
	return c.html(<AppointmentConfirmation appointment={appointment} />);
});

app.get("/ailments", function (c) {
	const ailments = db
		.prepare(
			`SELECT
				ailments.*,
				COALESCE(GROUP_CONCAT(therapies.name, ', '), '') AS therapies
			FROM ailments
			LEFT JOIN ailment_therapies ON ailment_therapies.ailment_id = ailments.id
			LEFT JOIN therapies ON therapies.id = ailment_therapies.therapy_id
			GROUP BY ailments.id
			ORDER BY ailments.name ASC`,
		)
		.all() as AilmentWithTherapies[];
	return c.html(<Ailments ailments={ailments} />);
});

app.get("/therapies", function (c) {
	const therapies = db
		.prepare("SELECT * FROM therapies ORDER BY name ASC")
		.all() as Therapy[];
	return c.html(<Therapies therapies={therapies} />);
});

app.get("/staff", function (c) {
	const therapists = db
		.prepare("SELECT * FROM therapists ORDER BY name ASC")
		.all() as Therapist[];
	return c.html(<Staff therapists={therapists} />);
});

app.get("/dashboard", function (c) {
	const agentsCount = (
		db.prepare("SELECT COUNT(*) as c FROM agents").get() as { c: number }
	).c;
	const scheduledAppointmentsCount = (
		db
			.prepare(
				"SELECT COUNT(*) as c FROM appointments WHERE status = 'scheduled'",
			)
			.get() as { c: number }
	).c;
	const ailmentsInFlightCount = (
		db
			.prepare(
				`SELECT COUNT(*) as c FROM agent_ailments aa
				JOIN agents a ON a.id = aa.agent_id
				WHERE a.status = 'in therapy'`,
			)
			.get() as { c: number }
	).c;
	const agents = db
		.prepare("SELECT * FROM agents ORDER BY name ASC")
		.all() as Agent[];
	const appointments = db
		.prepare(
			`SELECT
				appointments.id,
				appointments.agent_id,
				agents.name AS agent_name,
				therapists.name AS therapist_name,
				appointments.scheduled_at,
				appointments.status
			FROM appointments
			JOIN agents ON agents.id = appointments.agent_id
			JOIN therapists ON therapists.id = appointments.therapist_id
			ORDER BY appointments.scheduled_at ASC`,
		)
		.all() as DashboardAppointment[];
	const therapists = db
		.prepare("SELECT * FROM therapists ORDER BY name ASC")
		.all() as Therapist[];
	return c.html(
		<Dashboard
			counts={{
				agents: agentsCount,
				scheduledAppointments: scheduledAppointmentsCount,
				ailmentsInFlight: ailmentsInFlightCount,
			}}
			agents={agents}
			appointments={appointments}
			therapists={therapists}
		/>,
	);
});
