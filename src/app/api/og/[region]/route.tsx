import { ImageResponse } from "next/og";
import { defaultRegions } from "@/lib/api";
import { notFound } from "next/navigation";

// Add caching to reduce function invocations
export const revalidate = 300; // Cache for 5 minutes

export async function GET(req: Request, { params }: { params: Promise<{ region: string }> }) {
  const { region } = await params;
  const { searchParams } = new URL(req.url);

  // Validate region
  const validRegion = defaultRegions.find((r) => r.id === region);
  if (!validRegion) {
    notFound();
  }

  // Sanitize and validate user-configurable data
  const sanitizeNumber = (value: string | null, defaultValue: number = 0, maxValue: number = 999999): number => {
    if (!value) return defaultValue;
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 0 || num > maxValue) return defaultValue;
    return num;
  };

  // Get and sanitize data
  const players = sanitizeNumber(searchParams.get("players"), 0, 999999);
  const games = sanitizeNumber(searchParams.get("games"), 0, 999999);

  // Format numbers for display
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formattedPlayers = formatNumber(players);
  const formattedGames = formatNumber(games);

  const title = "Chrono Divide Leaderboard";

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
        {/* eslint-disable-next-line @next/next/no-img-element */}
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
          {players && `Playing users: ${formattedPlayers}`}
          {players && games && " • "}
          {games && `1v1 games: ${formattedGames}`}
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
