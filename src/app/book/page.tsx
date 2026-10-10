import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import BookingForm from "@/components/BookingForm";
import { earliestBookingDate } from "@/lib/booking";
import "./booking.css";

const title = "Request a Consultation | Horizon Dental Studio";
const description = "Explore a demonstration consultation request at Horizon Dental Studio. Share treatment, date and time preferences for this fictional private dental practice.";
export const metadata: Metadata = { title, description, openGraph: { title, description, type: "website" } };

async function CurrentBookingForm() {
    // The date minimum must reflect the current London date, rather than the build date.
    await connection();
    return <BookingForm minimumDate={earliestBookingDate()} />;
}

export default function BookingPage() {
    return (
        <main className="booking-page">
            <section className="section booking-intro" aria-labelledby="booking-heading"><div className="container"><p className="eyebrow">Your next step</p><h1 id="booking-heading">Time for your questions.<br />Space for your smile.</h1><p className="booking-lead">A consultation starts with listening. Tell us what you would like to explore and choose a date and time that would suit you.</p><p>Preferences help start a conversation. They do not reserve a slot or confirm an appointment.</p><p className="booking-disclosure"><strong>Horizon Dental Studio is a fictional portfolio concept.</strong> This demonstration stores example consultation requests when configured. No email is sent and no real appointment is created. Please use example details only.</p></div></section>
            <section className="section booking-request-section" aria-labelledby="booking-request-heading"><div className="container booking-request-grid"><aside aria-labelledby="booking-request-heading"><p className="eyebrow">Care at your pace</p><h2 id="booking-request-heading">You don’t need all the answers yet.</h2><p>Choose the treatment you are interested in, or select “Not sure yet”. A real consultation would assess your oral health, explain appropriate options and give you time to decide.</p><Link href="/treatments">Explore our treatments</Link><div className="booking-guidance-note"><h3>A preference, not a promise.</h3><p>Date and time choices are illustrative. A practice would review availability before offering an appointment.</p><p>For general questions, <Link href="/contact">visit our Contact page</Link>. This demo cannot respond to urgent dental concerns.</p></div></aside><Suspense fallback={<div className="booking-form"><h2>Your consultation preferences.</h2><p role="status">Preparing the request form…</p></div>}><CurrentBookingForm /></Suspense></div></section>
            <section className="section" aria-labelledby="booking-next-heading"><div className="container"><div className="section-heading"><div><p className="eyebrow">What happens next</p><h2 id="booking-next-heading">A considered path to care.</h2></div><p>The intended process at a real practice. This demo stores the request only and does not trigger these follow-up steps.</p></div><ol className="booking-next-steps"><li><h3>Share your request</h3><p>Outline your priorities and preferred date and time.</p></li><li><h3>The practice reviews</h3><p>The team checks your preferences against its schedule.</p></li><li><h3>A conversation follows</h3><p>The team contacts you to discuss a suitable appointment.</p></li><li><h3>Confirm separately</h3><p>Your appointment is confirmed only once the details are agreed.</p></li></ol></div></section>
        </main>
    );
}
