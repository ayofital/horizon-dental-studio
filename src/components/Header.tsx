"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";

const navItems = [
    { label: "Treatments", href: "/treatments" },
    { label: "About", href: "/about" },
    { label: "Pricing", href: "/pricing" },
    { label: "Patient Stories", href: "/patient-stories" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
];

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className="site-header">
            <div className="container header-inner">
                <Link href="/" className="brand" onClick={closeMenu}>
                    Horizon Dental
                </Link>

                <nav className="desktop-nav" aria-label="Primary navigation">
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="header-action">
                    <Button href="/book">Book consultation</Button>
                </div>

                <button
                    className="mobile-menu-button"
                    type="button"
                    aria-label="Toggle navigation menu"
                    aria-expanded={isMenuOpen}
                    onClick={() => setIsMenuOpen((current) => !current)}
                >
                    <span />
                    <span />
                    <span />
                </button>
            </div>

            {isMenuOpen && (
                <div className="mobile-menu">
                    <nav
                        className="container mobile-nav"
                        aria-label="Mobile navigation"
                    >
                        {navItems.map((item) => (
                            <Link key={item.href} href={item.href} onClick={closeMenu}>
                                {item.label}
                            </Link>
                        ))}

                        <Link
                            href="/book"
                            className="mobile-booking-link"
                            onClick={closeMenu}
                        >
                            Book consultation
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}