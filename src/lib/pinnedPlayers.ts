const PINNED_PLAYERS_KEY = "pinned_players";
const MAX_PINNED_PLAYERS = 10;

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
  return players.filter((p) => !(p.name === playerName && p.region === region));
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

    window.dispatchEvent(new CustomEvent("pinnedPlayersChanged"));
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
    window.dispatchEvent(new CustomEvent("pinnedPlayersChanged"));
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
    window.dispatchEvent(new CustomEvent("pinnedPlayersChanged"));
  } catch (error) {
    console.error("Error clearing pinned players from localStorage:", error);
  }
}
