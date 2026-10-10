import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Button from "@/components/Button";
import FAQItem from "@/components/FAQItem";
import { treatments } from "@/data/treatments";

type TreatmentPageProps = {
    params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
    return treatments.map((treatment) => ({ slug: treatment.slug }));
}

function getTreatment(slug: string) {
    const treatment = treatments.find((item) => item.slug === slug);
    if (!treatment) notFound();
    return treatment;
}

export async function generateMetadata({ params }: TreatmentPageProps): Promise<Metadata> {
    const { slug } = await params;
    const treatment = getTreatment(slug);
    const title = `${treatment.name} | Horizon Dental Studio`;

    return {
        title,
        description: treatment.description,
        openGraph: { title, description: treatment.description, type: "website" },
    };
}

export default async function TreatmentPage({ params }: TreatmentPageProps) {
    const { slug } = await params;
    const treatment = getTreatment(slug);

    return (
        <main>
            <section className="section treatment-page-intro">
                <div className="container">
                    <nav className="treatment-breadcrumb" aria-label="Breadcrumb">
                        <Link href="/treatments">Treatments</Link>
                        <span aria-hidden="true"> / </span>
                        <span aria-current="page">{treatment.name}</span>
                    </nav>
                    <p className="eyebrow">Care designed around you</p>
                    <h1>{treatment.name}</h1>
                    <p className="hero-description">{treatment.description}</p>
                    <div className="hero-actions">
                        <Button href="/book">{treatment.cta}</Button>
                        <p className="treatment-starting-price">{treatment.price}</p>
                    </div>
                    <p className="treatment-note">Indicative starting price. A personal assessment is needed to confirm suitability and final costs.</p>
                </div>
            </section>

            <section className="section">
                <div className="container treatment-detail-grid">
                    <div className="treatment-copy">
                        <p className="eyebrow">An informed choice</p>
                        <h2>Understanding your care.</h2>
                        <p>{treatment.longDescription}</p>
                        <h3>Who is it suitable for?</h3>
                        <p>{treatment.suitableFor}</p>
                    </div>
                    <aside className="treatment-benefits" aria-labelledby="benefits-heading">
                        <h2 id="benefits-heading">What you can expect</h2>
                        <ul>
                            {treatment.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
                        </ul>
                    </aside>
                </div>
            </section>

            <section className="section why-section">
                <div className="container why-grid">
                    <div>
                        <p className="eyebrow">Step by step</p>
                        <h2>Your treatment journey.</h2>
                    </div>
                    <ol className="treatment-process">
                        {treatment.process.map((step) => (
                            <li key={step.title}>
                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section className="section">
                <div className="container faq-layout">
                    <div className="faq-intro">
                        <p className="eyebrow">Common questions</p>
                        <h2>A little more clarity.</h2>
                        <p>Explore questions about {treatment.name.toLowerCase()} before your consultation.</p>
                    </div>
                    <div className="faq-list">
                        {treatment.faqs.map((faq) => <FAQItem key={faq.question} faq={faq} />)}
                    </div>
                </div>
            </section>

            <section className="section final-cta-section">
                <div className="container final-cta">
                    <p className="eyebrow">Ready when you are</p>
                    <h2>Let’s talk about your smile.</h2>
                    <p>Discuss your goals, ask questions and understand your options before making a decision.</p>
                    <Button href="/book">{treatment.cta}</Button>
                </div>
            </section>
        </main>
    );
}
