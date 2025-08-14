"use client";

import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  IconButton,
  Tooltip,
  Button,
  Chip,
  Skeleton,
} from "@mui/material";
import { Delete, Person } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRecentPlayers, clearRecentPlayers, RecentPlayer } from "@/lib/recentPlayers";
import { usePlayerSearch, formatRankType } from "@/lib/api";
import RankIcon from "@/components/RankIcon";

export default function RecentPlayers() {
  const router = useRouter();
  const [recentPlayers, setRecentPlayers] = useState<RecentPlayer[]>([]);

  const refreshRecentPlayers = () => {
    const players = getRecentPlayers();
    setRecentPlayers(players);
  };

  useEffect(() => {
    refreshRecentPlayers();
  }, []);

  useEffect(() => {
    const handleRecentPlayersChanged = () => {
      refreshRecentPlayers();
    };

    window.addEventListener("recentPlayersChanged", handleRecentPlayersChanged);
    return () => window.removeEventListener("recentPlayersChanged", handleRecentPlayersChanged);
  }, []);

  const playerNames = recentPlayers.map((player) => player.name);
  const { data: playerProfiles, isLoading: profilesLoading } = usePlayerSearch("1v1", "current", playerNames);

  const handlePlayerClick = (playerName: string) => {
    router.push(`/player/${encodeURIComponent(playerName)}`);
  };

  const handleClearAll = () => {
    clearRecentPlayers();
    setRecentPlayers([]);
  };

  if (recentPlayers.length === 0) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <Person fontSize="small" />
        Recently Viewed Players
      </Typography>

      <Paper sx={{ p: 2, position: "relative" }}>
        <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}>
          <Tooltip title="Clear all recent players">
            <IconButton size="small" onClick={handleClearAll} color="error">
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <List dense sx={{ py: 0, mr: 3 }}>
          {recentPlayers.map((player, index) => {
            const playerProfile = playerProfiles?.find((profile) => profile.name === player.name);

            return (
              <ListItem key={`${player.name}-${player.timestamp}`} disablePadding>
                <ListItemButton onClick={() => handlePlayerClick(player.name)} sx={{ borderRadius: 1, mb: 0.5 }}>
                  <Box sx={{ flex: 1, minHeight: 40 }}>
                    <Typography variant="body2" color="primary" fontWeight="medium">
                      {player.name}
                    </Typography>
                    {profilesLoading ? (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                        <Skeleton variant="circular" width={14} height={14} />
                        <Skeleton variant="text" width={60} height={12} />
                      </Box>
                    ) : (
                      playerProfile &&
                      playerProfile.rank > 0 && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                          <RankIcon rankType={playerProfile.rankType} size={14} />
                          <Typography variant="caption" color="text.secondary">
                            {formatRankType(playerProfile.rankType)}
                          </Typography>
                        </Box>
                      )
                    )}
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
