import { z } from "zod";
import { treatments } from "@/data/treatments";

export const bookingTimes = ["Morning", "Midday", "Afternoon", "Late afternoon"] as const;
export const bookingTreatments = [...treatments.map(({ name, slug }) => ({ name, slug })), { name: "Not sure yet", slug: "not-sure" }];

export function londonDate(now = new Date()) {
    const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
    const part = (type: string) => parts.find((item) => item.type === type)?.value;
    return `${part("year")}-${part("month")}-${part("day")}`;
}

export function earliestBookingDate() {
    const date = new Date(`${londonDate()}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() + 1);
    return date.toISOString().slice(0, 10);
}

export const bookingSchema = z.object({
    fullName: z.string({ error: "Enter your full name." }).trim().min(1, "Enter your full name.").max(100, "Use 100 characters or fewer."),
    email: z.string({ error: "Enter your email address." }).trim().max(254, "Use 254 characters or fewer.").pipe(z.email({ error: "Enter a valid email address, such as alex@example.com." })),
    phone: z.string({ error: "Enter your phone number." }).trim().max(30, "Use 30 characters or fewer.").refine((value) => /^[+\d\s().-]+$/.test(value) && value.replace(/\D/g, "").length >= 7 && value.replace(/\D/g, "").length <= 15, "Enter a phone number with 7 to 15 digits."),
    treatment: z.string({ error: "Choose a treatment or Not sure yet." }).refine((value) => bookingTreatments.some((item) => item.slug === value), "Choose a treatment or Not sure yet."),
    preferredDate: z.iso.date({ error: "Choose a valid preferred date." }).refine((value) => value > londonDate(), "Choose a date from tomorrow onwards (London time)."),
    preferredTime: z.enum(bookingTimes, { error: "Choose a time preference." }),
    message: z.string({ error: "Enter text for your message." }).trim().max(2000, "Use 2,000 characters or fewer.").optional().default(""),
    consent: z.literal(true, { error: "Please agree to the request being stored before continuing." }),
});

export type BookingValues = z.infer<typeof bookingSchema>;
export type BookingField = keyof BookingValues;
export type BookingErrors = Partial<Record<BookingField, string>>;
export type BookingSummary = Pick<BookingValues, "treatment" | "preferredDate" | "preferredTime">;
export type BookingResponse =
    | { ok: true; stored: true; message: string; summary: BookingSummary }
    | { ok: false; message: string; errors?: BookingErrors };

export function validateBooking(input: unknown) {
    const result = bookingSchema.safeParse(input);
    const errors: BookingErrors = {};
    if (!result.success) {
        for (const issue of result.error.issues) {
            const field = issue.path[0] as BookingField;
            if (field && !errors[field]) errors[field] = issue.message;
        }
    }
    return { data: result.success ? result.data : undefined, errors };
}
