import PlayerPageClient from "@/components/PlayerPageClient";
import { Metadata } from "next";
import { defaultRegions, PlayerMatchHistoryEntry } from "@/lib/api";
import { config } from "@/lib/config";

export async function generateStaticParams() {
  // Return empty array to handle all routes client-side
  return [];
}

// Server-side fetcher function similar to the one in api.ts
const serverFetcher = async (regionId: string, path: string, options?: RequestInit) => {
  const baseUrl = defaultRegions.find((r) => r.id === regionId)?.baseUrl;
  if (!baseUrl) {
    throw new Error(`Region ${regionId} not found`);
  }

  try {
    const res = await fetch(`${baseUrl}${path}`, options);
    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error(`Failed to fetch from ${baseUrl}:`, error);
    throw error;
  }
};

async function getPlayerData(playerName: string, regionId: string) {
  try {
    console.log("Getting player data for", playerName, "in region", regionId);

    // Fetch player data using the server fetcher function
    const players = await serverFetcher(regionId, "/ladder/16640/1v1/current/listsearch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ players: [playerName] }),
    });

    if (!players || players.length === 0) return null;
    const player = players[0];

    // Fetch match history using the server fetcher function
    const matchHistory = await serverFetcher(regionId, "/ladder/16640/1v1/match-history/v2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ player: playerName }),
    });

    return { player, matchHistory: matchHistory || [] };
  } catch (error) {
    console.error("Failed to fetch player data");
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  // Try to get player data from the default region
  const playerData = await getPlayerData(decodedName, "am-eu");

  const title = `${decodedName} - Chrono Divide Replays`;
  const description = playerData
    ? `${decodedName} - MMR: ${playerData.player.mmr} - View match history and performance stats`
    : `View ${decodedName}'s profile on Chrono Divide Replays`;

  // Build OG image URL
  let ogImageUrl = `${config.siteUrl}/api/og/player?name=${encodeURIComponent(decodedName)}`;

  if (playerData) {
    ogImageUrl += `&mmr=${playerData.player.mmr}`;

    // Add match history data for the performance graph
    if (playerData.matchHistory.length > 0) {
      const historyData = playerData.matchHistory.slice(0, 20).map((match: PlayerMatchHistoryEntry) => ({
        timestamp: match.timestamp,
        mmrGain: match.mmrGain,
      }));
      ogImageUrl += `&history=${encodeURIComponent(JSON.stringify(historyData))}`;
    }
  }

  ogImageUrl += `&t=${Date.now()}`;

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

export default async function PlayerPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  return <PlayerPageClient playerName={name} />;
}
