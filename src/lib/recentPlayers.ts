const PINNED_PLAYERS_KEY = "pinned_players";
const MAX_PINNED_PLAYERS = 10;
const SELECTED_REGION_KEY = "chronodivide-selected-region";

export interface PinnedPlayer {
  name: string;
  timestamp: number;
  rank?: number;
  mmr?: number;
  region: string;
  rankType?: string | number;
}

export function getPinnedPlayers(): PinnedPlayer[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(PINNED_PLAYERS_KEY);
    if (!stored) return [];

    const players = JSON.parse(stored) as PinnedPlayer[];
    return Array.isArray(players) ? players : [];
  } catch (error) {
    console.error("Error reading pinned players from localStorage:", error);
    return [];
  }
}

function filterOutPlayer(players: PinnedPlayer[], playerName: string, region: string): PinnedPlayer[] {
  return players.filter((p) => {
    if (p.name === playerName) {
      if (p.region === region) {
        return false;
      }
      return true;
    }
    return true;
  });
}

export function addPinnedPlayer(playerName: string, rank: number, mmr: number, region: string, rankType: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const currentPlayers = getPinnedPlayers();

    const existingPlayers = filterOutPlayer(currentPlayers, playerName, region);
    const newPlayer: PinnedPlayer = {
      name: playerName,
      timestamp: Date.now(),
      rank,
      mmr,
      region,
      rankType,
    };

    const updatedPlayers = [newPlayer, ...existingPlayers].slice(0, MAX_PINNED_PLAYERS);

    localStorage.setItem(PINNED_PLAYERS_KEY, JSON.stringify(updatedPlayers));

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("pinnedPlayersChanged"));
    }
  } catch (error) {
    console.error("Error saving pinned player to localStorage:", error);
  }
}

export function removePinnedPlayer(region: string, playerName: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const currentPlayers = getPinnedPlayers();
    const updatedPlayers = filterOutPlayer(currentPlayers, playerName, region);
    localStorage.setItem(PINNED_PLAYERS_KEY, JSON.stringify(updatedPlayers));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("pinnedPlayersChanged"));
    }
  } catch (error) {
    console.error("Error removing pinned player from localStorage:", error);
  }
}

export function isPlayerPinned(playerName: string, region: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const pinnedPlayers = getPinnedPlayers();
  return pinnedPlayers.some((p) => p.name === playerName && p.region === region);
}

export function clearPinnedPlayers(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(PINNED_PLAYERS_KEY);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("pinnedPlayersChanged"));
    }
  } catch (error) {
    console.error("Error clearing pinned players from localStorage:", error);
  }
}

export function getSavedRegion(): string {
  if (typeof window === "undefined") {
    return "am-eu";
  }

  try {
    const savedRegionId = localStorage.getItem(SELECTED_REGION_KEY);
    return savedRegionId || "am-eu";
  } catch (error) {
    console.error("Error reading saved region from localStorage:", error);
    return "am-eu";
  }
}

export function saveRegion(regionId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(SELECTED_REGION_KEY, regionId);
  } catch (error) {
    console.error("Error saving region to localStorage:", error);
  }
}
