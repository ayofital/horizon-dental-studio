import { ImageResponse } from "next/og";

export const alt = "Horizon Dental Studio — a fictional dental practice concept";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
    return new ImageResponse(
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px", background: "#f7f6f2", color: "#173f35", borderLeft: "24px solid #173f35" }}>
            <div style={{ display: "flex", fontSize: 24, letterSpacing: "3px" }}>CARE AT YOUR PACE</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", fontSize: 76, fontWeight: 700, letterSpacing: "-3px" }}>Horizon Dental Studio</div>
                <div style={{ display: "flex", fontSize: 34, marginTop: 28 }}>Calm, thoughtful dentistry. A more personal experience.</div>
            </div>
            <div style={{ display: "flex", fontSize: 24, color: "#43574d" }}>A fictional dental practice · Portfolio concept</div>
        </div>,
        size,
    );
}
