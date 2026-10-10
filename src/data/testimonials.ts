export type Testimonial = {
    quote: string;
    name: string;
    treatment: string;
    treatmentSlug: string;
    outcome: string;
};

export const testimonials: Testimonial[] = [
    {
        quote:
            "The whole experience felt calm and professional. Everything was explained clearly and I never felt rushed.",
        name: "Sophie M.",
        treatment: "Clear Aligners",
        treatmentSlug: "clear-aligners",
        outcome: "A clearer understanding of the aligner plan and time to ask questions made the journey feel manageable.",
    },
    {
        quote:
            "I was nervous about treatment, but the team made me feel comfortable from the first appointment.",
        name: "James R.",
        treatment: "Dental Implants",
        treatmentSlug: "dental-implants",
        outcome: "Feeling listened to helped ease initial nerves, with the stages of care explained before each decision.",
    },
    {
        quote:
            "The clinic feels modern without being intimidating. I’m genuinely happy with the result.",
        name: "Priya K.",
        treatment: "Teeth Whitening",
        treatmentSlug: "teeth-whitening",
        outcome: "A welcoming setting and realistic discussion of smile goals supported a positive treatment experience.",
    },
];
