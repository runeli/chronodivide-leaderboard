"use client";

import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import { ThemeProvider, CssBaseline } from "@mui/material";
import {
  ArrowBack,
  ArrowDropUp,
  ArrowDropDown,
  PlayArrow,
  Download,
  ContentCopy,
  OpenInNew,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  usePlayerMatchHistory,
  usePlayerSearch,
  LadderType,
  PlayerMatchHistoryEntry,
  getPreferredSide,
} from "@/lib/api";
import PlayerPerformanceGraph from "@/components/PlayerPerformanceGraphLazy";
import PlayerProfileCard from "@/components/PlayerProfileCard";
import { useRegion } from "@/contexts/RegionContext";
import RA2Button from "./RA2Button";
import LadderEntry1v1 from "./LadderEntry1v1";
import LadderEntryMultiplayer from "./LadderEntryMultiplayer";
import { alliedTheme, neutralTheme } from "@/theme/themes";

interface PlayerPageClientProps {
  playerName: string;
  ladderType: LadderType;
}

const removeUnsafeFilenameCharacters = (input: string): string => {
  return input.replace(/[^0-9a-zA-Z_\-]+/g, "_").replace(/__+/g, "_");
};

// if you are reading this and wondering why, we repleased this play replay in game feateure on this date
// now its safe to remove. It was here just so that players will not click on older replays and wonder
// why they do not work
const isReplayAvailable = (game: PlayerMatchHistoryEntry): boolean => {
  const gameDate = new Date(game.timestamp);
  const now = new Date(Date.UTC(2025, 11, 16, 13, 0, 0, 0)); // 2025-12-16 13:00 UTC
  return gameDate.getTime() > now.getTime();
};

const createSafePlayerName = (rawPlayerName: string): string => {
  try {
    const decoded = decodeURIComponent(rawPlayerName);
    const sanitized = decoded
      .replace(/[<>\"'&]/g, "")
      .trim()
      .substring(0, 50);
    return sanitized || "Unknown Player";
  } catch {
    return rawPlayerName.substring(0, 50) || "Unknown Player";
  }
};

export default function PlayerPageClient({ playerName, ladderType }: PlayerPageClientProps) {
  const router = useRouter();
  const { selectedRegion } = useRegion();
  const regionId = selectedRegion.id;
  const decodedPlayerName = (() => {
    try {
      return decodeURIComponent(playerName);
    } catch {
      return playerName;
    }
  })();
  const safePlayerName = createSafePlayerName(playerName);
  const [downloadingReplays, setDownloadingReplays] = useState<Set<string>>(new Set());
  const [menuAnchor, setMenuAnchor] = useState<{ element: HTMLElement; gameId: string } | null>(null);

  const {
    data: players,
    error: playerError,
    isLoading: playerLoading,
  } = usePlayerSearch(regionId, ladderType, "current", [decodedPlayerName]);

  const {
    data: matchHistory,
    error: matchHistoryError,
    isLoading: matchHistoryLoading,
  } = usePlayerMatchHistory(regionId, ladderType, decodedPlayerName);

  const formatDuration = (mins: number | null | undefined) => {
    if (mins === null || mins === undefined) {
      return "";
    }
    return `${mins} m`;
  };

  const handleReplayClick = (replayUrl: string) => {
    const encodedReplayUrl = `https://game.chronodivide.com/#/replay/${encodeURIComponent(replayUrl)}`;
    if (encodedReplayUrl) {
      window.open(encodedReplayUrl, "_blank");
    }
    setMenuAnchor(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, gameId: string) => {
    setMenuAnchor({ element: event.currentTarget, gameId });
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleCopyReplayUrl = async (replayUrl: string) => {
    const encodedReplayUrl = `https://game.chronodivide.com/#/replay/${encodeURIComponent(replayUrl)}`;
    await navigator.clipboard.writeText(encodedReplayUrl);
    setMenuAnchor(null);
  };

  const generateReplayFilename = (match: PlayerMatchHistoryEntry, playerName: string) => {
    const date = new Date(match.timestamp).toISOString().split("T")[0];
    const teamMates = (match.teamMates || []).map((p) => p.name);
    const opponents = (match.opponents || []).map((p) => p.name);
    const allPlayers = [...teamMates, ...opponents].join("_");
    const cleanPlayerName = removeUnsafeFilenameCharacters(playerName);
    const cleanMap = removeUnsafeFilenameCharacters(match.map);
    const result = match.result.toUpperCase();

    return `${date}_${cleanPlayerName}_vs_${allPlayers}_${result}_${cleanMap}.rpl`.replace(/__+/g, "_");
  };

  const handleDownload = async (match: PlayerMatchHistoryEntry) => {
    const gameId = match.gameId;

    if (downloadingReplays.has(gameId)) {
      return;
    }

    setDownloadingReplays((prev) => new Set(prev).add(gameId));

    try {
      if (!match.replayUrl) {
        throw new Error("Replay URL unavailable");
      }
      const response = await fetch(match.replayUrl, {
        method: "GET",
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = generateReplayFilename(match, decodedPlayerName);
      a.style.display = "none";

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(match.replayUrl, "_blank");
    } finally {
      setDownloadingReplays((prev) => {
        const newSet = new Set(prev);
        newSet.delete(gameId);
        return newSet;
      });
    }
  };

  // removed old result color chip usage; merged into MMR Change column with arrows

  if (playerLoading || matchHistoryLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (playerError || matchHistoryError || !players || players.length === 0) {
    return (
      <Alert severity="error">
        <RA2Button startIcon={<ArrowBack />} onClick={() => router.push("/")}>
          Back to Leaderboard
        </RA2Button>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Failed to load <b>{safePlayerName}</b> data. Wrong region?
          </Typography>
        </Box>
      </Alert>
    );
  }

  const player = players[0];

  const preferredSide = getPreferredSide(matchHistory);

  const content = (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 2 }}>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <RA2Button startIcon={<ArrowBack />} onClick={() => router.push("/")}>
          Back to Leaderboard
        </RA2Button>
      </Box>

      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
        <Box sx={{ flex: "1 1 300px", minWidth: { xs: "100%", sm: 300 } }}>
          <PlayerProfileCard playerPreferredSide={preferredSide} player={player} matchHistory={matchHistory} />

          {matchHistory && matchHistory.length > 0 && (
            <PlayerPerformanceGraph matchHistory={matchHistory} currentMMR={player.mmr} />
          )}
        </Box>

        <Box sx={{ flex: "2 1 600px", minWidth: { xs: "100%", sm: 600 } }}>
          <Box
            sx={{
              mb: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Recent Matches (Last 50)</Typography>
          </Box>

          {matchHistory && matchHistory.length > 0 ? (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Map</TableCell>
                    <TableCell>MMR Change</TableCell>
                    <TableCell>Players</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Replay</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {matchHistory.slice(0, 50).map((match) => (
                    <TableRow key={match.gameId}>
                      <TableCell>{new Date(match.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{match.map}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          {match.result === "win" && <ArrowDropUp sx={{ color: "success.main", fontSize: 32 }} />}
                          {match.result === "loss" && <ArrowDropDown sx={{ color: "error.main", fontSize: 32 }} />}
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            color={
                              match.mmrGain > 0 ? "success.main" : match.mmrGain < 0 ? "error.main" : "text.secondary"
                            }
                          >
                            {match.mmrGain > 0 ? "+" : ""}
                            {match.mmrGain}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {match.teamMates && match.teamMates.length > 0 ? (
                          <LadderEntryMultiplayer
                            playerName={player.name}
                            playerCountryId={match.countryId}
                            teamMates={match.teamMates}
                            opponents={match.opponents}
                            ladderType={ladderType}
                          />
                        ) : match.opponents?.[0] ? (
                          <LadderEntry1v1
                            playerName={player.name}
                            playerCountryId={match.countryId}
                            opponent={match.opponents[0]}
                            ladderType={ladderType}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Unknown opponent
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>{formatDuration(match.duration)}</TableCell>
                      <TableCell>
                        {match.replayUrl ? (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Tooltip
                              title="Replay options"
                              placement="top"
                              componentsProps={{
                                tooltip: {
                                  sx: {
                                    backgroundColor: "background.paper",
                                    color: "text.primary",
                                    border: "1px solid",
                                    borderColor: "primary.main",
                                    borderRadius: 0,
                                    fontSize: 13,
                                  },
                                },
                              }}
                            >
                              <Box
                                component="button"
                                onClick={(e) => handleMenuOpen(e, match.gameId)}
                                sx={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  padding: 0,
                                  borderRadius: 0,
                                  color: "primary.main",
                                  "&:hover": {
                                    color: "primary.main",
                                    filter: "drop-shadow(0 0 4px currentColor) drop-shadow(0 0 8px currentColor)",
                                  },
                                }}
                              >
                                <PlayArrow sx={{ fontSize: 18 }} />
                              </Box>
                            </Tooltip>
                            <Menu
                              anchorEl={menuAnchor?.gameId === match.gameId ? menuAnchor.element : null}
                              open={menuAnchor?.gameId === match.gameId}
                              onClose={handleMenuClose}
                              anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                              }}
                              transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                              }}
                              PaperProps={{
                                sx: {
                                  backgroundColor: "background.paper",
                                  border: "1px solid",
                                  borderColor: "primary.main",
                                  borderRadius: 0,
                                },
                              }}
                            >
                              {isReplayAvailable(match) && (
                                <MenuItem
                                  onClick={() => handleReplayClick(match.replayUrl!)}
                                  sx={{
                                    "&:hover": {
                                      backgroundColor: "action.hover",
                                    },
                                  }}
                                >
                                  <OpenInNew color="primary" sx={{ fontSize: 18, mr: 1 }} />
                                  Open replay in game
                                </MenuItem>
                              )}
                              <MenuItem
                                onClick={() => handleDownload(match)}
                                disabled={downloadingReplays.has(match.gameId)}
                                sx={{
                                  "&:hover": {
                                    backgroundColor: "action.hover",
                                  },
                                }}
                              >
                                {downloadingReplays.has(match.gameId) ? (
                                  <CircularProgress size={16} sx={{ mr: 1 }} />
                                ) : (
                                  <Download color="primary" sx={{ fontSize: 18, mr: 1 }} />
                                )}
                                Download replay
                              </MenuItem>
                              <MenuItem
                                onClick={() => handleCopyReplayUrl(match.replayUrl!)}
                                sx={{
                                  "&:hover": {
                                    backgroundColor: "action.hover",
                                  },
                                }}
                              >
                                <ContentCopy color="primary" sx={{ fontSize: 18, mr: 1 }} />
                                Copy Replay URL
                              </MenuItem>
                            </Menu>
                          </Box>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info">No match history available for this player.</Alert>
          )}
        </Box>
      </Box>
    </Box>
  );

  if (preferredSide === "allies") {
    return (
      <ThemeProvider theme={alliedTheme}>
        <CssBaseline />
        {content}
      </ThemeProvider>
    );
  }

  if (preferredSide === undefined) {
    return (
      <ThemeProvider theme={neutralTheme}>
        <CssBaseline />
        {content}
      </ThemeProvider>
    );
  }

  return content;
}
