'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Box,
  Select,
  MenuItem,
  Pagination,
  SelectChangeEvent,
  Chip,
  TextField,
  Button,
} from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from '@mui/icons-material';
import PlayerNameLink from '@/components/PlayerNameLink';
import RankIcon from '@/components/RankIcon';
import {
  useLadder,
  useSeasons,
  useSeason,
  LadderType,
  SeasonId,
  LadderHead,
  getTopLadders,
  formatRankType,
} from '@/lib/api';

const LADDER_PAGE_SIZE = 25;

export default function Leaderboard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedSeason, setSelectedSeason] = useState<SeasonId>('');
  const [ladderType, setLadderType] = useState<LadderType>('1v1');
  const [selectedLadderId, setSelectedLadderId] = useState<number>(0); // Default to Generals
  const [page, setPage] = useState(1);

  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');

  // Helper function to update URL with current selections
  const updateURL = useCallback(
    (updates: {
      season?: SeasonId;
      gameMode?: LadderType;
      division?: number;
      page?: number;
    }) => {
      const params = new URLSearchParams(searchParams.toString());

      if (updates.season !== undefined) {
        if (updates.season) {
          params.set('season', updates.season);
        } else {
          params.delete('season');
        }
      }

      if (updates.gameMode !== undefined) {
        params.set('gameMode', updates.gameMode);
      }

      if (updates.division !== undefined) {
        params.set('division', updates.division.toString());
      }

      if (updates.page !== undefined) {
        if (updates.page > 1) {
          params.set('page', updates.page.toString());
        } else {
          params.delete('page');
        }
      }

      const newURL = `${window.location.pathname}?${params.toString()}`;
      router.replace(newURL, { scroll: false });
    },
    [searchParams, router]
  );

  // Initialize state from URL parameters
  useEffect(() => {
    const seasonParam = searchParams.get('season') as SeasonId;
    const gameModeParam = searchParams.get('gameMode') as LadderType;
    const divisionParam = searchParams.get('division');
    const pageParam = searchParams.get('page');

    if (
      seasonParam &&
      (seasonParam === 'current' || !isNaN(Number(seasonParam)))
    ) {
      setSelectedSeason(seasonParam);
    }

    if (
      gameModeParam &&
      (gameModeParam === '1v1' || gameModeParam === '2v2-random')
    ) {
      setLadderType(gameModeParam);
    }

    if (divisionParam && !isNaN(Number(divisionParam))) {
      setSelectedLadderId(Number(divisionParam));
    }

    if (pageParam && !isNaN(Number(pageParam))) {
      setPage(Number(pageParam));
    }
  }, [searchParams]); // Include searchParams dependency

  // Fetch available seasons
  const {
    data: seasons,
    error: seasonsError,
    isLoading: seasonsLoading,
  } = useSeasons(ladderType);

  // Fetch season details to get available ladders
  const {
    data: season,
    error: seasonError,
    isLoading: seasonLoading,
  } = useSeason(selectedSeason || 'current');

  // Fetch ladder data (API uses 1-based indexing)
  const { data, error, isLoading } = useLadder(
    ladderType,
    selectedSeason || 'current',
    selectedLadderId,
    (page - 1) * LADDER_PAGE_SIZE + 1,
    LADDER_PAGE_SIZE
  );

  // Auto-select first available ladder when season or ladder type changes (only if current selection is invalid)
  useEffect(() => {
    if (season) {
      const availableLadders = getTopLadders(season, ladderType);
      if (availableLadders.length > 0) {
        // Check if current selected ladder is still valid
        const currentLadderStillExists = availableLadders.find(
          (l) => l.id === selectedLadderId
        );

        if (!currentLadderStillExists) {
          // Only auto-select if current ladder doesn't exist in new available ladders
          // Try to find a regular division ladder first (ID >= 2), fallback to Contenders (1), then Generals (0)
          const regularLadder = availableLadders.find((l) => l.id >= 2);
          const fallbackLadder =
            availableLadders.find((l) => l.id === 1) || availableLadders[0];
          const targetLadderId = (regularLadder || fallbackLadder).id;

          setSelectedLadderId(targetLadderId);
          setPage(1);
          updateURL({ division: targetLadderId, page: 1 });
        }
      }
    }
  }, [season, ladderType, selectedLadderId, updateURL]);

  // Set initial season when seasons are loaded
  useEffect(() => {
    if (seasons && seasons.length > 0 && !selectedSeason) {
      // Prefer 'current' if available, otherwise use the first season
      const initialSeason = seasons.includes('current')
        ? 'current'
        : seasons[0];
      setSelectedSeason(initialSeason);
      updateURL({ season: initialSeason });
    }
  }, [seasons, selectedSeason, updateURL]);

  const handleSeasonChange = (event: SelectChangeEvent<string>) => {
    const newSeason = event.target.value as SeasonId;
    setSelectedSeason(newSeason);
    setPage(1);
    updateURL({ season: newSeason, page: 1 });
  };

  const handleLadderTypeChange = (event: SelectChangeEvent<string>) => {
    const newLadderType = event.target.value as LadderType;
    setLadderType(newLadderType);
    setPage(1);
    updateURL({ gameMode: newLadderType, page: 1 });
  };

  const handleLadderChange = (event: SelectChangeEvent<number>) => {
    const newLadderId = event.target.value as number;
    setSelectedLadderId(newLadderId);
    setPage(1);
    updateURL({ division: newLadderId, page: 1 });
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    updateURL({ page: value });
  };

  // Search handlers
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleDirectSearch();
    }
  };

  const handleDirectSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/player/${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Get available ladders for the current season and ladder type
  const availableLadders = season ? getTopLadders(season, ladderType) : [];
  const selectedLadder = availableLadders.find(
    (l) => l.id === selectedLadderId
  );

  // Format ladder display name
  const getLadderDisplayName = (ladder: LadderHead) => {
    if (ladder.divisionName) {
      return `${ladder.name} - ${ladder.divisionName}`;
    }
    return ladder.name;
  };

  // Format season display name
  const getSeasonDisplayName = (seasonId: string) => {
    if (seasonId === 'current') return 'Current Season';
    return `Season ${seasonId}`;
  };

  return (
    <Paper sx={{ p: 2, m: 1 }}>
      <Typography variant="h4" gutterBottom>
        Chrono Divide Leaderboard
      </Typography>

      {/* Player Search */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Search Player
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Enter player name..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyPress={handleSearchKeyPress}
            sx={{ flex: 1, maxWidth: 400 }}
          />
          <Button
            variant="contained"
            startIcon={<Search />}
            onClick={handleDirectSearch}
            disabled={!searchQuery.trim()}
          >
            Search
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <Box sx={{ minWidth: 120 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Season
          </Typography>
          <Select
            id="season-select"
            value={selectedSeason || ''}
            onChange={handleSeasonChange}
            disabled={seasonsLoading || !seasons}
            variant="outlined"
            size="small"
            sx={{ minWidth: 120 }}
          >
            {seasons?.map((season) => (
              <MenuItem key={season} value={season}>
                {getSeasonDisplayName(season)}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Box sx={{ minWidth: 120 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Game Mode
          </Typography>
          <Select
            id="ladder-type-select"
            value={ladderType}
            onChange={handleLadderTypeChange}
            variant="outlined"
            size="small"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="1v1">1v1</MenuItem>
            <MenuItem value="2v2-random">2v2 Random</MenuItem>
          </Select>
        </Box>

        <Box sx={{ minWidth: 200 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Division
          </Typography>
          <Select
            id="ladder-select"
            value={selectedLadderId}
            onChange={handleLadderChange}
            disabled={seasonLoading || !availableLadders.length}
            variant="outlined"
            size="small"
            sx={{ minWidth: 200 }}
          >
            {availableLadders.map((ladder) => (
              <MenuItem key={ladder.id} value={ladder.id}>
                {getLadderDisplayName(ladder)}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      {/* Show current selection info */}
      {season && selectedLadder && (
        <Box sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
          <Chip
            label={getLadderDisplayName(selectedLadder)}
            size="small"
            color="primary"
            variant="outlined"
          />
          <Typography variant="body2" color="text.secondary">
            (
            {season.totalRankedPlayers.find(
              (tp) => tp.ladderType === ladderType
            )?.value || 0}{' '}
            total players)
          </Typography>
        </Box>
      )}

      {(isLoading || seasonsLoading || seasonLoading) && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {(error || seasonsError || seasonError) && (
        <Alert severity="error">
          Failed to load ladder data. Please try again or select a different
          season/division.
        </Alert>
      )}

      {data && (
        <>
          <TableContainer>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>MMR</TableCell>
                  <TableCell>Wins</TableCell>
                  <TableCell>Losses</TableCell>
                  <TableCell>Draws</TableCell>
                  <TableCell>Win Rate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.records.map((player) => {
                  const totalGames = player.wins + player.losses + player.draws;
                  const winRate =
                    totalGames > 0
                      ? ((player.wins / totalGames) * 100).toFixed(1)
                      : '0.0';

                  return (
                    <TableRow hover key={player.name}>
                      <TableCell>
                        <Chip
                          label={player.rank}
                          size="small"
                          color={'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <PlayerNameLink playerName={player.name} />
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            mt: 0.5,
                          }}
                        >
                          <RankIcon rankType={player.rankType} size={14} />
                          <Typography variant="caption" color="text.secondary">
                            {formatRankType(player.rankType)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{player.mmr}</TableCell>
                      <TableCell>{player.wins}</TableCell>
                      <TableCell>{player.losses}</TableCell>
                      <TableCell>{player.draws}</TableCell>
                      <TableCell>{winRate}%</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Pagination
              count={Math.ceil(data.totalCount / LADDER_PAGE_SIZE)}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      )}
    </Paper>
  );
}
