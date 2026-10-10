import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/Button";
import FAQItem from "@/components/FAQItem";
import { faqCategories, faqs } from "@/data/faqs";
import "./faq.css";

const title = "Frequently Asked Questions | Horizon Dental Studio";
const description = "Find clear answers about appointments, treatment options, fees and aftercare at Horizon Dental Studio, a fictional private dental practice concept.";

export const metadata: Metadata = {
    title,
    description,
    openGraph: { title, description, type: "website" },
};

export default function FAQPage() {
    return (
        <main className="faq-page">
            <section className="section faq-page-intro" aria-labelledby="faq-heading">
                <div className="container">
                    <p className="eyebrow">Clear answers</p>
                    <h1 id="faq-heading">A little clarity.<br />A more comfortable start.</h1>
                    <p className="faq-page-lead">From your first conversation to care after treatment, knowing what to expect can help you feel more at ease. Explore the questions we hear most often.</p>
                    <Link className="faq-contact-link" href="/contact">Have another question? Contact the team</Link>
                    <p className="faq-concept-note">Horizon Dental Studio is a fictional concept project. These answers illustrate a practice approach, rather than live services or individual clinical advice.</p>
                </div>
            </section>

            <div className="container faq-page-content">
                <nav className="faq-category-nav" aria-label="FAQ categories">
                    <p className="eyebrow">Find your answer</p>
                    <ul>
                        {faqCategories.map((category) => (
                            <li key={category.id}><a href={`#faq-${category.id}`}>{category.name}</a></li>
                        ))}
                    </ul>
                </nav>
                <div className="faq-category-list">
                    {faqCategories.map((category) => (
                        <section className="faq-category" key={category.id} aria-labelledby={`faq-${category.id}`}>
                            <h2 id={`faq-${category.id}`} tabIndex={-1}>{category.name}</h2>
                            <p>{category.description}</p>
                            <div className="faq-list">
                                {faqs.filter((faq) => faq.category === category.id).map((faq) => (
                                    <FAQItem key={faq.question} faq={faq} />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </div>

            <section className="section" aria-labelledby="faq-contact-heading">
                <div className="container faq-contact-section">
                    <div>
                        <p className="eyebrow">Space for your questions</p>
                        <h2 id="faq-contact-heading">Some questions are personal.</h2>
                        <p>If your question is not covered here, a conversation with the practice is the next step. Individual treatment advice would need an assessment.</p>
                    </div>
                    <Button href="/contact">Contact the team</Button>
                </div>
            </section>

            <section className="section final-cta-section" aria-labelledby="faq-cta-heading">
                <div className="container final-cta">
                    <p className="eyebrow">Ready when you are</p>
                    <h2 id="faq-cta-heading">Start with a conversation.</h2>
                    <p>Bring your questions, discuss your priorities and explore suitable options at your own pace.</p>
                    <Button href="/book">Book your consultation</Button>
                </div>
            </section>
        </main>
    );
}
