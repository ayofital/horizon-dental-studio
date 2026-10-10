import { validateContact } from "@/lib/contact";

export async function POST(request: Request) {
    try {
        const body = await request.text();
        if (body.length > 16000) return Response.json({ message: "Your enquiry is too long. Please shorten it and try again." }, { status: 413 });
        let input: unknown;
        try {
            input = JSON.parse(body);
        } catch {
            return Response.json({ message: "The enquiry could not be read. Please try again." }, { status: 400 });
        }
        const { errors } = validateContact(input);
        if (Object.keys(errors).length) return Response.json({ errors }, { status: 422 });

        // Demo only: no email, storage or logging. Replace this response with a delivery service when live enquiries are authorised.
        return Response.json({ demo: true, message: "Demo complete. Your example enquiry passed validation. Nothing was sent or saved, and no reply will follow." });
    } catch {
        console.error("Contact demo failed during request processing. Nothing was sent or saved.");
        return Response.json({ message: "We couldn’t complete the demo. Nothing was sent or saved. Please try again." }, { status: 500 });
    }
}
