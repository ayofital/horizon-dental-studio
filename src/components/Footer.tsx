import Link from "next/link";
import { practice } from "@/data/practice";

const footerLinks = [
    { label: "Treatments", href: "/treatments" },
    { label: "About", href: "/about" },
    { label: "Pricing", href: "/pricing" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
];

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="container footer-grid">
                <div>
                    <Link href="/" className="footer-brand">
                        Horizon Dental
                    </Link>

                    <p className="footer-description">
                        Modern private dentistry focused on comfort, confidence and
                        long-term care.
                    </p>
                </div>

                <div>
                    <p className="footer-heading">Explore</p>

                    <div className="footer-links">
                        {footerLinks.map((item) => (
                            <Link key={item.href} href={item.href}>
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="footer-heading">Visit</p>

                    <p>
                        {practice.address[0]}
                        <br />
                        {practice.address[1]}
                        <br />
                        {practice.address[2]}
                    </p>
                </div>

                <div>
                    <p className="footer-heading">Opening hours</p>

                    <p>
                        {practice.hours[0]}
                        <br />
                        {practice.hours[1]}
                        <br />
                        {practice.hours[2]}
                    </p>
                </div>
            </div>

            <div className="container footer-bottom">
                <p>© 2026 Horizon Dental Studio. Concept project.</p>
            </div>
        </footer>
    );
}
