"use client";

import { Box, Typography, List, ListItem, ListItemButton, Paper } from "@mui/material";
import { PushPin } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPinnedPlayers, PinnedPlayer } from "@/lib/recentPlayers";
import RankIcon from "@/components/RankIcon";
import { formatRankType, defaultRegions } from "@/lib/api";

export default function PinnedPlayers() {
  const router = useRouter();
  const [pinnedPlayers, setPinnedPlayers] = useState<PinnedPlayer[]>([]);

  const refreshPinnedPlayers = () => {
    const players = getPinnedPlayers();
    setPinnedPlayers(players);
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

  const handlePlayerClick = (playerName: string, playerRegion: string) => {
    router.push(`/player/${encodeURIComponent(playerName)}?region=${playerRegion}`);
  };

  const groupedPlayers = pinnedPlayers.reduce(
    (groups, player) => {
      if (!groups[player.name]) {
        groups[player.name] = [];
      }
      groups[player.name].push(player);
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
        <List dense sx={{ py: 0, mr: 3 }}>
          {pinnedPlayers.map((player) => {
            const hasMultiplePlayersWithSameName = groupedPlayers[player.name].length > 1;
            const displayName = hasMultiplePlayersWithSameName
              ? `${player.name} (${getRegionLabel(player.region)})`
              : player.name;

            return (
              <ListItem key={`${player.name}-${player.timestamp}`} disablePadding sx={{ cursor: "pointer" }}>
                <ListItemButton
                  onClick={() => handlePlayerClick(player.name, player.region)}
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
