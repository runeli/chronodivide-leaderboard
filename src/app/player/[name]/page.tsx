'use client';

import {
  Typography,
  Box,
  Card,
  CardContent,
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
  Avatar,
  Link,
} from '@mui/material';
import { ArrowBack, Download, Timeline } from '@mui/icons-material';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  usePlayerSearch,
  usePlayerMatchHistory,
  LadderType,
  PlayerRankedProfile,
  formatRankType,
} from '@/lib/api';
import PlayerNameLink from '@/components/PlayerNameLink';
import RankIcon from '@/components/RankIcon';

export default function PlayerProfile() {
  const params = useParams();
  const router = useRouter();
  const playerName = decodeURIComponent(params.name as string);
  const [ladderType] = useState<LadderType>('1v1');

  // Fetch player data
  const {
    data: players,
    error: playerError,
    isLoading: playerLoading,
  } = usePlayerSearch(ladderType, 'current', [playerName]);

  // Fetch match history
  const {
    data: matchHistory,
    error: historyError,
    isLoading: historyLoading,
  } = usePlayerMatchHistory(ladderType, playerName);

  const player = players?.[0];
  const isRanked = player && 'rank' in player && player.rank !== -1;

  const formatDuration = (seconds: number) => {
    if (isNaN(seconds) || seconds == null || seconds < 0) {
      return '-';
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getResultColor = (
    result: string
  ): 'success' | 'error' | 'warning' | 'default' => {
    switch (result) {
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

  const calculateWinRate = (wins: number, losses: number, draws: number) => {
    const total = wins + losses + draws;
    return total > 0 ? ((wins / total) * 100).toFixed(1) : '0.0';
  };

  const getPlayerInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.back()}
          variant="outlined"
        >
          Back to Leaderboard
        </Button>
        <Typography variant="h4" component="h1">
          Player Profile
        </Typography>
      </Box>

      {playerLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {playerError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load player data. Player might not exist or API might be
          down.
        </Alert>
      )}

      {player && (
        <Box
          sx={{
            display: 'flex',
            gap: 3,
            flexDirection: { xs: 'column', lg: 'row' },
          }}
        >
          {/* Player Info Card */}
          <Box sx={{ flex: { xs: 1, lg: '0 0 400px' } }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      mr: 2,
                      bgcolor: 'primary.main',
                    }}
                  >
                    {getPlayerInitials(playerName)}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" component="h2">
                      {playerName}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <RankIcon rankType={player.rankType} size={18} />
                      <Typography variant="body2" color="text.secondary">
                        {formatRankType(player.rankType)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {isRanked && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" color="primary" gutterBottom>
                      Rank #{(player as PlayerRankedProfile).rank}
                    </Typography>
                    <Typography variant="h4" gutterBottom>
                      {player.mmr} MMR
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {(player as PlayerRankedProfile).points} Ladder Points
                    </Typography>
                  </Box>
                )}

                {/* Game Stats */}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Game Statistics
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-around',
                      mb: 2,
                    }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="success.main">
                        {player.wins}
                      </Typography>
                      <Typography variant="caption">Wins</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="error.main">
                        {player.losses}
                      </Typography>
                      <Typography variant="caption">Losses</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="warning.main">
                        {player.draws}
                      </Typography>
                      <Typography variant="caption">Draws</Typography>
                    </Box>
                  </Box>
                  <Typography variant="body1" sx={{ textAlign: 'center' }}>
                    Win Rate:{' '}
                    <strong>
                      {calculateWinRate(
                        player.wins,
                        player.losses,
                        player.draws
                      )}
                      %
                    </strong>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Match History */}
          <Box sx={{ flex: 1 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Timeline sx={{ mr: 1 }} />
                  <Typography variant="h6">Recent Matches</Typography>
                </Box>

                {historyLoading && (
                  <Box
                    sx={{ display: 'flex', justifyContent: 'center', my: 2 }}
                  >
                    <CircularProgress size={24} />
                  </Box>
                )}

                {historyError && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    Failed to load match history.
                  </Alert>
                )}

                {matchHistory && matchHistory.length > 0 ? (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Result</TableCell>
                          <TableCell>Map</TableCell>
                          <TableCell>Opponent(s)</TableCell>
                          <TableCell>Duration</TableCell>
                          <TableCell>MMR</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Replay</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {matchHistory.slice(0, 10).map((match) => (
                          <TableRow key={match.gameId} hover>
                            <TableCell>
                              <Chip
                                label={match.result.toUpperCase()}
                                color={getResultColor(match.result)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {match.map}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {match.opponents.length > 0 ? (
                                <Box>
                                  {match.opponents.map((opponent, index) => (
                                    <Box key={index}>
                                      <PlayerNameLink
                                        playerName={opponent}
                                        variant="body2"
                                      />
                                    </Box>
                                  ))}
                                </Box>
                              ) : (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  N/A
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              {formatDuration(match.duration)}
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                color={
                                  match.mmrGain > 0
                                    ? 'success.main'
                                    : 'error.main'
                                }
                              >
                                {match.mmrGain > 0 ? '+' : ''}
                                {match.mmrGain}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {formatTimestamp(match.timestamp)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {match.replayUrl && (
                                <Button
                                  size="small"
                                  startIcon={<Download />}
                                  component={Link}
                                  href={match.replayUrl}
                                  target="_blank"
                                  variant="outlined"
                                >
                                  Download
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : matchHistory && matchHistory.length === 0 ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: 'center', py: 3 }}
                  >
                    No recent matches found.
                  </Typography>
                ) : null}
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}

      {!player && !playerLoading && !playerError && (
        <Alert severity="warning">
          Player &quot;{playerName}&quot; not found in the current season.
        </Alert>
      )}
    </Box>
  );
}
