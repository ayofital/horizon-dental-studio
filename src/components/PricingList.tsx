import Link from "next/link";
import type { PricingItem } from "@/data/pricing";

type PricingListProps = {
    items: PricingItem[];
};

export default function PricingList({ items }: PricingListProps) {
    return (
        <dl className="pricing-list">
            {items.map((item) => (
                <div className="pricing-row" key={item.name}>
                    <dt>
                        {item.href ? <Link href={item.href}>{item.name}<span aria-hidden="true"> ↗</span></Link> : item.name}
                    </dt>
                    <dd className="pricing-amount">{item.price}</dd>
                    <dd className="pricing-description">{item.description}</dd>
                </div>
            ))}
        </dl>
    );
}
