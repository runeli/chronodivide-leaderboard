import { ImageResponse } from "next/og";

// Add caching to reduce function invocations
export const revalidate = 300; // Cache for 5 minutes

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const title = searchParams.get("title") ?? "Chrono Divide Leaderboard";
  const players = searchParams.get("players");
  const games = searchParams.get("games");
  const region = searchParams.get("region") ?? "am-eu";

  const response = new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "48px",
          background: "#000000",
          color: "#ffff00",
          border: "8px solid #ff0000",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, lineHeight: 1, textAlign: "center" }}>
          {title}
        </div>
        <div style={{ display: "flex", fontSize: 32, marginTop: "24px", textAlign: "center" }}>
          {players && `Playing users: ${players}`}
          {players && games && " • "}
          {games && `1v1 games: ${games}`}
        </div>
        <div style={{ display: "flex", fontSize: 24, marginTop: "16px", opacity: 0.9 }}>Region: {region}</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );

  // Add caching headers to reduce function invocations
  response.headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=600");

  return response;
}
