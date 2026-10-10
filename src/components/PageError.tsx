"use client";

import { useEffect, useRef } from "react";

export default function PageError({ retry }: { retry: () => void }) {
    const heading = useRef<HTMLHeadingElement>(null);
    useEffect(() => { heading.current?.focus(); }, []);

    return (
        <main id="main-content" tabIndex={-1}>
            <section className="section treatment-page-intro" aria-labelledby="page-error-heading">
                <div className="container">
                    <p className="eyebrow">A temporary interruption</p>
                    <h1 id="page-error-heading" ref={heading} tabIndex={-1}>We couldn’t load this page.</h1>
                    <p>Please try again. If the problem continues, return to the homepage and try later.</p>
                    <div className="hero-actions">
                        <button className="button" type="button" onClick={retry}>Try again</button>
                        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- Recovery must reload the document, including a failed root layout. */}
                        <a className="secondary-link" href="/">Return to the homepage</a>
                    </div>
                </div>
            </section>
        </main>
    );
}
