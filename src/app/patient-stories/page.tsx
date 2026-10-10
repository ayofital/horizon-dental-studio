import { createPageMetadata } from "@/lib/seo";
import Button from "@/components/Button";
import TestimonialCard from "@/components/TestimonialCard";
import { testimonials } from "@/data/testimonials";
import "./patient-stories.css";

const title = "Patient Stories";
const description = "Explore fictional patient journeys illustrating thoughtful communication, comfort and personalised dental care at Horizon Dental Studio, a London concept practice.";

export const metadata = createPageMetadata(title, description, "/patient-stories");

export default function PatientStoriesPage() {
    return (
        <main id="main-content" tabIndex={-1} className="patient-stories-page">
            <section className="section patient-stories-intro" aria-labelledby="stories-heading">
                <div className="container">
                    <p className="eyebrow">Patient experiences</p>
                    <h1 id="stories-heading">Care you can feel comfortable with.</h1>
                    <p className="patient-stories-lead">Every treatment journey is personal. These illustrative stories explore the conversations, reassurance and thoughtful planning behind a more comfortable dental experience.</p>
                    <div className="patient-stories-disclosure">
                        <p><strong>A note about these stories</strong></p>
                        <p>Horizon Dental Studio is a fictional concept project. All testimonials and patient stories are fictional examples created for demonstration purposes, rather than real or independently verified reviews.</p>
                    </div>
                </div>
            </section>

            <section className="section testimonials-section" aria-labelledby="stories-examples-heading">
                <div className="container">
                    <div className="section-heading">
                        <div>
                            <p className="eyebrow">Illustrative journeys</p>
                            <h2 id="stories-examples-heading">Different needs. Thoughtful care.</h2>
                        </div>
                        <p>Examples of how clear advice and personal attention can shape a treatment experience. They do not predict individual clinical results.</p>
                    </div>
                    <div className="testimonial-grid">
                        {testimonials.map((testimonial) => (
                            <TestimonialCard key={testimonial.name} testimonial={testimonial} showDetails />
                        ))}
                    </div>
                </div>
            </section>

            <section className="section" aria-labelledby="stories-values-heading">
                <div className="container why-grid">
                    <div className="patient-stories-copy">
                        <p className="eyebrow">Behind the experience</p>
                        <h2 id="stories-values-heading">Trust grows through the details.</h2>
                        <p>Feeling confident about care starts with knowing what is happening, why it matters and what comes next.</p>
                    </div>
                    <div className="why-list">
                        <div>
                            <h3>Make the plan understandable</h3>
                            <p>A useful consultation connects your priorities with appropriate options. The stages, costs and limitations should be clear before you decide.</p>
                        </div>
                        <div>
                            <h3>Make room for how you feel</h3>
                            <p>Questions and worries deserve attention. A thoughtful pace, check-ins and opportunities to pause help make appointments feel more comfortable.</p>
                        </div>
                        <div>
                            <h3>Look beyond the appointment</h3>
                            <p>Practical aftercare and a clear review plan support the everyday habits that matter for long-term oral health.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section final-cta-section" aria-labelledby="stories-cta-heading">
                <div className="container final-cta">
                    <p className="eyebrow">Your own next step</p>
                    <h2 id="stories-cta-heading">Start with what matters to you.</h2>
                    <p>A consultation gives you space to discuss your priorities, ask questions and explore suitable care without pressure.</p>
                    <Button href="/book">Book your consultation</Button>
                </div>
            </section>
        </main>
    );
}
