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
  FormControl,
  InputLabel,
  Pagination,
  SelectChangeEvent,
  Chip,
  TextField,
  Button,
  Autocomplete,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from '@mui/icons-material';
import PlayerNameLink from '@/components/PlayerNameLink';
import RankIcon from '@/components/RankIcon';
import {
  useLadder,
  useSeasons,
  useSeason,
  usePlayerSearch,
  LadderType,
  SeasonId,
  LadderHead,
  getTopLadders,
  formatRankType,
} from '@/lib/api';

const LADDER_PAGE_SIZE = 25;

export default function Leaderboard() {
  const router = useRouter();
  const [selectedSeason, setSelectedSeason] = useState<SeasonId>('current');
  const [ladderType, setLadderType] = useState<LadderType>('1v1');
  const [selectedLadderId, setSelectedLadderId] = useState<number>(0); // Default to Generals
  const [page, setPage] = useState(1);

  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);

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
  } = useSeason(selectedSeason);

  // Fetch ladder data (API uses 1-based indexing)
  const { data, error, isLoading } = useLadder(
    ladderType,
    selectedSeason,
    selectedLadderId,
    (page - 1) * LADDER_PAGE_SIZE + 1,
    LADDER_PAGE_SIZE
  );

  // Search for player (only search when query has 2+ characters)
  const { data: searchPlayerData, error: searchError } = usePlayerSearch(
    ladderType,
    selectedSeason,
    searchQuery.length >= 2 ? [searchQuery] : []
  );

  // Reset to first available ladder when season or ladder type changes
  useEffect(() => {
    if (season) {
      const availableLadders = getTopLadders(season, ladderType);
      if (availableLadders.length > 0) {
        // Try to find a regular division ladder first (ID >= 2), fallback to Contenders (1), then Generals (0)
        const regularLadder = availableLadders.find((l) => l.id >= 2);
        const fallbackLadder =
          availableLadders.find((l) => l.id === 1) || availableLadders[0];
        const selectedLadder = regularLadder || fallbackLadder;

        setSelectedLadderId(selectedLadder.id);
        setPage(1);
      }
    }
  }, [season, ladderType]);

  // Reset to current season when seasons are loaded
  useEffect(() => {
    if (seasons && seasons.includes('current')) {
      setSelectedSeason('current');
    }
  }, [seasons]);

  const handleSeasonChange = (event: SelectChangeEvent<string>) => {
    setSelectedSeason(event.target.value as SeasonId);
    setPage(1);
  };

  const handleLadderTypeChange = (event: SelectChangeEvent<string>) => {
    setLadderType(event.target.value as LadderType);
    setPage(1);
  };

  const handleLadderChange = (event: SelectChangeEvent<number>) => {
    setSelectedLadderId(event.target.value as number);
    setPage(1);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
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

  const handleSearchSelect = (
    event: React.SyntheticEvent,
    value: string | null
  ) => {
    if (value) {
      // Navigate to player profile
      router.push(`/player/${encodeURIComponent(value)}`);
    }
  };

  const handleDirectSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/player/${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Update search results when search data changes
  useEffect(() => {
    if (searchPlayerData && searchPlayerData.length > 0) {
      setSearchResults(searchPlayerData.map((player) => player.name));
    } else {
      setSearchResults([]);
    }
  }, [searchPlayerData]);

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
          <Autocomplete
            freeSolo
            options={searchResults}
            inputValue={searchQuery}
            onInputChange={(event, newInputValue) => {
              setSearchQuery(newInputValue);
            }}
            onChange={handleSearchSelect}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Enter player name..."
                variant="outlined"
                size="small"
                sx={{ minWidth: 300 }}
                onChange={handleSearchChange}
                onKeyPress={handleSearchKeyPress}
              />
            )}
            sx={{ flex: 1, maxWidth: 400 }}
            noOptionsText={
              searchQuery.length < 2
                ? 'Type at least 2 characters'
                : 'No players found'
            }
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
        {searchError && (
          <Alert severity="warning" sx={{ mt: 1 }}>
            Failed to search for player. Please try again.
          </Alert>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="season-select-label">Season</InputLabel>
          <Select
            labelId="season-select-label"
            id="season-select"
            value={selectedSeason}
            label="Season"
            onChange={handleSeasonChange}
            disabled={seasonsLoading}
          >
            {seasons?.map((season) => (
              <MenuItem key={season} value={season}>
                {getSeasonDisplayName(season)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="ladder-type-select-label">Game Mode</InputLabel>
          <Select
            labelId="ladder-type-select-label"
            id="ladder-type-select"
            value={ladderType}
            label="Game Mode"
            onChange={handleLadderTypeChange}
          >
            <MenuItem value="1v1">1v1</MenuItem>
            <MenuItem value="2v2-random">2v2 Random</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="ladder-select-label">Division</InputLabel>
          <Select
            labelId="ladder-select-label"
            id="ladder-select"
            value={selectedLadderId}
            label="Division"
            onChange={handleLadderChange}
            disabled={seasonLoading || !availableLadders.length}
          >
            {availableLadders.map((ladder) => (
              <MenuItem key={ladder.id} value={ladder.id}>
                {getLadderDisplayName(ladder)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Show current selection info */}
      {season && selectedLadder && (
        <Box sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Showing:
          </Typography>
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
                          color={player.rank <= 10 ? 'warning' : 'default'}
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
