import Image from "next/image";
import type { TeamMember } from "@/data/team";

type TeamCardProps = {
    member: TeamMember;
};

export default function TeamCard({ member }: TeamCardProps) {
    return (
        <article className="team-card">
            <div className="team-image-wrapper">
                <Image
                    src={member.image}
                    alt={`${member.name}, ${member.role}`}
                    fill
                    className="team-image"
                    sizes="(max-width: 960px) 100vw, 33vw"
                />
            </div>

            <div className="team-card-content">
                <p className="team-role">{member.role}</p>
                <h3>{member.name}</h3>
                <p>{member.bio}</p>
            </div>
        </article>
    );
}