import { ImageResponse } from "next/og";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ name: string; region: string; ladderType: string }> }
) {
  const { name } = await params;
  const { searchParams } = new URL(req.url);

  const playerName = decodeURIComponent(name);
  const mmr = searchParams.get("mmr") ?? "0";
  const rank = searchParams.get("rank") ?? "";
  const rankTypeParam = searchParams.get("rankType");
  let rankTypeForFormat: string | number | null = rankTypeParam;
  if (rankTypeParam != null && /^\d+$/.test(rankTypeParam)) {
    rankTypeForFormat = parseInt(rankTypeParam, 10);
  }
  const preferredSideParam = searchParams.get("preferredSide") as "soviet" | "allies" | null;
  const matchHistoryParam = searchParams.get("history");
  let matchHistory: Array<{ timestamp: number; mmrGain: number }> = [];
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

  const formatRankType = (rankType: string | number | null | undefined): string => {
    if (rankType == null) {
      return "Unranked";
    }
    if (typeof rankType === "number") {
      const rankNames: Record<number, string> = {
        0: "Unranked",
        1: "Private",
        2: "Corporal",
        3: "Sergeant",
        4: "Lieutenant",
        5: "Major",
        6: "Colonel",
        7: "Brigadier General",
        8: "General",
        9: "5-Star General",
        10: "Commander-in-chief",
      };
      return rankNames[rankType] || `Rank ${rankType}`;
    }
    if (rankType === "unranked") {
      return "Unranked";
    }
    return String(rankType);
  };

  const titlePrefix =
    preferredSideParam === "allies" ? "Allied" : preferredSideParam === "soviet" ? "Soviet" : undefined;
  const playerTitle =
    rankTypeForFormat != null
      ? titlePrefix
        ? `${titlePrefix} ${formatRankType(rankTypeForFormat)}`
        : formatRankType(rankTypeForFormat)
      : undefined;

  // dirty hack but so is your mom
  const baseWidth = 1200;
  const baseHeight = 630;
  const mmrOffset = (parseInt(mmr) % 10) * 2; // 0-18 pixels variation
  const matchCountOffset = (matchHistory.length % 5) * 3; // 0-12 pixels variation

  const width = baseWidth + mmrOffset;
  const height = baseHeight + matchCountOffset;

  const response = new ImageResponse(
    (
      <div
        style={{
          width,
          height,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          position: "relative",
          color: "#ffff00",
          border: "8px solid #ff0000",
          boxSizing: "border-box",
        }}
      >
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

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingLeft: "48px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              marginBottom: "16px",
            }}
          >
            {rank && (
              <div
                style={{
                  borderRadius: "24px",
                  padding: "16px 32px",
                  display: "flex",
                  color: "#ff0000",
                  backgroundColor: "#ffff00",
                  fontWeight: 700,
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1 }}>
                  <div style={{ display: "flex", fontSize: 128 }}>#{rank}</div>
                  <div style={{ display: "flex", fontSize: 36, marginTop: 8 }}>MMR: {mmr}</div>
                </div>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column" }}>
              {playerTitle && (
                <div
                  style={{
                    display: "flex",
                    fontSize: 36,
                    fontWeight: 600,
                    color: "#ffff00",
                    marginBottom: "8px",
                  }}
                >
                  {playerTitle}
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  fontSize: 64,
                  fontWeight: 700,
                  lineHeight: 1,
                  textAlign: "left",
                  color: "#ffff00",
                }}
              >
                {playerName}
              </div>
            </div>
          </div>
        </div>
        {performanceData.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              position: "absolute",
              bottom: "48px",
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
      width,
      height,
    }
  );

  return response;
}
