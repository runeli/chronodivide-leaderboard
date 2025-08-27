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
          justifyContent: "flex-end",
          position: "relative",
          color: "#ffff00",
          border: "8px solid #ff0000",
          boxSizing: "border-box",
        }}
      >
        {/* Background image */}
        <img
          src={new URL("/ogbg.jpg", req.url).href}
          alt=""
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "fill",
            zIndex: -1,
          }}
        />

        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,1) 100%)",
            zIndex: 0,
          }}
        />

        {/* Content overlay */}
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1,
            textAlign: "left",
            paddingLeft: "48px",
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginBottom: "48px",
            display: "flex",
            fontSize: 32,
            marginTop: "24px",
            textAlign: "left",
            paddingLeft: "48px",
          }}
        >
          {players && `Playing users: ${players}`}
          {players && games && " • "}
          {games && `1v1 games: ${games}`}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );

  return response;
}
