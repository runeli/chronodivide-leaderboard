"use client";

import { Box, Typography } from "@mui/material";
import PlayerCountry from "./PlayerCountry";
import PlayerNameLink from "./PlayerNameLink";
import { LadderType, PlayerInfo } from "@/lib/api";

interface LadderEntry1v1Props {
  playerName: string;
  playerCountryId?: number;
  opponent: PlayerInfo;
  ladderType: LadderType;
}

export default function LadderEntry1v1({
  playerName,
  playerCountryId,
  opponent,
  ladderType,
}: LadderEntry1v1Props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <PlayerCountry countryId={playerCountryId} />
      <PlayerNameLink playerName={playerName} ladderType={ladderType} variant="body2" />
      <Typography component="span" variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
        {" - "}
      </Typography>
      <PlayerCountry countryId={opponent.countryId} />
      <PlayerNameLink playerName={opponent.name} ladderType={ladderType} variant="body2" />
    </Box>
  );
}

