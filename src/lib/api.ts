import useSWR from 'swr';

const API_BASE_URLS = [
  'https://wol-eu1.chronodivide.com',
  'https://wol-sea1.chronodivide.com',
];

// A simple fetcher function that works with SWR.
// It tries the EU server first, then falls back to the SEA server.
const fetcher = async (path: string, options?: RequestInit) => {
  let error: unknown = null;
  for (const baseUrl of API_BASE_URLS) {
    try {
      const res = await fetch(`${baseUrl}${path}`, options);
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
      return res.json();
    } catch (e) {
      error = e;
      console.warn(`Failed to fetch from ${baseUrl}, trying next server...`);
    }
  }
  throw error ?? new Error('All API servers are unreachable.');
};

// --- API Types (based on documentation) ---

export type GameSku = 16640;
export type LadderType = '1v1' | '2v2-random';
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
  promotionProgress?: {
    targetMmr: number;
    gamesRemaining: number;
  };
}

export interface PlayerUnrankedProfile {
  name: string;
  rank: -1;
  rankType: 'unranked';
  points: 0;
  wins: 0;
  losses: 0;
  draws: 0;
  mmr: number;
}

export interface PlayerLadderRung {
  name: string;
  rank: number;
  rankType: string;
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

export interface PlayerMatchHistoryEntry {
  gameId: string;
  timestamp: number;
  duration: number;
  map: string;
  result: 'win' | 'loss' | 'draw';
  mmrGain: number;
  opponents: string[];
  teamMates: string[];
  replayUrl: string;
}

// --- SWR Hooks ---

// Hook: Fetch available seasons
export function useSeasons(ladderType?: LadderType) {
  const path = ladderType ? `/ladder/16640/${ladderType}` : `/ladder/16640/1v1`;

  const { data, error, isLoading } = useSWR<string[]>(path, fetcher);

  return {
    data,
    error,
    isLoading,
  };
}

// Hook: Fetch season details with all ladders
export function useSeason(seasonId: SeasonId) {
  const path = `/ladder/16640/${seasonId}`;

  const { data, error, isLoading } = useSWR<LadderSeason>(
    seasonId ? path : null,
    fetcher
  );

  return {
    data,
    error,
    isLoading,
  };
}

// Hook: Fetching ladder entries for a specific ladder
export function useLadder(
  ladderType: LadderType,
  seasonId: SeasonId,
  ladderId: number,
  start: number,
  count: number
) {
  const path = `/ladder/16640/${ladderType}/${seasonId}/rungsearch`;

  const { data, error, isLoading } = useSWR<PagedResponse<PlayerLadderRung>>(
    seasonId && ladderId !== undefined
      ? [path, ladderType, seasonId, ladderId, start, count]
      : null,
    () =>
      fetcher(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
export function usePlayerSearch(
  ladderType: LadderType,
  seasonId: SeasonId,
  playerNames: string[]
) {
  const path = `/ladder/16640/${ladderType}/${seasonId}/listsearch`;

  const { data, error, isLoading } = useSWR<
    (PlayerRankedProfile | PlayerUnrankedProfile)[]
  >(
    seasonId && playerNames.length > 0
      ? [path, ladderType, seasonId, playerNames]
      : null,
    () =>
      fetcher(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ players: playerNames }),
      })
  );

  return {
    data,
    error,
    isLoading,
  };
}

// Hook: Fetch player match history
export function usePlayerMatchHistory(
  ladderType: LadderType,
  playerName: string
) {
  const path = `/ladder/16640/${ladderType}/match-history`;

  const { data, error, isLoading } = useSWR<PlayerMatchHistoryEntry[]>(
    playerName ? [path, ladderType, playerName] : null,
    () =>
      fetcher(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player: playerName }),
      })
  );

  return {
    data,
    error,
    isLoading,
  };
}

// Helper function to get the top ladders for a given ladder type
export function getTopLadders(
  season: LadderSeason,
  ladderType: LadderType
): LadderHead[] {
  return season.ladders
    .filter((ladder) => ladder.type === ladderType)
    .sort((a, b) => a.id - b.id); // Sort by ID to get Generals (0) and Contenders (1) first
}

// Helper function to format player rank display
export function formatRankType(rankType: string | number): string {
  if (typeof rankType === 'number') {
    // Map numeric rank types to actual Chrono Divide military rank names
    const rankNames: Record<number, string> = {
      0: 'Unranked',
      1: 'Private',
      2: 'Corporal',
      3: 'Sergeant',
      4: 'Lieutenant',
      5: 'Major',
      6: 'Colonel',
      7: 'Brigadier General',
      8: 'General',
      9: '5-Star General',
      10: 'Commander-in-chief',
    };
    return rankNames[rankType] || `Rank ${rankType}`;
  }
  return rankType;
}
