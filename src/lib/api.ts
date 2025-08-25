import { Region } from "@/contexts/RegionContext";
import useSWR from "swr";

export const defaultRegions: Region[] = [
  {
    id: "am-eu",
    baseUrl: "https://wol-eu1.chronodivide.com",
    label: "Americas & Europe",
    available: true,
  },
  {
    id: "sea",
    baseUrl: "https://wol-sea1.chronodivide.com",
    label: "South-East Asia",
    available: true,
  },
];

export function getApiBaseUrl(regionId: string) {
  return defaultRegions.find((r) => r.id === regionId)?.baseUrl;
}

const fetcher = async (regionId: string, path: string, options?: RequestInit) => {
  const currentApiBaseUrl = getApiBaseUrl(regionId);
  try {
    const res = await fetch(`${currentApiBaseUrl}${path}`, options);
    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error(`Failed to fetch from ${currentApiBaseUrl}:`, error);
    throw error;
  }
};

const playerSWRConfig = {
  errorRetryCount: 0,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  revalidateIfStale: true,
};

export type GameSku = 16640;
export type LadderType = "1v1" | "2v2-random";
export type SeasonId = string; // e.g., "current", "2023.1"

export interface LadderHead {
  id: number;
  name: string;
  type: LadderType;
  divisionName?: string;
}

export interface LadderSeason {
  name: string;
  startTime: number;
  endTime: number;
  lockTime: number;
  topTierStartTime: number;
  nextTopTierDemoteTime: number;
  nextTopTierPromoteTime: number;
  ladders: LadderHead[];
  totalRankedPlayers: Array<{
    ladderType: LadderType;
    value: number;
  }>;
}

export interface PlayerRankedProfile {
  name: string;
  rank: number;
  rankType: string;
  points: number;
  wins: number;
  losses: number;
  draws: number;
  mmr: number;
  ladder?: LadderHead;
  bonusPool?: number;
  promotionProgress?: {
    targetMmr: number;
    gamesRemaining: number;
  };
}

export interface PlayerUnrankedProfile {
  name: string;
  rank: -1;
  rankType: "unranked";
  points: 0;
  wins: 0;
  losses: 0;
  draws: 0;
  mmr: number;
  ladder?: LadderHead;
  bonusPool?: number;
}

export interface PlayerLadderRung {
  name: string;
  rank: number;
  rankType: number;
  points: number;
  wins: number;
  losses: number;
  draws: number;
  mmr: number;
}

export interface PagedResponse<T> {
  totalCount: number;
  records: T[];
}

export interface PlayerInfo {
  name: string;
  countryId?: number;
  colorId?: number;
}

export interface PlayerMatchHistoryEntry {
  gameId: string;
  timestamp: number;
  duration: number;
  map: string;
  result: "win" | "loss" | "draw";
  mmrGain: number;
  countryId?: number;
  colorId?: number;
  opponents: PlayerInfo[];
  teamMates?: PlayerInfo[];
  replayUrl?: string;
}

export function useSeasons(regionId: string, ladderType?: LadderType) {
  const path = ladderType ? `/ladder/16640/${ladderType}` : `/ladder/16640/1v1`;

  const { data, error, isLoading } = useSWR<string[]>([path, regionId], () => fetcher(regionId, path));

  return {
    data,
    error,
    isLoading,
  };
}

export function useSeason(regionId: string, seasonId: SeasonId) {
  const path = `/ladder/16640/${seasonId}`;

  const { data, error, isLoading } = useSWR<LadderSeason>(seasonId ? [path, regionId] : null, () =>
    fetcher(regionId, path)
  );

  return {
    data,
    error,
    isLoading,
  };
}

// Hook: Fetching ladder entries for a specific ladder
export function useLadder(
  regionId: string,
  ladderType: LadderType,
  seasonId: SeasonId,
  ladderId: number,
  start: number,
  count: number
) {
  const path = `/ladder/16640/${ladderType}/${seasonId}/rungsearch`;

  const { data, error, isLoading } = useSWR<PagedResponse<PlayerLadderRung>>(
    seasonId && ladderId !== undefined ? [path, ladderType, seasonId, ladderId, start, count, regionId] : null,
    () =>
      fetcher(regionId, path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ladderId, start, count }),
      })
  );

  return {
    data,
    error,
    isLoading,
  };
}

// Hook: Search for specific players
export function usePlayerSearch(regionId: string, ladderType: LadderType, seasonId: SeasonId, playerNames: string[]) {
  const path = `/ladder/16640/${ladderType}/${seasonId}/listsearch`;

  const { data, error, isLoading } = useSWR<(PlayerRankedProfile | PlayerUnrankedProfile)[]>(
    seasonId && playerNames.length > 0 ? [path, ladderType, seasonId, playerNames, regionId] : null,
    () =>
      fetcher(regionId, path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ players: playerNames }),
      }),
    playerSWRConfig
  );

  return {
    data,
    error,
    isLoading,
  };
}

export function usePlayerMatchHistory(regionId: string, ladderType: LadderType, playerName: string) {
  const path = `/ladder/16640/${ladderType}/match-history/v2`;

  const { data, error, isLoading } = useSWR<PlayerMatchHistoryEntry[]>(
    playerName ? [`match-history`, regionId, ladderType, playerName] : null,
    () =>
      fetcher(regionId, path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ player: playerName }),
      }),
    playerSWRConfig
  );

  return {
    data,
    error,
    isLoading,
  };
}

export function getTopLadders(season: LadderSeason, ladderType: LadderType): LadderHead[] {
  return season.ladders.filter((ladder) => ladder.type === ladderType).sort((a, b) => a.id - b.id); // Sort by ID to get Generals (0) and Contenders (1) first
}

export function formatRankType(rankType: string | number | null | undefined): string {
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

  return rankType;
}

export type PreferredSide = "soviet" | "allies";

export function getPreferredSide(matches?: PlayerMatchHistoryEntry[]): PreferredSide | undefined {
  if (!matches || matches.length === 0) {
    return undefined;
  }

  const alliedCountryIds = new Set<number>([0, 1, 2, 3, 4]);
  const sovietCountryIds = new Set<number>([5, 6, 7, 8]);

  let alliedCount = 0;
  let sovietCount = 0;

  for (const match of matches) {
    const id = match.countryId;
    if (id == null) continue;
    if (alliedCountryIds.has(id)) alliedCount++;
    else if (sovietCountryIds.has(id)) sovietCount++;
  }

  const considered = alliedCount + sovietCount;
  if (considered === 0) return undefined;

  if (alliedCount / considered >= 0.75) return "allies";
  if (sovietCount / considered >= 0.75) return "soviet";
  return undefined;
}
