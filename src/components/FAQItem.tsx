import type { FAQ } from "@/data/faqs";

type FAQItemProps = {
    faq: FAQ;
};

export default function FAQItem({ faq }: FAQItemProps) {
    return (
        <details className="faq-item">
            <summary>{faq.question}</summary>

            <p>{faq.answer}</p>
        </details>
    );
}