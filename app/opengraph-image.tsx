import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "DocQuery · Retrieval-Augmented Answers";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "system-ui",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "40px",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <span style={{ fontSize: 72, fontWeight: 700 }}>Doc</span>
            <span style={{ fontSize: 72, fontWeight: 700, color: "#6ee7b7" }}>
              Query
            </span>
          </div>
          <div
            style={{
              fontSize: 36,
              textAlign: "center",
              color: "#cbd5e1",
              maxWidth: "900px",
              lineHeight: "1.4",
            }}
          >
            Retrieval-Augmented Answers for your documents
          </div>
          <div
            style={{
              fontSize: 24,
              textAlign: "center",
              color: "#94a3b8",
              marginTop: "20px",
            }}
          >
            Upload documents, chat with grounded answers, and keep every
            response cited
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
