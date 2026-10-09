export type Testimonial = {
    quote: string;
    name: string;
    treatment: string;
};

export const testimonials: Testimonial[] = [
    {
        quote:
            "The whole experience felt calm and professional. Everything was explained clearly and I never felt rushed.",
        name: "Sophie M.",
        treatment: "Clear Aligners",
    },
    {
        quote:
            "I was nervous about treatment, but the team made me feel comfortable from the first appointment.",
        name: "James R.",
        treatment: "Dental Implants",
    },
    {
        quote:
            "The clinic feels modern without being intimidating. I’m genuinely happy with the result.",
        name: "Priya K.",
        treatment: "Teeth Whitening",
    },
];