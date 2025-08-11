'use client';

import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Tooltip,
} from '@mui/material';
import { ArrowBack, Download } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { usePlayerMatchHistory, usePlayerSearch, LadderType, PlayerMatchHistoryEntry } from '@/lib/api';
import PlayerNameLink from '@/components/PlayerNameLink';
import PlayerPerformanceGraph from '@/components/PlayerPerformanceGraph';
import PlayerProfileCard from '@/components/PlayerProfileCard';

interface PlayerPageClientProps {
  playerName: string;
}

const removeUnsafeFilenameCharacters = (input: string): string => {
  return input.replace(/[^0-9a-zA-Z_\-]+/g, '_').replace(/__+/g, '_');
};

const isReplayAvailable = (game: PlayerMatchHistoryEntry): boolean => {
  return game.timestamp > 1754199900000;
};

const createSafePlayerName = (rawPlayerName: string): string => {
  try {
    const decoded = decodeURIComponent(rawPlayerName);
    const sanitized = decoded
      .replace(/[<>\"'&]/g, '')
      .trim()
      .substring(0, 50);
    return sanitized || 'Unknown Player';
  } catch {
    return rawPlayerName.substring(0, 50) || 'Unknown Player';
  }
};

export default function PlayerPageClient({ playerName }: PlayerPageClientProps) {
  const router = useRouter();
  const decodedPlayerName = decodeURIComponent(playerName);
  const safePlayerName = createSafePlayerName(playerName);
  const ladderType: LadderType = '1v1';
  const [downloadingReplays, setDownloadingReplays] = useState<Set<string>>(new Set());

  const {
    data: players,
    error: playerError,
    isLoading: playerLoading,
  } = usePlayerSearch(ladderType, 'current', [decodedPlayerName]);

  const {
    data: matchHistory,
    error: matchHistoryError,
    isLoading: matchHistoryLoading,
  } = usePlayerMatchHistory(ladderType, decodedPlayerName);

  const formatDuration = (mins: number | null | undefined) => {
    if (mins == null) {
      return '';
    }
    return `${mins} m`;
  };

  const generateReplayFilename = (match: PlayerMatchHistoryEntry, playerName: string) => {
    const date = new Date(match.timestamp).toISOString().split('T')[0];
    const allPlayers = [...(match.teamMates || []), ...(match.opponents || [])].join('_');
    const cleanPlayerName = removeUnsafeFilenameCharacters(playerName);
    const cleanMap = removeUnsafeFilenameCharacters(match.map);
    const result = match.result.toUpperCase();

    return `${date}_${cleanPlayerName}_vs_${allPlayers}_${result}_${cleanMap}.rpl`.replace(/__+/g, '_');
  };

  const handleDownload = async (match: PlayerMatchHistoryEntry) => {
    const gameId = match.gameId;

    if (downloadingReplays.has(gameId)) {
      return;
    }

    setDownloadingReplays((prev) => new Set(prev).add(gameId));

    try {
      const response = await fetch(match.replayUrl, {
        method: 'GET',
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = generateReplayFilename(match, decodedPlayerName);
      a.style.display = 'none';

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      window.open(match.replayUrl, '_blank');
    } finally {
      setDownloadingReplays((prev) => {
        const newSet = new Set(prev);
        newSet.delete(gameId);
        return newSet;
      });
    }
  };

  const getResultColor = (result: string) => {
    switch (result.toLowerCase()) {
      case 'win':
        return 'success';
      case 'loss':
        return 'error';
      case 'draw':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (playerLoading || matchHistoryLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (playerError || matchHistoryError || !players || players.length === 0) {
    return (
      <Alert severity="error">
        <Button startIcon={<ArrowBack />} onClick={() => router.push('/')} variant="outlined">
          Back to Leaderboard
        </Button>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Failed to load <b>{safePlayerName}</b> data. Wrong region?
          </Typography>
        </Box>
      </Alert>
    );
  }

  const player = players[0];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Button startIcon={<ArrowBack />} onClick={() => router.push('/')} variant="outlined">
          Back to Leaderboard
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
          <PlayerProfileCard player={player} matchHistory={matchHistory} />

          {matchHistory && matchHistory.length > 0 && (
            <PlayerPerformanceGraph matchHistory={matchHistory} currentMMR={player.mmr} />
          )}
        </Box>

        <Box sx={{ flex: '2 1 600px' }}>
          <Box
            sx={{
              mb: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
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
                    <TableCell>Result</TableCell>
                    <TableCell>MMR Change</TableCell>
                    <TableCell>Map</TableCell>
                    <TableCell>Opponents</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Replay</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {matchHistory.slice(0, 50).map((match) => (
                    <TableRow key={match.gameId}>
                      <TableCell>{new Date(match.timestamp).toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip
                          label={match.result.toUpperCase()}
                          color={getResultColor(match.result)}
                          size="small"
                          sx={{ minWidth: 60, width: 60 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color={match.mmrGain > 0 ? 'success.main' : 'error.main'}>
                          {match.mmrGain > 0 ? '+' : ''}
                          {match.mmrGain}
                        </Typography>
                      </TableCell>
                      <TableCell>{match.map}</TableCell>
                      <TableCell>
                        {match.opponents.map((opponent, index) => (
                          <Box key={index}>
                            <PlayerNameLink playerName={opponent} variant="body2" />
                          </Box>
                        ))}
                      </TableCell>
                      <TableCell>{formatDuration(match.duration)}</TableCell>
                      <TableCell>
                        {isReplayAvailable(match) ? (
                          <Tooltip
                            title={`Download as: ${generateReplayFilename(match, decodedPlayerName)}`}
                            placement="top"
                          >
                            <Box
                              component="button"
                              onClick={() => handleDownload(match)}
                              disabled={downloadingReplays.has(match.gameId)}
                              sx={{
                                background: 'none',
                                border: 'none',
                                cursor: downloadingReplays.has(match.gameId) ? 'default' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '4px',
                                color: 'inherit',
                                borderRadius: 0,
                                opacity: downloadingReplays.has(match.gameId) ? 0.5 : 1,
                                '&:hover': {
                                  color: downloadingReplays.has(match.gameId) ? 'inherit' : 'primary.main',
                                },
                              }}
                              aria-label="Download replay"
                            >
                              {downloadingReplays.has(match.gameId) ? (
                                <CircularProgress size={16} />
                              ) : (
                                <Download fontSize="small" />
                              )}
                            </Box>
                          </Tooltip>
                        ) : (
                          <Box sx={{ opacity: 0.3 }}>
                            <Download fontSize="small" />
                          </Box>
                        )}
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
}
