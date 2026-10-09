import Link from "next/link";

type ButtonProps = {
    href: string;
    children: React.ReactNode;
};

export default function Button({ href, children }: ButtonProps) {
    return (
        <Link href={href} className="button">
            {children}
        </Link>
    );
}