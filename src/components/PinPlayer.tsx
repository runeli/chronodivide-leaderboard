"use client";

import { IconButton, Tooltip } from "@mui/material";
import { PushPin, PushPinOutlined } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { addPinnedPlayer, removePinnedPlayer, isPlayerPinned } from "@/lib/pinnedPlayers";
import { useRegion } from "@/contexts/RegionContext";

interface PinPlayerProps {
  playerName: string;
  playerRank: number;
  playerMmr: number;
  playerRankType: string;
}

export default function PinPlayer({ playerName, playerRank, playerMmr, playerRankType }: PinPlayerProps) {
  const { selectedRegion } = useRegion();
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    setIsPinned(isPlayerPinned(playerName, selectedRegion.id));
  }, [playerName, selectedRegion.id]);

  useEffect(() => {
    const handlePinnedPlayersChanged = () => {
      setIsPinned(isPlayerPinned(playerName, selectedRegion.id));
    };

    window.addEventListener("pinnedPlayersChanged", handlePinnedPlayersChanged);
    return () => window.removeEventListener("pinnedPlayersChanged", handlePinnedPlayersChanged);
  }, [playerName, selectedRegion.id]);

  const handleTogglePin = () => {
    if (isPinned) {
      removePinnedPlayer(selectedRegion.id, playerName);
    } else {
      addPinnedPlayer(playerName, playerRank, playerMmr, selectedRegion.id, playerRankType);
    }
  };

  return (
    <Tooltip title={isPinned ? "Unpin player" : "Pin player"}>
      <IconButton
        onClick={handleTogglePin}
        color="primary"
        size="small"
        sx={{
          cursor: "pointer",
          ml: 1,
          p: 0.5,
          minWidth: "auto",
          width: 24,
          height: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isPinned ? <PushPin fontSize="small" /> : <PushPinOutlined fontSize="small" />}
      </IconButton>
    </Tooltip>
  );
}
