export type Treatment = {
    name: string;
    slug: string;
    description: string;
    price: string;
};

export const treatments: Treatment[] = [
    {
        name: "General Dentistry",
        slug: "general-dentistry",
        description:
            "Routine care designed to protect your oral health and prevent future problems.",
        price: "From £75",
    },
    {
        name: "Teeth Whitening",
        slug: "teeth-whitening",
        description:
            "Professional whitening treatments for a brighter and more confident smile.",
        price: "From £350",
    },
    {
        name: "Clear Aligners",
        slug: "clear-aligners",
        description:
            "Discreet orthodontic treatment designed to gradually straighten your smile.",
        price: "From £2,500",
    },
    {
        name: "Dental Implants",
        slug: "dental-implants",
        description:
            "Long-term tooth replacement solutions designed for comfort and confidence.",
        price: "From £2,900",
    },
];