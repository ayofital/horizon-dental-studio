"use client";

import { useEffect, useRef, useState } from "react";
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

    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const desktopRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const desktop = window.matchMedia("(min-width: 1101px)");
        function resetMenu() {
            if (!desktop.matches) return;
            const focusInMobile = menuRef.current?.contains(document.activeElement) || document.activeElement === triggerRef.current;
            setIsMenuOpen(false);
            if (focusInMobile) desktopRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
        }
        desktop.addEventListener("change", resetMenu);
        return () => desktop.removeEventListener("change", resetMenu);
    }, []);

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className="site-header" onKeyDown={(event) => {
            if (event.key === "Escape" && isMenuOpen) {
                event.preventDefault();
                closeMenu();
                triggerRef.current?.focus();
            }
        }}>
            <div className="container header-inner">
                <Link href="/" className="brand" onClick={closeMenu}>
                    Horizon Dental
                </Link>

                <nav ref={desktopRef} className="desktop-nav" aria-label="Primary navigation">
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="header-action">
                    <Button href="/book" onClick={closeMenu}>Book consultation</Button>
                </div>

                <button
                    ref={triggerRef}
                    className="mobile-menu-button"
                    type="button"
                    aria-label="Toggle navigation menu"
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-navigation"
                    onClick={() => setIsMenuOpen((current) => !current)}
                >
                    <span />
                    <span />
                    <span />
                </button>
            </div>

            <div ref={menuRef} id="mobile-navigation" className="mobile-menu" hidden={!isMenuOpen}>
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
        </header>
    );
}
