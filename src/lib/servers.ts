import { Region } from "@/contexts/RegionContext";
import { defaultRegions } from "@/lib/api";

const SERVERS_INI_URL = "https://gateway.chronodivide.com/legacy/realms/servers.ini";
const CACHE_KEY = "chronodivide-servers";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// Latest known regions; null until fetched so the api.ts <-> servers.ts
// import cycle never touches defaultRegions at module-init time.
let currentRegions: Region[] | null = null;

export function getRegions(): Region[] {
  return currentRegions ?? defaultRegions;
}

export function parseServersIni(ini: string): Region[] {
  const sections: Record<string, string>[] = [];
  let current: Record<string, string> | undefined;
  for (const line of ini.split(/\r?\n/)) {
    const trimmed = line.trim();
    const section = trimmed.match(/^\[(.+)\]$/);
    if (section) {
      current = { id: section[1] };
      sections.push(current);
    } else if (current && trimmed.includes("=")) {
      const eq = trimmed.indexOf("=");
      current[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
    }
  }
  return sections
    .filter((s) => s.wladderUrl)
    .map((s) => ({
      id: s.id,
      baseUrl: new URL(s.wladderUrl).origin,
      label: s.label || s.id,
      available: s.available === "yes",
    }));
}

export async function fetchRegions(): Promise<Region[]> {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { timestamp, regions } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL_MS && Array.isArray(regions) && regions.length > 0) {
        currentRegions = regions;
        return regions;
      }
    }
  } catch {
    // ignore bad cache, fall through to fetch
  }

  try {
    const res = await fetch(SERVERS_INI_URL);
    if (!res.ok) throw new Error(`servers.ini request failed with status ${res.status}`);
    const regions = parseServersIni(await res.text());
    if (regions.length === 0) throw new Error("servers.ini parsed to empty list");
    localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), regions }));
    currentRegions = regions;
    return regions;
  } catch (error) {
    console.error("Failed to fetch server list, using defaults:", error);
    return getRegions();
  }
}
