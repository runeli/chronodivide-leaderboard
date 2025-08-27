import { Suspense } from "react";
import { CircularProgress, Box } from "@mui/material";
import Leaderboard from "../leaderboard";
import StatsChart from "@/components/StatsChart";
import type { Metadata } from "next";
import type { StatsResponse } from "@/lib/api";
import { config } from "@/lib/config";
import { defaultRegions } from "@/lib/api";
import { notFound } from "next/navigation";

export const revalidate = 300;

// Generate static params for known regions
export async function generateStaticParams() {
  return defaultRegions.map((region) => ({
    region: region.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ region: string }> }): Promise<Metadata> {
  const { region } = await params;

  // Validate region
  const validRegion = defaultRegions.find((r) => r.id === region);
  if (!validRegion) {
    notFound();
  }

  try {
    // Fetch stats for the specific region
    const statsUrl =
      region === "am-eu" ? "https://wol-eu1.chronodivide.com/stats" : "https://wol-sea1.chronodivide.com/stats";

    const response = await fetch(statsUrl, {
      next: { revalidate: 600 },
      headers: {
        "Cache-Control": "public, max-age=600, stale-while-revalidate=1200",
      },
    });

    let usersPlaying = 0;
    let games1v1 = 0;

    if (response.ok) {
      const stats = (await response.json()) as StatsResponse;
      usersPlaying = stats.xwol_users?.series.find((s) => s.labels.type === "playing")?.values.at(-1)?.[1] ?? 0;
      games1v1 =
        stats.xwol_games?.series
          .find((s) => s.labels.type === "ladder" && s.labels.ladderType === "1v1")
          ?.values.at(-1)?.[1] ?? 0;
    }

    const params = new URLSearchParams({
      title: "Chrono Divide Leaderboard",
      players: String(Math.round(usersPlaying)),
      games: String(Math.round(games1v1)),
    });
    const ogUrl = `/api/og/${region}?${params.toString()}`;

    return {
      metadataBase: new URL(config.siteUrl),
      openGraph: { images: [ogUrl] },
      twitter: { images: [ogUrl] },
    };
  } catch {
    const ogUrl = `/api/og/${region}?title=Chrono%20Divide%20Leaderboard`;
    return {
      metadataBase: new URL(config.siteUrl),
      openGraph: { images: [ogUrl] },
      twitter: { images: [ogUrl] },
    };
  }
}

export default async function RegionPage({ params }: { params: Promise<{ region: string }> }) {
  const { region } = await params;

  // Validate region
  const validRegion = defaultRegions.find((r) => r.id === region);
  if (!validRegion) {
    notFound();
  }

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
