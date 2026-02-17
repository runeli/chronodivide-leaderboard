import { defaultRegions, LadderType } from "@/lib/api";
import { unstable_cache } from "next/cache";

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

async function fetchPlayerData(playerName: string, regionId: string, ladderType: LadderType) {
  try {
    console.log("Getting player data for", playerName, "in region", regionId, "for ladder", ladderType);

    // Fetch player data using the server fetcher function
    const players = await serverFetcher(regionId, `/ladder/16640/${ladderType}/current/listsearch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ players: [playerName] }),
    });

    if (!players || players.length === 0) return null;
    const player = players[0];

    // Fetch match history using the server fetcher function
    const matchHistory = await serverFetcher(regionId, `/ladder/16640/${ladderType}/match-history/v2`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ player: playerName }),
    });

    return { player, matchHistory: matchHistory || [] };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_e: unknown) {
    console.error("Failed to fetch player data");
    return null;
  }
}

export const getPlayerData = unstable_cache(fetchPlayerData, ["player-data"], {
  revalidate: 300, // Cache for 5 minutes
});
