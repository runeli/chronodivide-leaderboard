'use client';

import PlayerNameLink from '@/components/PlayerNameLink';
import PlayerPerformanceGraph from '@/components/PlayerPerformanceGraph';
import RankIcon from '@/components/RankIcon';
import { formatRankType, LadderType, PlayerMatchHistoryEntry, usePlayerMatchHistory, usePlayerSearch } from '@/lib/api';
import { ArrowBack, Download } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';

interface PlayerPageClientProps {
  playerName: string;
}

const removeUnsafeFilenameCharacters = (input: string): string => {
  return input.replace(/[^0-9a-zA-Z_\-]+/g, '_').replace(/__+/g, '_');
};

const formatReplayFilename = (playerName: string, game: PlayerMatchHistoryEntry): string => {
  return `${playerName}_${[...(game.teamMates || []), ...(game.opponents || [])].join(
    '_'
  )}_${removeUnsafeFilenameCharacters(game.map)}_${removeUnsafeFilenameCharacters(new Date(game.timestamp).toISOString())}.rpl`.replace(
    /__+/g,
    '_'
  );
};

const isReplayAvailable = (game: PlayerMatchHistoryEntry): boolean => {
  return game.timestamp > 1754199900000;
};

const formatDuration = (mins: number | null | undefined) => {
  if (mins == null) {
    return '';
  }
  return `${mins} m`;
};

export default function PlayerPageClient({ playerName }: PlayerPageClientProps) {
  const router = useRouter();
  const decodedPlayerName = decodeURIComponent(playerName);
  const ladderType: LadderType = '1v1';

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
    return <Alert severity="error">Failed to load player data. Please check the player name and try again.</Alert>;
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
        {/* Player Statistics */}
        <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
          <Box sx={{ mb: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  {player.name}
                </Typography>

                {player.rank !== -1 && (
                  <>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" color="primary.main">
                        {player.mmr} MMR
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {player.points} LP
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <RankIcon rankType={player.rankType} size={18} />
                      <Typography variant="body2" color="text.secondary">
                        {formatRankType(player.rankType)}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,
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
                      {player.draws > 0 && (
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4" color="warning.main">
                            {player.draws}
                          </Typography>
                          <Typography variant="caption">Draws</Typography>
                        </Box>
                      )}
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      Win Rate: {((player.wins / (player.wins + player.losses)) * 100).toFixed(1)}%
                    </Typography>
                  </>
                )}

                {player.rank === -1 && (
                  <Typography variant="body2" color="text.secondary">
                    This player is not ranked yet.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Box>

          {/* Performance Graph */}
          {matchHistory && matchHistory.length > 0 && (
            <PlayerPerformanceGraph matchHistory={matchHistory} currentMMR={player.mmr} />
          )}
        </Box>

        {/* Match History */}
        <Box sx={{ flex: '2 1 600px' }}>
          <Box
            sx={{
              mb: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6">Recent Matches (Last 25)</Typography>
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
                  {matchHistory.slice(0, 25).map((match) => (
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
                        {isReplayAvailable(match) && (
                          <a download={formatReplayFilename(player.name, match)} href={match.replayUrl}>
                            <Download fontSize="small" />
                          </a>
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
