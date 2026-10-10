import type { Testimonial } from "@/data/testimonials";
import Link from "next/link";
import { treatments } from "@/data/treatments";

type TestimonialCardProps = {
    testimonial: Testimonial;
    showDetails?: boolean;
};

export default function TestimonialCard({
                                            testimonial,
                                            showDetails = false,
                                        }: TestimonialCardProps) {
    const treatment = showDetails
        ? treatments.find((item) => item.slug === testimonial.treatmentSlug)
        : undefined;

    return (
        <article className="testimonial-card">
            <p className="testimonial-quote">“{testimonial.quote}”</p>

            <div>
                {showDetails ? <h3>{testimonial.name}</h3> : <strong>{testimonial.name}</strong>}
                <span>{testimonial.treatment}</span>
                {showDetails && (
                    <div className="patient-story-details">
                        <p>{testimonial.outcome}</p>
                        {treatment && <Link href={`/treatments/${treatment.slug}`}>Explore {treatment.name.toLowerCase()}</Link>}
                    </div>
                )}
            </div>
        </article>
    );
}
