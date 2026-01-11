import { PlayerInfo } from "./api";

// ============================================================================
// Core Match Types
// ============================================================================

export interface MatchDetails {
  gameId: string;
  timestamp: number;
  duration: number; // in minutes
  map: string;
  mapImageUrl?: string;
  ladderType: "1v1" | "2v2-random";
  players: MatchPlayer[];
  timeSeries: MatchTimeSeries;
  events: MatchEvent[];
}

export interface MatchPlayer extends PlayerInfo {
  result: "win" | "loss" | "draw";
  team: number;
  stats: PlayerMatchStats;
  buildingTimeline: BuildingEvent[];
}

// ============================================================================
// Player Statistics
// ============================================================================

export interface PlayerMatchStats {
  units: UnitStats;
  buildings: BuildingStats;
  economy: EconomyStats;
  combat: CombatStats;
}

export interface UnitStats {
  built: number;
  killed: number;
  lost: number;
  captured: number;
  sold: number;
  // By category
  infantryBuilt: number;
  vehiclesBuilt: number;
  aircraftBuilt: number;
  navalBuilt: number;
}

export interface BuildingStats {
  built: number;
  lost: number;
  captured: number;
  sold: number;
}

export interface EconomyStats {
  totalCreditsCollected: number;
  creditsFromOre: number;
  creditsFromOilDerricks: number;
  creditsSpent: number;
  peakCredits: number;
}

export interface CombatStats {
  damageDealt: number;
  damageReceived: number;
  killDeathRatio: number;
  // By unit type
  infantryKills: number;
  vehicleKills: number;
  aircraftKills: number;
  navalKills: number;
  buildingKills: number;
}

// ============================================================================
// Time Series Data for Graphs
// ============================================================================

export interface MatchTimeSeries {
  // Each array contains [timestamp, player1Value, player2Value, ...]
  timestamps: number[]; // game time in seconds
  armyValue: number[][];
  unitCount: number[][];
  harvesterCount: number[][];
  resourceRate: number[][]; // credits per minute
  creditsBalance: number[][];
}

export interface TimeSeriesPoint {
  time: number; // game time in seconds
  values: Record<string, number>; // playerName -> value
}

// ============================================================================
// Building Timeline
// ============================================================================

export interface BuildingEvent {
  buildingName: string;
  buildingType: BuildingCategory;
  completedAt: number; // game time in seconds
  isFirst?: boolean; // first of its type in the match
}

export type BuildingCategory =
  | "power"
  | "refinery"
  | "barracks"
  | "warFactory"
  | "airforce"
  | "naval"
  | "tech"
  | "defense"
  | "superweapon"
  | "other";

// ============================================================================
// Match Events
// ============================================================================

export interface MatchEvent {
  timestamp: number; // game time in seconds
  type: EventType;
  playerName: string;
  description: string;
  details?: string;
}

export type EventType =
  | "first_unit"
  | "first_tank"
  | "first_aircraft"
  | "first_naval"
  | "superweapon_built"
  | "superweapon_fired"
  | "building_destroyed"
  | "mass_casualties"
  | "tech_unlock"
  | "expansion"
  | "veterancy";

// ============================================================================
// Mock Data Generator
// ============================================================================

function generateTimeSeries(
  durationMinutes: number,
  player1Advantage: number = 1.0
): MatchTimeSeries {
  const intervalSeconds = 30;
  const totalPoints = Math.floor((durationMinutes * 60) / intervalSeconds);
  
  const timestamps: number[] = [];
  const armyValue: number[][] = [];
  const unitCount: number[][] = [];
  const harvesterCount: number[][] = [];
  const resourceRate: number[][] = [];
  const creditsBalance: number[][] = [];

  let p1Army = 0;
  let p2Army = 0;
  let p1Units = 0;
  let p2Units = 0;
  let p1Harvesters = 1;
  let p2Harvesters = 1;
  let p1Rate = 800;
  let p2Rate = 800;
  let p1Credits = 10000;
  let p2Credits = 10000;

  for (let i = 0; i <= totalPoints; i++) {
    const gameTime = i * intervalSeconds;
    timestamps.push(gameTime);

    // Simulate army value growth with some variance
    const growth1 = Math.random() * 2000 * player1Advantage;
    const growth2 = Math.random() * 2000;
    const loss1 = gameTime > 300 ? Math.random() * 500 : 0;
    const loss2 = gameTime > 300 ? Math.random() * 600 * player1Advantage : 0;
    
    p1Army = Math.max(0, p1Army + growth1 - loss1);
    p2Army = Math.max(0, p2Army + growth2 - loss2);
    armyValue.push([p1Army, p2Army]);

    // Unit counts
    if (gameTime > 60) {
      p1Units += Math.random() > 0.3 ? Math.floor(Math.random() * 3) : 0;
      p2Units += Math.random() > 0.3 ? Math.floor(Math.random() * 3) : 0;
      p1Units = Math.max(0, p1Units - (gameTime > 300 ? Math.floor(Math.random() * 2) : 0));
      p2Units = Math.max(0, p2Units - (gameTime > 300 ? Math.floor(Math.random() * 2 * player1Advantage) : 0));
    }
    unitCount.push([p1Units, p2Units]);

    // Harvesters - gradual increase
    if (gameTime > 120 && Math.random() > 0.9) {
      p1Harvesters = Math.min(6, p1Harvesters + 1);
    }
    if (gameTime > 120 && Math.random() > 0.92) {
      p2Harvesters = Math.min(5, p2Harvesters + 1);
    }
    // Occasional harvester losses
    if (gameTime > 400 && Math.random() > 0.95) {
      p2Harvesters = Math.max(0, p2Harvesters - 1);
    }
    harvesterCount.push([p1Harvesters, p2Harvesters]);

    // Resource rate based on harvesters
    p1Rate = 400 + p1Harvesters * 300 + Math.random() * 200;
    p2Rate = 400 + p2Harvesters * 300 + Math.random() * 200;
    resourceRate.push([p1Rate, p2Rate]);

    // Credits balance
    p1Credits += p1Rate * (intervalSeconds / 60) - growth1 * 0.8;
    p2Credits += p2Rate * (intervalSeconds / 60) - growth2 * 0.8;
    p1Credits = Math.max(0, p1Credits);
    p2Credits = Math.max(0, p2Credits);
    creditsBalance.push([p1Credits, p2Credits]);
  }

  return {
    timestamps,
    armyValue,
    unitCount,
    harvesterCount,
    resourceRate,
    creditsBalance,
  };
}

function generateBuildingTimeline(playerName: string, isWinner: boolean): BuildingEvent[] {
  const advantage = isWinner ? 0.9 : 1.1;
  
  return [
    { buildingName: "Power Plant", buildingType: "power", completedAt: Math.floor(15 * advantage), isFirst: true },
    { buildingName: "Ore Refinery", buildingType: "refinery", completedAt: Math.floor(45 * advantage), isFirst: true },
    { buildingName: "Barracks", buildingType: "barracks", completedAt: Math.floor(70 * advantage), isFirst: true },
    { buildingName: "War Factory", buildingType: "warFactory", completedAt: Math.floor(110 * advantage), isFirst: true },
    { buildingName: "Power Plant", buildingType: "power", completedAt: Math.floor(130 * advantage) },
    { buildingName: "Ore Refinery", buildingType: "refinery", completedAt: Math.floor(160 * advantage) },
    { buildingName: "Air Force Command HQ", buildingType: "airforce", completedAt: Math.floor(200 * advantage), isFirst: true },
    { buildingName: "Battle Lab", buildingType: "tech", completedAt: Math.floor(280 * advantage), isFirst: true },
    ...(isWinner ? [
      { buildingName: "Weather Control Device", buildingType: "superweapon" as BuildingCategory, completedAt: 420, isFirst: true },
    ] : []),
  ];
}

function generateEvents(player1Name: string, player2Name: string, durationMinutes: number): MatchEvent[] {
  const events: MatchEvent[] = [
    { timestamp: 75, type: "first_unit", playerName: player1Name, description: "First infantry unit trained", details: "GI" },
    { timestamp: 80, type: "first_unit", playerName: player2Name, description: "First infantry unit trained", details: "Conscript" },
    { timestamp: 125, type: "first_tank", playerName: player1Name, description: "First tank produced", details: "Grizzly Tank" },
    { timestamp: 135, type: "first_tank", playerName: player2Name, description: "First tank produced", details: "Rhino Tank" },
    { timestamp: 220, type: "first_aircraft", playerName: player1Name, description: "First aircraft built", details: "Harrier" },
    { timestamp: 295, type: "tech_unlock", playerName: player1Name, description: "Battle Lab completed", details: "Tier 3 units unlocked" },
    { timestamp: 350, type: "mass_casualties", playerName: player2Name, description: "Major unit losses", details: "8 tanks destroyed in engagement" },
    { timestamp: 420, type: "superweapon_built", playerName: player1Name, description: "Superweapon constructed", details: "Weather Control Device" },
  ];

  if (durationMinutes > 10) {
    events.push(
      { timestamp: 540, type: "superweapon_fired", playerName: player1Name, description: "Superweapon deployed", details: "Lightning Storm" },
      { timestamp: 580, type: "building_destroyed", playerName: player2Name, description: "Construction Yard destroyed", details: "Match-ending blow" }
    );
  }

  return events.filter(e => e.timestamp <= durationMinutes * 60).sort((a, b) => a.timestamp - b.timestamp);
}

export function getMockMatchData(gameId: string): MatchDetails {
  const durationMinutes = 12;
  const player1Name = "CommanderAlex";
  const player2Name = "TankMaster2000";

  const timeSeries = generateTimeSeries(durationMinutes, 1.2);

  const mapName = "Little Big Lake";
  const mapImageUrl = mapName === "Little Big Lake" ? "/map-images/ev4dxf.jpg" : undefined;

  return {
    gameId,
    timestamp: Date.now() - 3600000, // 1 hour ago
    duration: durationMinutes,
    map: mapName,
    mapImageUrl,
    ladderType: "1v1",
    players: [
      {
        name: player1Name,
        countryId: 0, // America (Allied)
        colorId: 0,
        result: "win",
        team: 1,
        stats: {
          units: {
            built: 87,
            killed: 62,
            lost: 34,
            captured: 2,
            sold: 3,
            infantryBuilt: 45,
            vehiclesBuilt: 32,
            aircraftBuilt: 8,
            navalBuilt: 2,
          },
          buildings: {
            built: 18,
            lost: 4,
            captured: 1,
            sold: 0,
          },
          economy: {
            totalCreditsCollected: 48500,
            creditsFromOre: 38200,
            creditsFromOilDerricks: 10300,
            creditsSpent: 46800,
            peakCredits: 12400,
          },
          combat: {
            damageDealt: 285000,
            damageReceived: 142000,
            killDeathRatio: 1.82,
            infantryKills: 28,
            vehicleKills: 24,
            aircraftKills: 4,
            navalKills: 0,
            buildingKills: 12,
          },
        },
        buildingTimeline: generateBuildingTimeline(player1Name, true),
      },
      {
        name: player2Name,
        countryId: 5, // Russia (Soviet)
        colorId: 1,
        result: "loss",
        team: 2,
        stats: {
          units: {
            built: 72,
            killed: 34,
            lost: 58,
            captured: 0,
            sold: 1,
            infantryBuilt: 38,
            vehiclesBuilt: 28,
            aircraftBuilt: 4,
            navalBuilt: 2,
          },
          buildings: {
            built: 14,
            lost: 9,
            captured: 0,
            sold: 0,
          },
          economy: {
            totalCreditsCollected: 38200,
            creditsFromOre: 31500,
            creditsFromOilDerricks: 6700,
            creditsSpent: 37800,
            peakCredits: 8900,
          },
          combat: {
            damageDealt: 142000,
            damageReceived: 285000,
            killDeathRatio: 0.59,
            infantryKills: 14,
            vehicleKills: 12,
            aircraftKills: 6,
            navalKills: 0,
            buildingKills: 4,
          },
        },
        buildingTimeline: generateBuildingTimeline(player2Name, false),
      },
    ],
    timeSeries,
    events: generateEvents(player1Name, player2Name, durationMinutes),
  };
}

// Helper to format game time (seconds) to MM:SS
export function formatGameTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Helper to get building category color
export function getBuildingCategoryColor(category: BuildingCategory): string {
  const colors: Record<BuildingCategory, string> = {
    power: "#ffeb3b",
    refinery: "#4caf50",
    barracks: "#2196f3",
    warFactory: "#ff9800",
    airforce: "#00bcd4",
    naval: "#3f51b5",
    tech: "#9c27b0",
    defense: "#795548",
    superweapon: "#f44336",
    other: "#9e9e9e",
  };
  return colors[category];
}

// Helper to get event type icon/color
export function getEventTypeColor(type: EventType): string {
  const colors: Record<EventType, string> = {
    first_unit: "#4caf50",
    first_tank: "#ff9800",
    first_aircraft: "#00bcd4",
    first_naval: "#3f51b5",
    superweapon_built: "#f44336",
    superweapon_fired: "#d32f2f",
    building_destroyed: "#ff5722",
    mass_casualties: "#e91e63",
    tech_unlock: "#9c27b0",
    expansion: "#8bc34a",
    veterancy: "#ffc107",
  };
  return colors[type];
}
