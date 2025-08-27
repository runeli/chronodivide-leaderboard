import { ImageResponse } from "next/og";

// Add caching to reduce function invocations
export const revalidate = 300; // Cache for 5 minutes

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const playerName = searchParams.get("name") ?? "Unknown Player";
  const mmr = searchParams.get("mmr") ?? "0";
  const matchHistoryParam = searchParams.get("history");
  let matchHistory: Array<{ timestamp: number; mmrGain: number }> = [];
  console.log(matchHistoryParam);
  if (matchHistoryParam) {
    try {
      matchHistory = JSON.parse(decodeURIComponent(matchHistoryParam));
    } catch (e) {
      console.error("Failed to parse match history:", e);
    }
  }

  const processMatchData = () => {
    if (!matchHistory || matchHistory.length === 0) return [];

    let runningMMR = parseInt(mmr) || 0;
    const data: Array<{ match: number; mmr: number }> = [];

    const sortedMatches = [...matchHistory].sort((a, b) => a.timestamp - b.timestamp);

    for (let i = sortedMatches.length - 1; i >= 0; i--) {
      runningMMR -= sortedMatches[i].mmrGain;
    }

    sortedMatches.forEach((match, index) => {
      runningMMR += match.mmrGain;
      data.push({
        match: index + 1,
        mmr: runningMMR,
      });
    });

    return data;
  };

  const performanceData = processMatchData();

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

        <div
          style={{
            display: "flex",
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
          {playerName}
        </div>

        <div
          style={{
            display: "flex",
            marginBottom: "48px",
            fontSize: 128,
            marginTop: "24px",
            textAlign: "left",
            paddingLeft: "48px",
          }}
        >
          MMR: {mmr}
        </div>

        {performanceData.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              position: "absolute",
              top: "48px",
              right: "48px",
              width: "400px",
              height: "200px",
              background: "rgba(0,0,0,0.7)",
              border: "2px solid #ffff00",
              padding: "16px",
              zIndex: 1,
            }}
          >
            <svg width="368" height="150" style={{ background: "transparent" }}>
              {performanceData.length > 1 && (
                <polyline
                  fill="none"
                  stroke="#ffff00"
                  strokeWidth="2"
                  points={performanceData
                    .map((match, index) => {
                      const x = (index / (performanceData.length - 1)) * 340 + 14;
                      const minMMR = Math.min(...performanceData.map((d) => d.mmr));
                      const maxMMR = Math.max(...performanceData.map((d) => d.mmr));
                      const range = maxMMR - minMMR || 1;
                      const normalizedY = (match.mmr - minMMR) / range;
                      const y = 150 - (normalizedY * 130 + 10);
                      return `${x},${y}`;
                    })
                    .join(" ")}
                />
              )}
              {performanceData.map((match, index) => {
                const x = (index / (performanceData.length - 1)) * 340 + 14;
                const minMMR = Math.min(...performanceData.map((d) => d.mmr));
                const maxMMR = Math.max(...performanceData.map((d) => d.mmr));
                const range = maxMMR - minMMR || 1;
                const normalizedY = (match.mmr - minMMR) / range;
                const y = 150 - (normalizedY * 130 + 10);
                return <circle key={index} cx={x} cy={y} r="3" fill="#ffff00" />;
              })}
            </svg>
          </div>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );

  response.headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=600");

  return response;
}
