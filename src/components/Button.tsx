import Link from "next/link";

type ButtonProps = {
    href: string;
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

export default function Button({ href, children, onClick }: ButtonProps) {
    return (
        <Link href={href} className="button" onClick={onClick}>
            {children}
        </Link>
    );
}
