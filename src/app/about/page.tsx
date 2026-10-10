import type { Metadata } from "next";
import Image from "next/image";
import Button from "@/components/Button";
import PracticeValues from "@/components/PracticeValues";
import TeamCard from "@/components/TeamCard";
import { team } from "@/data/team";
import "./about.css";

const title = "About Our Practice | Horizon Dental Studio";
const description = "Discover the calm, patient-first approach, practice values and concept team behind Horizon Dental Studio, a fictional private dental practice in London.";

export const metadata: Metadata = {
    title,
    description,
    openGraph: { title, description, type: "website" },
};

export default function AboutPage() {
    return (
        <main className="about-page">
            <section className="section about-intro" aria-labelledby="about-heading">
                <div className="container">
                    <p className="eyebrow">About Horizon · London</p>
                    <h1 id="about-heading">Exceptional care.<br />A more personal experience.</h1>
                    <div className="about-intro-bottom">
                        <p>Private dentistry with time to listen. A calm setting, clear advice and thoughtful care for the smile you live with every day.</p>
                        <Button href="/book">Book a consultation</Button>
                    </div>
                </div>
            </section>

            <section className="section" aria-labelledby="practice-story-heading">
                <div className="container about-story-grid">
                    <div className="about-clinic-image">
                        <Image src="/images/clinic-hero.jpg" alt="Dentist speaking with a patient seated in a dental treatment room" fill sizes="(max-width: 960px) 100vw, 50vw" className="hero-image" />
                    </div>
                    <div className="about-copy">
                        <p className="eyebrow">Our philosophy</p>
                        <h2 id="practice-story-heading">Good dentistry begins with understanding.</h2>
                        <p>Horizon brings together modern private dentistry and a simple belief: feeling understood matters as much as understanding your treatment.</p>
                        <p>We take time to hear what brings you in, explain what we find and discuss the options. Whether you are keeping your teeth healthy or considering a change, the focus is on your long-term oral health.</p>
                        <p>Thoughtful care means clear costs, practical advice and the freedom to decide without unnecessary pressure.</p>
                    </div>
                </div>
            </section>

            <PracticeValues />

            <section className="section" aria-labelledby="about-team-heading">
                <div className="container">
                    <div className="section-heading">
                        <div>
                            <p className="eyebrow">The people behind the care</p>
                            <h2 id="about-team-heading">A personal approach, together.</h2>
                        </div>
                        <p>Meet the concept team, bringing different areas of dental care together around one shared patient-first philosophy.</p>
                    </div>
                    <div className="team-grid">
                        {team.map((member) => <TeamCard key={member.name} member={member} />)}
                    </div>
                    <p className="about-concept-note">Horizon Dental Studio is a fictional portfolio project. The clinicians and practice details shown here are illustrative.</p>
                </div>
            </section>

            <section className="section about-patient-section" aria-labelledby="patient-first-heading">
                <div className="container why-grid">
                    <div className="about-copy">
                        <p className="eyebrow">Your care, your decision</p>
                        <h2 id="patient-first-heading">A conversation before a treatment plan.</h2>
                        <p>You should leave a consultation with a clearer understanding of your choices, and the time you need to consider them.</p>
                    </div>
                    <div className="why-list">
                        <div>
                            <h3>First, we listen</h3>
                            <p>Your priorities, dental history and any worries guide the conversation. Tell us what would help you feel comfortable, including time for questions or a pause.</p>
                        </div>
                        <div>
                            <h3>Then, we explain</h3>
                            <p>Following an assessment, we discuss suitable options, expected benefits, limitations and costs in plain language. Your plan reflects your needs rather than a fixed package.</p>
                        </div>
                        <div>
                            <h3>You choose the next step</h3>
                            <p>Ask questions, consider alternatives and decide at your own pace. We explain ongoing care and review appointments so you know what comes after treatment, too.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section" aria-labelledby="modern-care-heading">
                <div className="container about-modern-care">
                    <p className="eyebrow">Modern dentistry, thoughtfully applied</p>
                    <div className="about-modern-grid">
                        <h2 id="modern-care-heading">The right approach for your needs.</h2>
                        <div>
                            <p>Contemporary techniques and technology have a place when they support careful assessment, clear planning and appropriate care. We explain the purpose of any recommended examination or treatment before proceeding.</p>
                            <p>The aim is simple: help you understand your oral health and make informed decisions. Technology supports that conversation; personal attention remains at its heart.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section final-cta-section" aria-labelledby="about-cta-heading">
                <div className="container final-cta">
                    <p className="eyebrow">Ready when you are</p>
                    <h2 id="about-cta-heading">Start with a conversation.</h2>
                    <p>Tell us what matters to you. We will help you explore the next step towards a healthier, more confident smile.</p>
                    <Button href="/book">Book your consultation</Button>
                </div>
            </section>
        </main>
    );
}
