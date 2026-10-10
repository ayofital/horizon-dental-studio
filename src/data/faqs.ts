export type FAQ = {
    question: string;
    answer: string;
};

export const faqCategories = [
    { id: "appointments", name: "Appointments", description: "Planning your first visit and making time for your care." },
    { id: "treatments", name: "Treatments", description: "Understanding your options before making a decision." },
    { id: "pricing-payments", name: "Pricing & payments", description: "Clear costs and practical ways to plan treatment." },
    { id: "aftercare", name: "Aftercare", description: "Support and guidance beyond your appointment." },
    { id: "practice", name: "General practice information", description: "A little more about Horizon and what to expect." },
] as const;

export type PracticeFAQ = FAQ & {
    category: typeof faqCategories[number]["id"];
    featured?: boolean;
};

export const faqs: PracticeFAQ[] = [
    {
        question: "Do I need a consultation before treatment?",
        category: "appointments",
        featured: true,
        answer:
            "Yes. Your first consultation allows the dentist to understand your goals, assess your oral health and recommend the most suitable treatment options.",
    },
    {
        question: "Do you offer emergency appointments?",
        category: "appointments",
        featured: true,
        answer:
            "Same-day emergency appointments may be available depending on the clinic schedule.",
    },
    {
        question: "Can treatment costs be spread over time?",
        category: "pricing-payments",
        featured: true,
        answer:
            "Some treatments may be eligible for payment plans. Exact options would be discussed during consultation.",
    },
    {
        question: "How long does a dental consultation take?",
        category: "appointments",
        featured: true,
        answer:
            "Most consultations take around 30 to 45 minutes depending on the treatment being discussed.",
    },
    {
        question: "Can I change or cancel an appointment?",
        category: "appointments",
        answer: "Contact the team as early as possible if your plans change. Any notice period or cancellation fee would be explained when you book; this concept site does not set a live appointment policy.",
    },
    {
        question: "How do I know which treatment is right for me?",
        category: "treatments",
        answer: "A consultation brings together your priorities and an assessment of your oral health. Your dentist would explain suitable options, their limitations and alternatives, including whether treatment is needed at all.",
    },
    {
        question: "Are cosmetic treatments suitable for everyone?",
        category: "treatments",
        answer: "Suitability varies with your oral health, expectations and the treatment being considered. An assessment is needed before a recommendation; some concerns may need attention before cosmetic care can be planned.",
    },
    {
        question: "How long do treatments usually take?",
        category: "treatments",
        answer: "Some care can be completed in one visit, while other treatments involve several appointments over a longer period. An estimated schedule, including any reviews, would be discussed in your individual plan.",
    },
    {
        question: "When will I know the final treatment cost?",
        category: "pricing-payments",
        answer: "Following assessment, you would receive a written plan explaining the proposed care, what is included and the fees. If your needs change, any revised costs would be discussed before proceeding.",
    },
    {
        question: "Are the prices on the website final?",
        category: "pricing-payments",
        answer: "No. The listed fees are illustrative starting prices for this fictional practice. The cost of care depends on individual needs and any investigations or additional procedures, so it would be confirmed after assessment.",
    },
    {
        question: "Will I receive aftercare instructions?",
        category: "aftercare",
        answer: "Aftercare advice would be tailored to the treatment you receive, with practical guidance and any planned reviews explained. Ask the team to clarify anything you are unsure about before leaving your appointment.",
    },
    {
        question: "What should I do if I have concerns after treatment?",
        category: "aftercare",
        answer: "Contact your treating dental practice promptly and explain what has changed so they can advise on an appropriate review. This demonstration website cannot provide clinical advice or respond to urgent concerns.",
    },
    {
        question: "Can I discuss feeling nervous before my visit?",
        category: "practice",
        answer: "Yes. Sharing your concerns before an appointment helps the team discuss a comfortable pace, time for questions and opportunities to pause. Any specific support would be agreed with you individually.",
    },
    {
        question: "Is Horizon Dental Studio a real practice?",
        category: "practice",
        answer: "Horizon Dental Studio is a fictional portfolio concept. The team, patient stories, fees and practice details demonstrate a private dental website; this site does not offer real appointments or dental care.",
    },
];

export const faqPreview = faqs.filter((faq) => faq.featured);
