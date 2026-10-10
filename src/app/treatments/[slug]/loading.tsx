export default function TreatmentLoading() {
    return (
        <main>
            <section className="section treatment-page-intro" aria-busy="true">
                <div className="container" role="status">
                    <p className="eyebrow">Your treatment options</p>
                    <h1>Loading treatment details…</h1>
                </div>
            </section>
        </main>
    );
}
