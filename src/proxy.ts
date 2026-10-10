import { NextResponse, type NextRequest } from "next/server";
import { treatments } from "@/data/treatments";

export function proxy(request: NextRequest) {
    const slug = request.nextUrl.pathname.split("/")[2];
    if (treatments.some((treatment) => treatment.slug === slug)) return NextResponse.next();
    // Route through Next's normal not-found rendering before streaming can send HTTP 200.
    return NextResponse.rewrite(new URL("/404", request.url), { status: 404 });
}

export const config = { matcher: "/treatments/:slug" };
