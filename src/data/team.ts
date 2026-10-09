export type TeamMember = {
    name: string;
    role: string;
    bio: string;
    image: string;
};

export const team: TeamMember[] = [
    {
        name: "Dr. Amelia Hart",
        role: "Principal Dentist",
        bio: "Focused on restorative and cosmetic dentistry with a calm, patient-first approach.",
        image: "/images/team-amelia.jpg",
    },
    {
        name: "Dr. Daniel Reed",
        role: "Implant Dentist",
        bio: "Specialises in dental implants and advanced restorative treatment planning.",
        image: "/images/team-daniel.jpg",
    },
    {
        name: "Dr. Maya Collins",
        role: "Cosmetic Dentist",
        bio: "Provides whitening, smile enhancement and clear-aligner treatment.",
        image: "/images/team-maya.jpg",
    },
];