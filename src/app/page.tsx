import { Suspense } from "react";
import { CircularProgress, Box } from "@mui/material";
import Leaderboard from "./leaderboard";
import StatsChart from "@/components/StatsChart";
import type { Metadata } from "next";
import type { StatsResponse } from "@/lib/api";
import { config } from "@/lib/config";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await fetch("https://wol-eu1.chronodivide.com/stats", {
      next: { revalidate: 600 },
      headers: {
        "Cache-Control": "public, max-age=600, stale-while-revalidate=1200",
      },
    });
    if (!res.ok) throw new Error(`stats status ${res.status}`);
    const stats = (await res.json()) as StatsResponse;

    const usersPlaying = stats.xwol_users?.series.find((s) => s.labels.type === "playing")?.values.at(-1)?.[1] ?? 0;
    const games1v1 =
      stats.xwol_games?.series
        .find((s) => s.labels.type === "ladder" && s.labels.ladderType === "1v1")
        ?.values.at(-1)?.[1] ?? 0;

    const params = new URLSearchParams({
      title: "Chrono Divide Leaderboard",
      players: String(Math.round(usersPlaying)),
      games: String(Math.round(games1v1)),
      region: "am-eu",
    });
    const ogUrl = `/api/og?${params.toString()}`;

    return {
      metadataBase: new URL(config.siteUrl),
      openGraph: { images: [ogUrl] },
      twitter: { images: [ogUrl] },
    };
  } catch {
    const ogUrl = `/api/og?title=Chrono%20Divide%20Leaderboard`;
    return {
      metadataBase: new URL(config.siteUrl),
      openGraph: { images: [ogUrl] },
      twitter: { images: [ogUrl] },
    };
  }
}

export async function generateStaticParams() {
  return [];
}

export default async function Home() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      }
    >
      <Leaderboard />
      <StatsChart />
    </Suspense>
  );
}
