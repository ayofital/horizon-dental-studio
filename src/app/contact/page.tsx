import { createPageMetadata } from "@/lib/seo";
import Button from "@/components/Button";
import ContactForm from "@/components/ContactForm";
import { practice } from "@/data/practice";
import "./contact.css";

const title = "Contact";
const description = "Explore contact details, opening hours and a demonstration enquiry form for Horizon Dental Studio, a fictional private dental practice in London.";
export const metadata = createPageMetadata(title, description, "/contact");

export default function ContactPage() {
    return (
        <main id="main-content" tabIndex={-1} className="contact-page">
            <section className="section contact-intro" aria-labelledby="contact-heading">
                <div className="container">
                    <p className="eyebrow">Here to help</p>
                    <h1 id="contact-heading">Good care starts<br />with a conversation.</h1>
                    <p className="contact-lead">Have a question about visiting, treatment options or planning your care? There is space to ask, understand and decide at your own pace.</p>
                    <p>For general enquiries, explore the form below. For a treatment consultation, <a href="/book">book a consultation</a>.</p>
                    <p className="contact-disclosure"><strong>A fictional practice, thoughtfully imagined.</strong> Horizon Dental Studio is a portfolio concept. Contact details and the enquiry form are for demonstration only and are not monitored.</p>
                </div>
            </section>

            <section className="section" aria-labelledby="contact-details-heading">
                <div className="container">
                    <div className="section-heading"><div><p className="eyebrow">Get in touch</p><h2 id="contact-details-heading">A direct connection.</h2></div><p>Example ways to reach the practice. These phone and email details are non-operational.</p></div>
                    <dl className="contact-methods">
                        <div><dt>Phone</dt><dd>{practice.phone}</dd><dd className="contact-method-note">Fictional demonstration number</dd></div>
                        <div><dt>Email</dt><dd>{practice.email}</dd><dd className="contact-method-note">Example address — no messages received</dd></div>
                        <div><dt>Visit</dt><dd>{practice.address.join(", ")}</dd><dd className="contact-method-note">Illustrative practice location</dd></div>
                    </dl>
                </div>
            </section>

            <section className="section contact-enquiry-section" aria-labelledby="contact-form-heading">
                <div className="container contact-enquiry-grid">
                    <aside className="contact-enquiry-copy" aria-labelledby="contact-enquiry-heading">
                        <p className="eyebrow">General enquiries</p><h2 id="contact-enquiry-heading">Let’s make things clearer.</h2>
                        <p>A short message can be a starting point for questions about the practice. An individual treatment recommendation would require a consultation and assessment.</p>
                        <div className="contact-urgent-note"><h3>If your concern is urgent</h3><p>This form is not monitored and is not for urgent dental concerns or medical emergencies. Seek appropriate urgent dental or emergency care where needed.</p></div>
                    </aside>
                    <ContactForm />
                </div>
            </section>

            <section className="section" aria-labelledby="contact-location-heading">
                <div className="container contact-location-grid">
                    <div><p className="eyebrow">Find Horizon</p><h2 id="contact-location-heading">A calm setting in London.</h2><p>An illustrative location for this concept practice, with opening hours designed around everyday schedules.</p><h3>Opening hours</h3><ul className="contact-hours">{practice.hours.map((hours) => <li key={hours}>{hours}</li>)}</ul></div>
                    <div className="contact-location-panel"><p className="eyebrow">Concept location</p><p className="contact-location-name">Brook Street<br />London</p><address>{practice.address.map((line) => <span key={line}>{line}</span>)}</address><p>Location panel for demonstration. No live map or real practice operates through this site.</p></div>
                </div>
            </section>

            <section className="section final-cta-section" aria-labelledby="contact-cta-heading"><div className="container final-cta"><p className="eyebrow">Planning treatment?</p><h2 id="contact-cta-heading">Make time for your next step.</h2><p>A consultation is the place to discuss your priorities, understand your options and plan suitable care.</p><Button href="/book">Book your consultation</Button></div></section>
        </main>
    );
}
