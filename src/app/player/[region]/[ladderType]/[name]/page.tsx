import PlayerPageClient from "@/components/PlayerPageClient";
import { Metadata } from "next";
import { LadderType } from "@/lib/api";
import { config } from "@/lib/config";
import { getPlayerData } from "@/lib/playerData";

export async function generateStaticParams() {
  // Return empty array to handle all routes client-side
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string; region: string; ladderType: string }>;
}): Promise<Metadata> {
  const { name, region, ladderType } = await params;
  const decodedName = decodeURIComponent(name);

  // Validate ladder type
  const validLadderType: LadderType = ladderType === "2v2-random" ? "2v2-random" : "1v1";

  // Get player data from the region specified in the URL
  const playerData = await getPlayerData(decodedName, region, validLadderType);

  const title = `${decodedName} - Chrono Divide Replays`;
  const description = playerData
    ? `${decodedName} - MMR: ${playerData.player.mmr} - View match history and performance stats`
    : `View ${decodedName}'s profile on Chrono Divide Replays`;

  // Build OG image URL - keep params minimal for cacheability
  let ogImageUrl = `${config.siteUrl}/api/og/player/${region}/${validLadderType}/${encodeURIComponent(decodedName)}`;

  if (playerData) {
    ogImageUrl += `?mmr=${playerData.player.mmr}`;

    // Add rank if available
    if (playerData.player.rank && playerData.player.rank > 0) {
      ogImageUrl += `&rank=${playerData.player.rank}`;
    }
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${decodedName} profile card`,
        },
      ],
    },
    other: {
      "og:updated_time": new Date().toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ name: string; region: string; ladderType: string }>;
}) {
  const { name, ladderType } = await params;

  // Validate ladder type
  const validLadderType: LadderType = ladderType === "2v2-random" ? "2v2-random" : "1v1";

  return <PlayerPageClient playerName={name} ladderType={validLadderType} />;
}
