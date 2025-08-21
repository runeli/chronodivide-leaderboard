"use client";

import { IconButton, Tooltip } from "@mui/material";
import { PushPin, PushPinOutlined } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { addPinnedPlayer, removePinnedPlayer, isPlayerPinned } from "@/lib/recentPlayers";
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
    setIsPinned(isPlayerPinned(playerName));
  }, [playerName]);

  useEffect(() => {
    const handlePinnedPlayersChanged = () => {
      setIsPinned(isPlayerPinned(playerName));
    };

    window.addEventListener("pinnedPlayersChanged", handlePinnedPlayersChanged);
    return () => window.removeEventListener("pinnedPlayersChanged", handlePinnedPlayersChanged);
  }, [playerName]);

  const handleTogglePin = () => {
    if (isPinned) {
      removePinnedPlayer(playerName);
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
