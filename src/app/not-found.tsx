import Link from "next/link";

export default function NotFound() {
    return (
        <main id="main-content" tabIndex={-1}>
            <section className="section treatment-page-intro" aria-labelledby="not-found-heading">
                <div className="container">
                    <p className="eyebrow">Page not found</p>
                    <h1 id="not-found-heading">Let’s find your next step.</h1>
                    <p>The page you requested isn’t available. Explore the treatment information or return to the homepage.</p>
                    <div className="hero-actions">
                        <Link className="button" href="/">Return to the homepage</Link>
                        <Link className="secondary-link" href="/treatments">Explore treatments</Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
