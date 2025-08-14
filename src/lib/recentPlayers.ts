const RECENT_PLAYERS_KEY = "recent_players";
const MAX_RECENT_PLAYERS = 3;

export interface RecentPlayer {
  name: string;
  timestamp: number;
}

export function getRecentPlayers(): RecentPlayer[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(RECENT_PLAYERS_KEY);
    if (!stored) return [];

    const players = JSON.parse(stored) as RecentPlayer[];
    return Array.isArray(players) ? players : [];
  } catch (error) {
    console.error("Error reading recent players from localStorage:", error);
    return [];
  }
}

export function addRecentPlayer(playerName: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const currentPlayers = getRecentPlayers();

    const existingPlayers = currentPlayers.filter((p) => p.name !== playerName);

    const newPlayer: RecentPlayer = {
      name: playerName,
      timestamp: Date.now(),
    };

    const updatedPlayers = [newPlayer, ...existingPlayers].slice(0, MAX_RECENT_PLAYERS);

    localStorage.setItem(RECENT_PLAYERS_KEY, JSON.stringify(updatedPlayers));

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("recentPlayersChanged"));
    }
  } catch (error) {
    console.error("Error saving recent player to localStorage:", error);
  }
}

export function clearRecentPlayers(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(RECENT_PLAYERS_KEY);
  } catch (error) {
    console.error("Error clearing recent players from localStorage:", error);
  }
}
