"use client";

import { useRef, useState, type FormEvent } from "react";
import { contactLimits, contactSubjects, validateContact, type ContactErrors, type ContactField } from "@/lib/contact";

const fields = [
    { name: "fullName", label: "Full name", type: "text", autoComplete: "name", required: true },
    { name: "email", label: "Email", type: "email", autoComplete: "email", required: true },
    { name: "phone", label: "Phone (optional)", type: "tel", autoComplete: "tel", required: false },
] as const;

export default function ContactForm() {
    const [errors, setErrors] = useState<ContactErrors>({});
    const [status, setStatus] = useState<"idle" | "pending" | "success" | "failure">("idle");
    const [message, setMessage] = useState("");
    const submitting = useRef(false);

    function showErrors(form: HTMLFormElement, nextErrors: ContactErrors) {
        setErrors(nextErrors);
        const field = Object.keys(nextErrors)[0];
        const element = form.elements.namedItem(field);
        if (element instanceof HTMLElement) element.focus();
    }

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (submitting.current || status === "success") return;
        const form = event.currentTarget;
        const { values, errors: nextErrors } = validateContact(Object.fromEntries(new FormData(form)));
        setMessage("");
        setStatus("idle");
        if (Object.keys(nextErrors).length) {
            showErrors(form, nextErrors);
            return;
        }
        setErrors({});
        submitting.current = true;
        setStatus("pending");
        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
                signal: AbortSignal.timeout(15000),
            });
            const result = await response.json();
            if (response.status === 422 && result.errors) {
                showErrors(form, result.errors);
                setStatus("idle");
                return;
            }
            if (!response.ok || result.demo !== true) throw new Error("Submission failed");
            setMessage(result.message);
            setStatus("success");
        } catch {
            setMessage("We couldn’t complete the demo. Your message has not been sent. Please try again; your entries are still here.");
            setStatus("failure");
        } finally {
            submitting.current = false;
        }
    }

    const errorProps = (field: ContactField) => ({
        "aria-invalid": Boolean(errors[field]),
        "aria-describedby": errors[field] ? `contact-${field}-error` : undefined,
    });

    return (
        <form className="contact-form" onSubmit={submit} noValidate aria-labelledby="contact-form-heading" aria-describedby="contact-form-note" aria-busy={status === "pending"}>
            <h2 id="contact-form-heading">A question on your mind?</h2>
            <p id="contact-form-note">This is a demonstration form. Nothing is sent or saved. Use example details and avoid sharing personal or medical information. Fields marked * are required.</p>
            {Object.keys(errors).length > 0 && <p className="contact-error-summary" role="alert">Please check the highlighted fields.</p>}
            <fieldset disabled={status === "pending" || status === "success"}>
                <legend className="contact-sr-only">Your enquiry</legend>
                <div className="contact-field-grid">
                    {fields.map((field) => (
                        <div className="contact-field" key={field.name}>
                            <label htmlFor={`contact-${field.name}`}>{field.label}{field.required && " *"}</label>
                            <input id={`contact-${field.name}`} name={field.name} type={field.type} autoComplete={field.autoComplete} required={field.required} maxLength={contactLimits[field.name]} {...errorProps(field.name)} />
                            {errors[field.name] && <p className="contact-field-error" id={`contact-${field.name}-error`}>{errors[field.name]}</p>}
                        </div>
                    ))}
                    <div className="contact-field">
                        <label htmlFor="contact-subject">Subject *</label>
                        <select id="contact-subject" name="subject" required defaultValue="" {...errorProps("subject")}>
                            <option value="" disabled>Choose a subject</option>
                            {contactSubjects.map((subject) => <option key={subject}>{subject}</option>)}
                        </select>
                        {errors.subject && <p className="contact-field-error" id="contact-subject-error">{errors.subject}</p>}
                    </div>
                </div>
                <div className="contact-field">
                    <label htmlFor="contact-message">Message *</label>
                    <textarea id="contact-message" name="message" rows={6} required maxLength={contactLimits.message} {...errorProps("message")} aria-describedby={`contact-message-hint${errors.message ? " contact-message-error" : ""}`} />
                    <p id="contact-message-hint" className="contact-field-hint">A brief outline is enough. Maximum 2,000 characters.</p>
                    {errors.message && <p className="contact-field-error" id="contact-message-error">{errors.message}</p>}
                </div>
                <button className="button" type="submit">{status === "pending" ? "Checking your example…" : status === "success" ? "Demo completed" : "Submit demo enquiry"}</button>
            </fieldset>
            <div role="status" aria-live="polite" className="contact-form-status">
                {status === "pending" && <p>Checking your example enquiry. Please wait.</p>}
                {status === "success" && <p className="contact-success">{message}</p>}
            </div>
            {status === "failure" && <p className="contact-error-summary" role="alert">{message}</p>}
        </form>
    );
}
