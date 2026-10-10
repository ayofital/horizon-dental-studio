import "server-only";
import type { BookingValues } from "@/lib/booking";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function saveBooking(data: BookingValues) {
    const client = getSupabaseServerClient();
    try {
        const { error } = await client.from("bookings").insert({
            name: data.fullName,
            email: data.email,
            phone: data.phone,
            treatment: data.treatment,
            preferred_date: data.preferredDate,
            preferred_time: data.preferredTime,
            message: data.message,
            consent: data.consent,
        });
        // Do not retain or expose the database's error details or submitted personal data.
        if (error) throw new Error("Booking persistence failed.");
    } catch {
        throw new Error("Booking persistence failed.");
    }
}
