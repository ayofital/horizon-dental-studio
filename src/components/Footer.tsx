import Link from "next/link";

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
                        24 Brook Street
                        <br />
                        London
                        <br />
                        W1K 5DF
                    </p>
                </div>

                <div>
                    <p className="footer-heading">Opening hours</p>

                    <p>
                        Mon–Fri: 8:00–18:00
                        <br />
                        Saturday: 9:00–15:00
                        <br />
                        Sunday: Closed
                    </p>
                </div>
            </div>

            <div className="container footer-bottom">
                <p>© 2026 Horizon Dental Studio. Concept project.</p>
            </div>
        </footer>
    );
}