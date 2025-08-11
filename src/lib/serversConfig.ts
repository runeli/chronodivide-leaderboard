// Utility functions for fetching and parsing servers.ini configuration

// Default server configuration (used immediately, updated by background fetch)
const DEFAULT_SERVERS_INI = `[am-eu]
label="Americas & Europe"
available=yes
gameVersion=0.77
wolUrl="wss://wol-eu1.chronodivide.com"
apiRegUrl="https://wol-eu1.chronodivide.com/register"
wladderUrl="https://wol-eu1.chronodivide.com/ladder"
wgameresUrl="https://wol-eu1.chronodivide.com/wgameres"

[sea]
label="South-East Asia"
available=yes
gameVersion=0.77
wolUrl="wss://wol-sea1.chronodivide.com"
apiRegUrl="https://wol-sea1.chronodivide.com/register"
wladderUrl="https://wol-sea1.chronodivide.com/ladder"
wgameresUrl="https://wol-sea1.chronodivide.com/wgameres"
mapTransferUrl="https://wol-sea1.chronodivide.com/map-transfer"`;

export interface ServerConfig {
  id: string;
  label: string;
  baseUrl: string;
  available: boolean;
  gameVersion?: string;
  wolUrl?: string;
  wladderUrl?: string;
  wgameresUrl?: string;
  mapTransferUrl?: string;
}

/**
 * Parse INI file content into server configurations
 */
function parseIniContent(content: string): ServerConfig[] {
  const servers: ServerConfig[] = [];
  const lines = content.split("\n").map((line) => line.trim());

  let currentSection: string | null = null;
  let currentConfig: Partial<ServerConfig> = {};

  for (const line of lines) {
    // Skip empty lines and comments
    if (!line || line.startsWith(";") || line.startsWith("#")) {
      continue;
    }

    // Check for section headers [section-name]
    const sectionMatch = line.match(/^\[([^\]]+)\]$/);
    if (sectionMatch) {
      // Save previous section if it exists
      if (currentSection && currentConfig.label) {
        servers.push({
          id: currentSection,
          label: currentConfig.label,
          baseUrl: currentConfig.baseUrl || "",
          available: currentConfig.available ?? true,
          gameVersion: currentConfig.gameVersion,
          wolUrl: currentConfig.wolUrl,
          wladderUrl: currentConfig.wladderUrl,
          wgameresUrl: currentConfig.wgameresUrl,
          mapTransferUrl: currentConfig.mapTransferUrl,
        });
      }

      // Start new section
      currentSection = sectionMatch[1];
      currentConfig = {};
      continue;
    }

    // Parse key-value pairs
    const kvMatch = line.match(/^([^=]+)=(.*)$/);
    if (kvMatch && currentSection) {
      const key = kvMatch[1].trim();
      let value = kvMatch[2].trim();

      // Remove quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }

      switch (key) {
        case "label":
          currentConfig.label = value;
          break;
        case "available":
          currentConfig.available = value.toLowerCase() === "yes";
          break;
        case "gameVersion":
          currentConfig.gameVersion = value;
          break;
        case "wolUrl":
          currentConfig.wolUrl = value;
          break;
        case "apiRegUrl":
          // Extract base URL by removing /register suffix
          currentConfig.baseUrl = value.replace(/\/register$/, "");
          break;
        case "wladderUrl":
          currentConfig.wladderUrl = value;
          break;
        case "wgameresUrl":
          currentConfig.wgameresUrl = value;
          break;
        case "mapTransferUrl":
          currentConfig.mapTransferUrl = value;
          break;
      }
    }
  }

  // Save the last section
  if (currentSection && currentConfig.label) {
    servers.push({
      id: currentSection,
      label: currentConfig.label,
      baseUrl: currentConfig.baseUrl || "",
      available: currentConfig.available ?? true,
      gameVersion: currentConfig.gameVersion,
      wolUrl: currentConfig.wolUrl,
      wladderUrl: currentConfig.wladderUrl,
      wgameresUrl: currentConfig.wgameresUrl,
      mapTransferUrl: currentConfig.mapTransferUrl,
    });
  }

  return servers;
}

/**
 * Get default server configuration (parsed from embedded INI)
 */
export function getDefaultServersConfig(): ServerConfig[] {
  return parseIniContent(DEFAULT_SERVERS_INI);
}

/**
 * Fetch and parse servers.ini configuration from remote URL
 * Throws error if fetch fails - caller should handle fallbacks
 */
export async function fetchServersConfig(): Promise<ServerConfig[]> {
  const response = await fetch("https://game.chronodivide.com/servers.ini");
  if (!response.ok) {
    throw new Error(`Failed to fetch servers config: ${response.status}`);
  }

  const content = await response.text();
  const servers = parseIniContent(content);

  // Filter out servers without proper API URLs
  return servers.filter((server) => server.baseUrl && server.label);
}

/**
 * Get the default server (EU priority)
 */
export function getDefaultServer(servers: ServerConfig[]): ServerConfig {
  // Try to find EU server first
  const euServer = servers.find((server) => server.id === "am-eu" && server.available);
  if (euServer) {
    return euServer;
  }

  // Fallback to first available server
  const firstAvailable = servers.find((server) => server.available);
  if (firstAvailable) {
    return firstAvailable;
  }

  // Ultimate fallback
  return (
    servers[0] || {
      id: "am-eu",
      label: "Americas & Europe",
      baseUrl: "https://wol-eu1.chronodivide.com",
      available: true,
    }
  );
}
