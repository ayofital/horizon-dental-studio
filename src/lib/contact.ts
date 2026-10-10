import { z } from "zod";

export const contactSubjects = ["General enquiry", "Visiting the practice", "Treatment question", "Other"] as const;
export const contactLimits = { fullName: 100, email: 254, phone: 30, subject: 60, message: 2000 };
export type ContactField = keyof typeof contactLimits;
export type ContactValues = Record<ContactField, string>;
export type ContactErrors = Partial<Record<ContactField, string>>;

export const contactResponseSchema = z.union([
    z.object({ demo: z.literal(true), message: z.string().min(1).max(1000) }),
    z.object({ errors: z.partialRecord(z.enum(Object.keys(contactLimits) as ContactField[]), z.string().min(1).max(300)).refine((errors) => Object.keys(errors).length > 0) }),
]);

export function validateContact(input: unknown): { values: ContactValues; errors: ContactErrors } {
    const source = input && typeof input === "object" && !Array.isArray(input)
        ? input as Record<string, unknown> : {};
    const values: ContactValues = { fullName: "", email: "", phone: "", subject: "", message: "" };
    const errors: ContactErrors = {};
    for (const field of Object.keys(contactLimits) as ContactField[]) {
        const raw = source[field];
        values[field] = typeof raw === "string" ? raw.trim() : "";
        if (raw !== undefined && typeof raw !== "string") errors[field] = "Please enter text in this field.";
        else if (values[field].length > contactLimits[field]) errors[field] = `Use ${contactLimits[field]} characters or fewer.`;
    }
    if (!values.fullName) errors.fullName = "Enter your full name.";
    if (!values.email) errors.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "Enter a valid email address, such as alex@example.com.";
    if (values.phone && (!/^[+\d\s().-]+$/.test(values.phone) || values.phone.replace(/\D/g, "").length < 7)) errors.phone = "Enter a phone number with at least 7 digits, or leave it blank.";
    if (!contactSubjects.some((subject) => subject === values.subject)) errors.subject = "Choose a subject for your enquiry.";
    if (!values.message) errors.message = "Enter a short message about your enquiry.";
    return { values, errors };
}
