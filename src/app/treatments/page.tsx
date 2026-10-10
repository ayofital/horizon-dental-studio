import type { Metadata } from "next";
import Button from "@/components/Button";
import TreatmentCard from "@/components/TreatmentCard";
import { treatments } from "@/data/treatments";

export const metadata: Metadata = {
    title: "Dental Treatments | Horizon Dental Studio",
    description: "Explore general dentistry, teeth whitening, clear aligners and dental implants at Horizon Dental Studio, a fictional London practice.",
};

export default function TreatmentsPage() {
    return (
        <main>
            <section className="section treatment-page-intro">
                <div className="container">
                    <p className="eyebrow">Our treatments</p>
                    <h1>Thoughtful care for every stage of your smile.</h1>
                    <p className="hero-description">
                        From everyday dental health to a change you have been considering,
                        explore your options with clear advice and care built around you.
                    </p>
                    <Button href="/book">Book a consultation</Button>
                </div>
            </section>

            <section className="section treatment-overview" aria-labelledby="treatment-options">
                <div className="container">
                    <div className="section-heading">
                        <div>
                            <p className="eyebrow">Find your care</p>
                            <h2 id="treatment-options">Explore your options.</h2>
                        </div>
                        <p>Every treatment begins with a conversation about your goals and an assessment of your oral health.</p>
                    </div>
                    <div className="treatment-grid">
                        {treatments.map((treatment) => (
                            <TreatmentCard key={treatment.slug} treatment={treatment} />
                        ))}
                    </div>
                    <p className="treatment-note">Prices are indicative starting prices. Your individual treatment plan and costs would be explained before you decide.</p>
                </div>
            </section>

            <section className="section final-cta-section">
                <div className="container final-cta">
                    <p className="eyebrow">A clear next step</p>
                    <h2>Not sure where to begin?</h2>
                    <p>A consultation gives you time to ask questions, understand your options and decide what feels right for you.</p>
                    <Button href="/book">Book your consultation</Button>
                </div>
            </section>
        </main>
    );
}
