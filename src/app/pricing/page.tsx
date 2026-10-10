import type { Metadata } from "next";
import Button from "@/components/Button";
import PricingList from "@/components/PricingList";
import { consultationPrices, pricingCategories } from "@/data/pricing";
import { treatments } from "@/data/treatments";
import "./pricing.css";

const title = "Treatment Prices | Horizon Dental Studio";
const description = "Explore indicative treatment and consultation prices, with clear guidance on fees at Horizon Dental Studio, a fictional private dental practice in London.";

export const metadata: Metadata = {
    title,
    description,
    openGraph: { title, description, type: "website" },
};

export default function PricingPage() {
    return (
        <main className="pricing-page">
            <section className="section pricing-intro" aria-labelledby="pricing-heading">
                <div className="container">
                    <p className="eyebrow">Transparent pricing</p>
                    <h1 id="pricing-heading">Clear fees.<br />Space to decide.</h1>
                    <p className="pricing-lead">Knowing what to expect is part of feeling comfortable with your care. Explore our indicative starting prices before taking the next step.</p>
                    <p>These are example fees for a fictional practice. Your individual needs would be assessed before a full treatment plan and exact costs are confirmed.</p>
                    <Button href="/book">Book a consultation</Button>
                </div>
            </section>

            <section className="section" aria-labelledby="consultation-heading">
                <div className="container pricing-section-grid">
                    <div className="pricing-section-intro">
                        <p className="eyebrow">Start with a conversation</p>
                        <h2 id="consultation-heading">Consultations.</h2>
                        <p>Time to discuss your concerns, understand your oral health and explore suitable options. These illustrative fees cover the consultation, rather than subsequent treatment.</p>
                    </div>
                    <PricingList items={consultationPrices} />
                </div>
            </section>

            <section className="section pricing-treatment-section" aria-labelledby="treatment-fees-heading">
                <div className="container">
                    <div className="section-heading">
                        <div>
                            <p className="eyebrow">Your treatment options</p>
                            <h2 id="treatment-fees-heading">Care, clearly priced.</h2>
                        </div>
                        <p>Starting prices give you a guide, rather than a quote. Follow a treatment link to understand the care involved.</p>
                    </div>
                    <div className="pricing-categories">
                        {pricingCategories.map((category) => (
                            <section className="pricing-section-grid" key={category.id} aria-labelledby={`pricing-${category.id}`}>
                                <div className="pricing-section-intro">
                                    <h3 id={`pricing-${category.id}`}>{category.name}</h3>
                                    <p>{category.description}</p>
                                </div>
                                <PricingList items={treatments
                                    .filter((treatment) => category.slugs.includes(treatment.slug))
                                    .map((treatment) => ({
                                        name: treatment.name,
                                        price: treatment.price,
                                        description: treatment.slug === "general-dentistry"
                                            ? "Starting price for a routine examination. Hygiene visits, X-rays and restorative care are charged separately."
                                            : treatment.description,
                                        href: `/treatments/${treatment.slug}`,
                                    }))} />
                            </section>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section" aria-labelledby="payment-heading">
                <div className="container pricing-section-grid">
                    <div className="pricing-section-intro">
                        <p className="eyebrow">Planning your care</p>
                        <h2 id="payment-heading">Payment, explained.</h2>
                    </div>
                    <div className="pricing-payment-copy">
                        <p>Some treatments may be suitable for staged payments. Any available payment or finance options, eligibility and terms would be explained during consultation before you make a decision.</p>
                        <p>This concept site does not offer a finance product or promise approval. Discussing payment options would not commit you to treatment.</p>
                    </div>
                </div>
            </section>

            <section className="container pricing-disclaimer" aria-labelledby="pricing-disclaimer-heading">
                <p className="eyebrow">Before you decide</p>
                <h2 id="pricing-disclaimer-heading">A guide to fees, not a final quote.</h2>
                <p>Final fees depend on your individual treatment needs. Assessment, investigations and additional procedures may affect the total. Exact costs and what is included would be confirmed in a written treatment plan before you agree to proceed.</p>
                <p><strong>Horizon Dental Studio is a fictional portfolio project.</strong> All fees shown are illustrative examples, not an offer of dental care or finance.</p>
            </section>

            <section className="section final-cta-section" aria-labelledby="pricing-cta-heading">
                <div className="container final-cta">
                    <p className="eyebrow">Your next step</p>
                    <h2 id="pricing-cta-heading">Let’s make your options clear.</h2>
                    <p>A consultation is a chance to ask questions, discuss costs and understand the care that may be right for you.</p>
                    <Button href="/book">Book your consultation</Button>
                </div>
            </section>
        </main>
    );
}
