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
    // Fetch stats from both regions
    const [euRes, seaRes] = await Promise.all([
      fetch("https://wol-eu1.chronodivide.com/stats", {
        next: { revalidate: 600 },
        headers: {
          "Cache-Control": "public, max-age=600, stale-while-revalidate=1200",
        },
      }),
      fetch("https://wol-sea1.chronodivide.com/stats", {
        next: { revalidate: 600 },
        headers: {
          "Cache-Control": "public, max-age=600, stale-while-revalidate=1200",
        },
      }),
    ]);

    let totalUsersPlaying = 0;
    let totalGames1v1 = 0;

    // Process EU stats
    if (euRes.ok) {
      const euStats = (await euRes.json()) as StatsResponse;
      const euUsersPlaying =
        euStats.xwol_users?.series.find((s) => s.labels.type === "playing")?.values.at(-1)?.[1] ?? 0;
      const euGames1v1 =
        euStats.xwol_games?.series
          .find((s) => s.labels.type === "ladder" && s.labels.ladderType === "1v1")
          ?.values.at(-1)?.[1] ?? 0;

      totalUsersPlaying += euUsersPlaying;
      totalGames1v1 += euGames1v1;
    }

    // Process SEA stats
    if (seaRes.ok) {
      const seaStats = (await seaRes.json()) as StatsResponse;
      const seaUsersPlaying =
        seaStats.xwol_users?.series.find((s) => s.labels.type === "playing")?.values.at(-1)?.[1] ?? 0;
      const seaGames1v1 =
        seaStats.xwol_games?.series
          .find((s) => s.labels.type === "ladder" && s.labels.ladderType === "1v1")
          ?.values.at(-1)?.[1] ?? 0;

      totalUsersPlaying += seaUsersPlaying;
      totalGames1v1 += seaGames1v1;
    }

    const params = new URLSearchParams({
      title: "Chrono Divide Leaderboard",
      players: String(Math.round(totalUsersPlaying)),
      games: String(Math.round(totalGames1v1)),
      region: "global",
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
