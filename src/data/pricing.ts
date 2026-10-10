export type PricingItem = {
    name: string;
    price: string;
    description: string;
    href?: string;
};

export const pricingCategories = [
    {
        id: "general",
        name: "General dentistry",
        description: "Everyday care to protect your teeth and gums.",
        slugs: ["general-dentistry"],
    },
    {
        id: "cosmetic",
        name: "Cosmetic dentistry",
        description: "Explore a brighter smile with a plan suited to you.",
        slugs: ["teeth-whitening"],
    },
    {
        id: "orthodontics",
        name: "Orthodontics",
        description: "Individual planning for a straighter smile.",
        slugs: ["clear-aligners"],
    },
    {
        id: "restorative",
        name: "Restorative & implant dentistry",
        description: "Discuss your options for replacing missing teeth.",
        slugs: ["dental-implants"],
    },
];

export const consultationPrices: PricingItem[] = [
    {
        name: "New patient consultation",
        price: "From £95",
        description: "An initial assessment, a conversation about your priorities and advice on next steps. Separate from the routine examination listed below.",
    },
    {
        name: "Emergency consultation",
        price: "From £95",
        description: "Assessment of an urgent dental concern and advice on suitable care. Treatment and any X-rays are charged separately; appointment availability varies.",
    },
    {
        name: "Cosmetic consultation",
        price: "From £75",
        description: "Discuss your smile goals, suitability and possible treatment options. Any further investigations and treatment are priced separately.",
    },
];
