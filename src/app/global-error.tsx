"use client";

import PageError from "@/components/PageError";
import "./globals.css";

export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
    return (
        <html lang="en">
            <body style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
                <title>Page unavailable | Horizon Dental Studio</title>
                <meta name="robots" content="noindex" />
                <PageError retry={retry} />
            </body>
        </html>
    );
}
