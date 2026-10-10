import type { FAQ } from "@/data/faqs";

export type Treatment = {
    name: string;
    slug: string;
    description: string;
    price: string;
    longDescription: string;
    benefits: string[];
    suitableFor: string;
    process: { title: string; description: string }[];
    faqs: FAQ[];
    cta: string;
};

export const treatments: Treatment[] = [
    {
        name: "General Dentistry",
        slug: "general-dentistry",
        description:
            "Routine care designed to protect your oral health and prevent future problems.",
        price: "From £75",
        longDescription: "A healthy smile starts with regular, thoughtful care. General dentistry brings together check-ups, hygiene advice and restorative treatment, with time to discuss concerns and understand your options.",
        benefits: ["A clearer understanding of your oral health", "Preventive care tailored to your routine", "A personal plan for any treatment needed"],
        suitableFor: "People looking for routine dental care, returning after a break or wanting to discuss a concern about their teeth or gums. Your dentist will assess what care is appropriate for you.",
        process: [
            { title: "Listen and assess", description: "Discuss your concerns and dental history before an examination of your teeth and gums." },
            { title: "Explain your options", description: "Review the findings together and agree on any further care, with costs explained in advance." },
            { title: "Plan ongoing care", description: "Receive practical care advice and agree on a review schedule suited to your needs." },
        ],
        faqs: [
            { question: "What does the starting price cover?", answer: "The indicative £75 starting price is for a routine examination. Hygiene visits, X-rays and restorative treatment are priced separately and would be discussed before proceeding." },
            { question: "Can I visit if I feel nervous?", answer: "Yes. Tell the team about your concerns when requesting an appointment so they can discuss how to make your visit more comfortable." },
        ],
        cta: "Book a dental consultation",
    },
    {
        name: "Teeth Whitening",
        slug: "teeth-whitening",
        description:
            "Professional whitening treatments for a brighter and more confident smile.",
        price: "From £350",
        longDescription: "Explore a brighter smile with a whitening plan designed around your goals. A consultation comes first, so your dentist can assess your oral health, explain suitable options and set realistic expectations.",
        benefits: ["A whitening plan matched to your goals", "Professional advice before treatment", "Guidance on caring for your smile afterwards"],
        suitableFor: "Adults who would like to discuss the colour of their natural teeth. Suitability and expected results depend on your oral health and existing dental work and are assessed at consultation.",
        process: [
            { title: "Discuss your smile", description: "Talk about the change you would like and review your dental history and oral health." },
            { title: "Agree on a plan", description: "Your dentist explains suitable whitening options, the expected result and the total cost." },
            { title: "Treatment and review", description: "Follow your personalised treatment instructions and discuss progress and aftercare at review." },
        ],
        faqs: [
            { question: "Will whitening suit my smile?", answer: "Your dentist will assess your natural teeth and any existing dental work before recommending a plan. The outcome varies from person to person." },
            { question: "Is the result permanent?", answer: "Colour can change over time. Your dentist will explain aftercare and whether any future maintenance is appropriate for you." },
        ],
        cta: "Discuss teeth whitening",
    },
    {
        name: "Clear Aligners",
        slug: "clear-aligners",
        description:
            "Discreet orthodontic treatment designed to gradually straighten your smile.",
        price: "From £2,500",
        longDescription: "Clear aligners offer a discreet way to explore a straighter smile. Treatment is planned individually, with an assessment of your teeth and bite, clear expectations and regular reviews along the way.",
        benefits: ["A discreet treatment option", "An individual plan for your smile", "Regular reviews to monitor progress"],
        suitableFor: "People interested in straightening their teeth who can follow a prescribed wear schedule. An assessment is needed to establish whether aligners are suitable for your teeth and bite.",
        process: [
            { title: "Assess your teeth and bite", description: "Discuss your goals and complete the records needed to assess treatment options." },
            { title: "Review your treatment plan", description: "Understand the proposed changes, likely duration, costs and responsibilities before deciding." },
            { title: "Align, review and retain", description: "Follow your prescribed aligner schedule, attend reviews and discuss retention after treatment." },
        ],
        faqs: [
            { question: "How long does treatment take?", answer: "The timeline depends on the changes needed and your individual plan. Your dentist will discuss an estimated duration after assessing your teeth and bite." },
            { question: "What happens after treatment?", answer: "Your dentist will explain a retention plan to help maintain the result and any ongoing review appointments." },
        ],
        cta: "Explore clear aligners",
    },
    {
        name: "Dental Implants",
        slug: "dental-implants",
        description:
            "Long-term tooth replacement solutions designed for comfort and confidence.",
        price: "From £2,900",
        longDescription: "Replacing a missing tooth starts with understanding your options. An implant consultation considers your oral health, priorities and the care involved, so you can make an informed decision about a personalised treatment plan.",
        benefits: ["An option for replacing missing teeth", "Care planned around your individual needs", "Clear guidance on treatment and maintenance"],
        suitableFor: "People with missing teeth who want to explore replacement options. Your dentist will assess your oral health, medical history and supporting bone before discussing whether implants are appropriate.",
        process: [
            { title: "Consultation and assessment", description: "Discuss your goals and complete the examination and records needed to assess suitability." },
            { title: "Plan treatment and healing", description: "Review options, costs, risks and the stages of treatment, including any additional care needed." },
            { title: "Restoration and ongoing care", description: "Complete the planned restoration and receive advice on maintenance and review appointments." },
        ],
        faqs: [
            { question: "What is included in the starting price?", answer: "The indicative £2,900 starting price is for a single-tooth implant treatment. Assessment and any additional procedures may affect the final cost; a full written plan would be provided before treatment." },
            { question: "Can everyone have an implant?", answer: "Suitability varies. A consultation is needed to review your health and discuss implants alongside other tooth replacement options." },
        ],
        cta: "Discuss dental implants",
    },
];
