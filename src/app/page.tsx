import { createPageMetadata, siteDescription } from "@/lib/seo";
import FAQItem from "@/components/FAQItem";
import { faqPreview as faqs } from "@/data/faqs";
import TeamCard from "@/components/TeamCard";
import TestimonialCard from "@/components/TestimonialCard";
import { team } from "@/data/team";
import { testimonials } from "@/data/testimonials";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import TreatmentCard from "@/components/TreatmentCard";
import { treatments } from "@/data/treatments";

export const metadata = createPageMetadata("Dental Practice Concept", siteDescription, "/");

export default function Home() {
  return (
      <main id="main-content" tabIndex={-1}>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-content">
              <p className="eyebrow">A fictional dental practice · London</p>

              <h1>Confident smiles start with exceptional care.</h1>

              <p className="hero-description">
                Modern dental care designed around comfort, trust and long-term
                results.
              </p>

              <div className="hero-actions">
                <Button href="/book">Book a consultation</Button>

                <Link href="/treatments" className="secondary-link">
                  Explore treatments
                </Link>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-image-wrapper">
                <Image
                    src="/images/clinic-hero.jpg"
                    alt="Dentist speaking with a patient seated in a dental treatment room"
                    fill
                    preload
                    className="hero-image"
                    sizes="(max-width: 732px) calc(100vw - 32px), (max-width: 960px) 700px, (max-width: 1232px) calc(47.5vw - 45.6px), 540px"
                />
              </div>

              <div className="hero-card">
                <strong>Your pace</strong>
                <span>Thoughtful care</span>
              </div>
            </div>
          </div>
        </section>

        <section className="trust-strip">
          <div className="container trust-grid">
            <div>
              <strong>Clear advice</strong>
              <span>Understand your options</span>
            </div>

            <div>
              <strong>Comfort first</strong>
              <span>Care at your pace</span>
            </div>

            <div>
              <strong>Modern care</strong>
              <span>Thoughtful planning</span>
            </div>

            <div>
              <strong>London concept</strong>
              <span>An illustrative setting</span>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Our treatments</p>
                <h2>Care designed around you.</h2>
              </div>

              <p>
                From routine check-ups to advanced cosmetic treatments, we offer
                personalised care for every stage of your smile.
              </p>
            </div>

            <div className="treatment-grid">
              {treatments.map((treatment) => (
                  <TreatmentCard
                      key={treatment.slug}
                      treatment={treatment}
                  />
              ))}
            </div>
          </div>
        </section>

        <section className="section why-section">
          <div className="container why-grid">
            <div>
              <p className="eyebrow">Why Horizon</p>
              <h2>Thoughtful dentistry without the pressure.</h2>
            </div>

            <div className="why-list">
              <div>
                <h3>Clear advice</h3>
                <p>
                  We explain your options simply so you can make informed
                  decisions about your care.
                </p>
              </div>

              <div>
                <h3>Modern treatment</h3>
                <p>
                  We combine contemporary techniques with a patient-first
                  approach.
                </p>
              </div>

              <div>
                <h3>Comfort first</h3>
                <p>
                  Every appointment is designed to feel calm, respectful and
                  unhurried.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Meet the team</p>
                <h2>Experienced care, delivered personally.</h2>
              </div>

              <p>
                Meet our fictional clinicians, illustrating clear communication
                and thoughtful patient care.
              </p>
            </div>

            <div className="team-grid">
              {team.map((member) => (
                  <TeamCard key={member.name} member={member} />
              ))}
            </div>
          </div>
        </section>

        <section className="section testimonials-section">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Patient stories</p>
                <h2>Illustrative patient stories.</h2>
              </div>

              <p>
                Fictional examples of comfortable care, clear advice and treatment
                experiences built around trust.
              </p>
            </div>

            <div className="testimonial-grid">
              {testimonials.map((testimonial) => (
                  <TestimonialCard
                      key={testimonial.name}
                      testimonial={testimonial}
                  />
              ))}
            </div>
          </div>
        </section>

        <section className="section pricing-cta-section">
          <div className="container pricing-cta">
            <div>
              <p className="eyebrow">Transparent pricing</p>

              <h2>Know what to expect before treatment begins.</h2>

              <p>
                We believe treatment costs should be clear. Explore indicative pricing
                for our most popular treatments before your consultation.
              </p>
            </div>

            <Button href="/pricing">View pricing</Button>
          </div>
        </section>

        <section className="section">
          <div className="container faq-layout">
            <div className="faq-intro">
              <p className="eyebrow">Common questions</p>

              <h2>Everything you need to know before visiting.</h2>

              <p>
                If your question is not covered here, our team will be happy to help.
              </p>
            </div>

            <div className="faq-list">
              {faqs.map((faq) => (
                  <FAQItem key={faq.question} faq={faq} />
              ))}
            </div>
          </div>
        </section>

        <section className="section final-cta-section">
          <div className="container final-cta">
            <p className="eyebrow">Ready when you are</p>

            <h2>Start your journey to a healthier, more confident smile.</h2>

            <p>
              Book a consultation and speak with our team about the treatment that is
              right for you.
            </p>

            <Button href="/book">Book your consultation</Button>
          </div>
        </section>
      </main>
  );
}
