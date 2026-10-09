import type { Testimonial } from "@/data/testimonials";

type TestimonialCardProps = {
    testimonial: Testimonial;
};

export default function TestimonialCard({
                                            testimonial,
                                        }: TestimonialCardProps) {
    return (
        <article className="testimonial-card">
            <p className="testimonial-quote">“{testimonial.quote}”</p>

            <div>
                <strong>{testimonial.name}</strong>
                <span>{testimonial.treatment}</span>
            </div>
        </article>
    );
}