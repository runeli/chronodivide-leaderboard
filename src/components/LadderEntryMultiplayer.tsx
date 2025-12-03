"use client";

import { Box, Typography } from "@mui/material";
import PlayerCountry from "./PlayerCountry";
import PlayerNameLink from "./PlayerNameLink";
import { LadderType, PlayerInfo } from "@/lib/api";

interface LadderEntryMultiplayerProps {
  playerName: string;
  playerCountryId?: number;
  teamMates?: PlayerInfo[];
  opponents: PlayerInfo[];
  ladderType: LadderType;
}

export default function LadderEntryMultiplayer({
  playerName,
  playerCountryId,
  teamMates = [],
  opponents,
  ladderType,
}: LadderEntryMultiplayerProps) {
  const teamPlayers = [
    { name: playerName, countryId: playerCountryId },
    ...teamMates.map((tm) => ({ name: tm.name, countryId: tm.countryId })),
  ];

  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, flex: 1 }}>
        {teamPlayers.map((player, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              minHeight: "24px",
              height: "24px",
            }}
          >
            <PlayerCountry countryId={player.countryId} />
            <PlayerNameLink playerName={player.name} ladderType={ladderType} variant="body2" />
          </Box>
        ))}
        {Array.from({ length: Math.max(0, opponents.length - teamPlayers.length) }).map((_, index) => (
          <Box key={`empty-left-${index}`} sx={{ minHeight: "24px", height: "24px" }} />
        ))}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, flex: 1 }}>
        {opponents.map((opponent, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              minHeight: "24px",
              height: "24px",
            }}
          >
            <PlayerCountry countryId={opponent.countryId} />
            <PlayerNameLink playerName={opponent.name} ladderType={ladderType} variant="body2" />
          </Box>
        ))}
        {Array.from({ length: Math.max(0, teamPlayers.length - opponents.length) }).map((_, index) => (
          <Box key={`empty-right-${index}`} sx={{ minHeight: "24px", height: "24px" }} />
        ))}
      </Box>
    </Box>
  );
}

