import { validateBooking, type BookingResponse } from "@/lib/booking";
import { saveBooking } from "@/lib/booking-store";
import { SupabaseConfigurationError } from "@/lib/supabase/server";

function reply(body: BookingResponse, status = 200) {
    return Response.json(body, { status });
}

export async function POST(request: Request) {
    try {
        const body = await request.text();
        if (body.length > 16000) return reply({ ok: false, message: "Your request is too long. Please shorten it and try again." }, 413);
        let input: unknown;
        try {
            input = JSON.parse(body);
        } catch {
            return reply({ ok: false, message: "The request could not be read. Please try again." }, 400);
        }
        const { data, errors } = validateBooking(input);
        if (!data) return reply({ ok: false, message: "Please check your request details.", errors }, 422);

        await saveBooking(data);
        return reply({ ok: true, stored: true, message: "Your consultation request has been received. Your preferred date and time are not confirmed appointments. This fictional practice does not send follow-up emails.", summary: { treatment: data.treatment, preferredDate: data.preferredDate, preferredTime: data.preferredTime } }, 201);
    } catch (error) {
        const configurationMissing = error instanceof SupabaseConfigurationError;
        console.error(configurationMissing ? "Booking request unavailable: check server Supabase configuration." : "Booking request failed during processing or persistence.");
        return reply({ ok: false, message: configurationMissing ? "Consultation requests are temporarily unavailable. Please try again later." : "We couldn’t confirm receipt of your request. Please try again later." }, configurationMissing ? 503 : 500);
    }
}
