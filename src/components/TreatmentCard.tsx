import Link from "next/link";
import type { Treatment } from "@/data/treatments";

type TreatmentCardProps = {
    treatment: Treatment;
};

export default function TreatmentCard({
                                          treatment,
                                      }: TreatmentCardProps) {
    return (
        <article className="treatment-card">
            <div>
                <p className="treatment-price">{treatment.price}</p>

                <h3>{treatment.name}</h3>

                <p>{treatment.description}</p>
            </div>

            <Link href={`/treatments/${treatment.slug}`}>
                Learn more
            </Link>
        </article>
    );
}