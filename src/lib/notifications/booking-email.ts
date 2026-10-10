import "server-only";
import { Resend } from "resend";
import { z } from "zod";
import { bookingTreatments, type BookingValues } from "@/lib/booking";

let client: Resend | undefined;

function escapeHtml(value: string) {
    return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
}

export async function notifyBooking(data: BookingValues) {
    const key = process.env.RESEND_API_KEY?.trim();
    const recipient = process.env.BOOKING_NOTIFICATION_EMAIL?.trim();
    const sender = process.env.BOOKING_FROM_EMAIL?.trim();
    if (!key || !z.email().safeParse(recipient).success || !z.email().safeParse(sender).success) {
        console.warn("Booking notification skipped: check server email configuration. Booking remains stored.");
        return "skipped";
    }

    try {
        client ??= new Resend(key);
        const fields = [
            ["Name", data.fullName],
            ["Email", data.email],
            ["Phone", data.phone],
            ["Treatment", bookingTreatments.find((treatment) => treatment.slug === data.treatment)?.name ?? data.treatment],
            ["Preferred date", data.preferredDate],
            ["Preferred time", data.preferredTime],
            ["Message", data.message || "No message provided."],
        ];
        const note = "Fictional portfolio demonstration. This consultation request has been stored; the preferred date and time are not confirmed appointments. A real practice would contact the patient separately. No patient confirmation email is sent by this project.";
        const { error } = await client.emails.send({
            from: `Horizon Dental Studio <${sender}>`,
            to: [recipient!],
            subject: "New consultation request — Horizon Dental Studio",
            text: ["New consultation request", note, ...fields.map(([label, value]) => `${label}: ${value}`)].join("\n\n"),
            html: `<h1>New consultation request</h1><p>${note}</p><dl>${fields.map(([label, value]) => `<dt><strong>${label}</strong></dt><dd style="margin:4px 0 16px;white-space:pre-wrap">${escapeHtml(value)}</dd>`).join("")}</dl>`,
        });
        if (error) throw new Error("Email provider rejected the notification.");
        return "sent";
    } catch {
        console.warn("Booking notification failed. Booking remains stored.");
        return "failed";
    }
}
