export const FORM_BODY_LIMIT_BYTES = 16_000;

export class RequestBodyTooLargeError extends Error {
    constructor() {
        super("Request body exceeds the allowed byte limit.");
        this.name = "RequestBodyTooLargeError";
    }
}

/** Bound memory use before parsing; Content-Length is only an early check, never trusted. */
export async function readFormBody(request: Request): Promise<string> {
    const contentLength = request.headers.get("content-length");
    if (contentLength !== null && Number(contentLength) > FORM_BODY_LIMIT_BYTES) {
        throw new RequestBodyTooLargeError();
    }
    if (!request.body) return "";

    const reader = request.body.getReader();
    const decoder = new TextDecoder();
    let bytes = 0;
    let text = "";
    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            bytes += value.byteLength;
            if (bytes > FORM_BODY_LIMIT_BYTES) {
                // Do not await cancellation: a remote sender may never finish its stream.
                void reader.cancel().catch(() => {});
                throw new RequestBodyTooLargeError();
            }
            text += decoder.decode(value, { stream: true });
        }
        return text + decoder.decode();
    } finally {
        reader.releaseLock();
    }
}
