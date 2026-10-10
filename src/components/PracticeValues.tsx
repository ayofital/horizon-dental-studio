const values = [
    { title: "Clear advice", description: "Straightforward explanations, honest conversations and space for every question." },
    { title: "Comfort first", description: "An unhurried approach that respects how you feel, as well as what your smile needs." },
    { title: "Modern care", description: "Contemporary dentistry guided by careful assessment and your individual needs." },
    { title: "Long-term thinking", description: "A focus on prevention, practical habits and care that supports your future oral health." },
];

export default function PracticeValues() {
    return (
        <section className="section practice-values why-section" aria-labelledby="practice-values-heading">
            <div className="container">
                <div className="section-heading">
                    <div>
                        <p className="eyebrow">What guides us</p>
                        <h2 id="practice-values-heading">Small details. Lasting trust.</h2>
                    </div>
                    <p>Our approach is shaped by four simple commitments, from the first conversation to your ongoing care.</p>
                </div>
                <div className="practice-values-grid">
                    {values.map((value, index) => (
                        <article key={value.title}>
                            <span className="practice-value-number" aria-hidden="true">0{index + 1}</span>
                            <h3>{value.title}</h3>
                            <p>{value.description}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
