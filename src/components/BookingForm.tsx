"use client";

import { useRef, useState, type FormEvent } from "react";
import { bookingTimes, bookingTreatments, validateBooking, type BookingErrors, type BookingField, type BookingResponse, type BookingSummary } from "@/lib/booking";

const personalFields = [
    { name: "fullName", label: "Full name", type: "text", autoComplete: "name", maxLength: 100 },
    { name: "email", label: "Email", type: "email", autoComplete: "email", maxLength: 254 },
    { name: "phone", label: "Phone", type: "tel", autoComplete: "tel", maxLength: 30 },
] as const;

export default function BookingForm({ minimumDate }: { minimumDate: string }) {
    const [errors, setErrors] = useState<BookingErrors>({});
    const [status, setStatus] = useState<"idle" | "pending" | "success" | "failure">("idle");
    const [message, setMessage] = useState("");
    const [summary, setSummary] = useState<BookingSummary>();
    const submitting = useRef(false);
    const formRef = useRef<HTMLFormElement>(null);
    const confirmationRef = useRef<HTMLDivElement>(null);

    function showErrors(form: HTMLFormElement, nextErrors: BookingErrors) {
        setErrors(nextErrors);
        const field = Object.keys(nextErrors)[0];
        // Server errors arrive while the fieldset is disabled; wait for the idle render before focusing.
        requestAnimationFrame(() => {
            const element = field ? form.elements.namedItem(field) : null;
            if (element instanceof HTMLElement) element.focus();
        });
    }

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (submitting.current || status === "success") return;
        const form = event.currentTarget;
        const fields = new FormData(form);
        const { data, errors: nextErrors } = validateBooking({ ...Object.fromEntries(fields), consent: fields.get("consent") === "on" });
        setMessage("");
        setStatus("idle");
        if (!data) { showErrors(form, nextErrors); return; }
        setErrors({});
        submitting.current = true;
        setStatus("pending");
        try {
            const response = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data), signal: AbortSignal.timeout(15000) });
            const result: BookingResponse = await response.json();
            if (response.status === 422 && !result.ok && result.errors) {
                showErrors(form, result.errors);
                setStatus("idle");
                return;
            }
            if (!response.ok || !result.ok || result.stored !== true || !result.summary) throw new Error("Booking request failed");
            setSummary(result.summary);
            setMessage(result.message);
            setStatus("success");
            requestAnimationFrame(() => {
                confirmationRef.current?.focus();
                confirmationRef.current?.scrollIntoView({ block: "start" });
            });
        } catch {
            setMessage("We couldn’t confirm receipt of your request. Please try again later; your entries are still here.");
            setStatus("failure");
        } finally {
            submitting.current = false;
        }
    }

    const props = (field: BookingField, hint?: string) => ({
        "aria-invalid": Boolean(errors[field]),
        "aria-describedby": [hint, errors[field] ? `booking-${field}-error` : undefined].filter(Boolean).join(" ") || undefined,
    });
    const error = (field: BookingField) => errors[field] && <p className="booking-field-error" id={`booking-${field}-error`}>{errors[field]}</p>;

    return (
        <div>
            <form ref={formRef} className="booking-form" onSubmit={submit} noValidate aria-labelledby="booking-form-heading" aria-describedby="booking-form-note" aria-busy={status === "pending"} hidden={status === "success"}>
                <h2 id="booking-form-heading">Your consultation preferences.</h2>
                <p id="booking-form-note">Portfolio concept: use example details only, without personal or medical information. Requests are saved for demonstration when configured. No real appointment or email is created. Fields marked * are required.</p>
                {Object.keys(errors).length > 0 && <p className="booking-error-summary" role="alert">Please check the highlighted fields.</p>}
                <fieldset disabled={status === "pending"}>
                    <legend className="booking-sr-only">Consultation request</legend>
                    <div className="booking-field-grid">
                        {personalFields.map((field) => <div className="booking-field" key={field.name}><label htmlFor={`booking-${field.name}`}>{field.label} *</label><input id={`booking-${field.name}`} name={field.name} type={field.type} autoComplete={field.autoComplete} maxLength={field.maxLength} required {...props(field.name)} />{error(field.name)}</div>)}
                        <div className="booking-field"><label htmlFor="booking-treatment">Treatment of interest *</label><select id="booking-treatment" name="treatment" defaultValue="" required {...props("treatment")}><option value="" disabled>Choose an option</option>{bookingTreatments.map((treatment) => <option key={treatment.slug} value={treatment.slug}>{treatment.name}</option>)}</select>{error("treatment")}</div>
                        <div className="booking-field"><label htmlFor="booking-preferredDate">Preferred date *</label><input id="booking-preferredDate" name="preferredDate" type="date" min={minimumDate} required {...props("preferredDate", "booking-date-hint")} /><p className="booking-field-hint" id="booking-date-hint">From tomorrow onwards, in London time. A preference, not live availability.</p>{error("preferredDate")}</div>
                        <div className="booking-field"><label htmlFor="booking-preferredTime">Preferred time *</label><select id="booking-preferredTime" name="preferredTime" defaultValue="" required {...props("preferredTime", "booking-time-hint")}><option value="" disabled>Choose a time window</option>{bookingTimes.map((time) => <option key={time}>{time}</option>)}</select><p className="booking-field-hint" id="booking-time-hint">These are broad preferences, not appointment slots.</p>{error("preferredTime")}</div>
                    </div>
                    <div className="booking-field"><label htmlFor="booking-message">Message (optional)</label><textarea id="booking-message" name="message" rows={4} maxLength={2000} {...props("message", "booking-message-hint")} /><p className="booking-field-hint" id="booking-message-hint">A brief outline is enough. Maximum 2,000 characters.</p>{error("message")}</div>
                    <div className="booking-field"><label className="booking-consent" htmlFor="booking-consent"><input id="booking-consent" name="consent" type="checkbox" required {...props("consent")} /><span>I agree to the example details being stored for this demonstration request, and understand that no real appointment is made or follow-up email sent. *</span></label>{error("consent")}</div>
                    <button className="button" type="submit">{status === "pending" ? "Sending your request…" : "Request a consultation"}</button>
                </fieldset>
                {status === "failure" && <p className="booking-error-summary" role="alert">{message}</p>}
            </form>
            <div role="status" aria-live="polite">{status === "pending" && <p className="booking-status">Sending your consultation request. Please wait.</p>}</div>
            {status === "success" && summary && <div className="booking-confirmation" ref={confirmationRef} tabIndex={-1} role="region" aria-labelledby="booking-confirmation-heading">
                <p className="eyebrow">Request received</p><h2 id="booking-confirmation-heading">Your request has been saved.</h2><p>{message}</p>
                <dl><div><dt>Treatment</dt><dd>{bookingTreatments.find((treatment) => treatment.slug === summary.treatment)?.name}</dd></div><div><dt>Preferred date</dt><dd>{new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeZone: "Europe/London" }).format(new Date(`${summary.preferredDate}T12:00:00Z`))}</dd></div><div><dt>Preferred time</dt><dd>{summary.preferredTime}</dd></div></dl>
                <p>This is not an appointment confirmation. A real practice would contact you separately to agree a date and time.</p>
                <button className="button" type="button" onClick={() => { formRef.current?.reset(); setSummary(undefined); setMessage(""); setErrors({}); setStatus("idle"); requestAnimationFrame(() => (formRef.current?.elements.namedItem("fullName") as HTMLInputElement | null)?.focus()); }}>Submit another request</button>
            </div>}
        </div>
    );
}
