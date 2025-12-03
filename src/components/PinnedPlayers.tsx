"use client";

import { Box, Typography, List, ListItem, ListItemButton, Paper, IconButton, Tooltip } from "@mui/material";
import { ClearAll, PushPin } from "@mui/icons-material";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getPinnedPlayers, PinnedPlayer, clearPinnedPlayers } from "@/lib/pinnedPlayers";
import RankIcon from "@/components/RankIcon";
import { formatRankType, defaultRegions } from "@/lib/api";

export default function PinnedPlayers() {
  const [pinnedPlayers, setPinnedPlayers] = useState<PinnedPlayer[]>([]);

  const refreshPinnedPlayers = () => {
    const players = getPinnedPlayers();
    setPinnedPlayers(players);
  };

  const handleClearAll = () => {
    clearPinnedPlayers();
  };

  useEffect(() => {
    refreshPinnedPlayers();
  }, []);

  useEffect(() => {
    const handlePinnedPlayersChanged = () => {
      refreshPinnedPlayers();
    };

    window.addEventListener("pinnedPlayersChanged", handlePinnedPlayersChanged);
    return () => window.removeEventListener("pinnedPlayersChanged", handlePinnedPlayersChanged);
  }, []);

  const groupedPlayers = pinnedPlayers.reduce(
    (groups, player) => {
      const playerName = player.name.toLowerCase();
      if (!groups[playerName]) {
        groups[playerName] = [];
      }
      groups[playerName].push(player);
      return groups;
    },
    {} as Record<string, PinnedPlayer[]>
  );

  const getRegionLabel = (regionId: string) => {
    const region = defaultRegions.find((r) => r.id === regionId);
    return region ? region.label : regionId;
  };

  if (pinnedPlayers.length === 0) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <PushPin fontSize="small" />
        Pinned Players
      </Typography>

      <Paper sx={{ p: 2, position: "relative" }}>
        <Box sx={{ position: "absolute", top: 8, right: 8 }}>
          <Tooltip title="Clear all pinned players">
            <IconButton size="small" onClick={handleClearAll} aria-label="Clear all pinned players">
              <ClearAll fontSize="small" color="primary" />
            </IconButton>
          </Tooltip>
        </Box>
        <List dense sx={{ py: 0, mr: 3 }}>
          {pinnedPlayers.map((player) => {
            const hasMultiplePlayersWithSameName = groupedPlayers[player.name.toLowerCase()].length > 1;
            const displayName = hasMultiplePlayersWithSameName
              ? `${player.name} (${getRegionLabel(player.region)})`
              : player.name;

            return (
              <ListItem key={`${player.name}-${player.timestamp}`} disablePadding sx={{ cursor: "pointer" }}>
                <ListItemButton
                  component={Link}
                  href={`/player/${player.region}/1v1/${encodeURIComponent(player.name)}`}
                  sx={{ borderRadius: 1, mb: 0.5, cursor: "pointer" }}
                >
                  <Box sx={{ flex: 1, minHeight: 40 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="body2" color="primary" fontWeight="medium">
                          {displayName}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                      <RankIcon rankType={player.rankType} size={14} />
                      <Typography variant="caption" color="text.secondary">
                        {formatRankType(player.rankType)}
                      </Typography>
                    </Box>
                  </Box>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </Box>
  );
}
