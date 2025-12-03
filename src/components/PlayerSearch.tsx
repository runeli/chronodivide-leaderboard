"use client";

import { useState, memo } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { Search } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import RA2Button from "@/components/RA2Button";
import { useRegion } from "@/contexts/RegionContext";
import { LadderType } from "@/lib/api";

interface PlayerSearchProps {
  ladderType?: LadderType;
}

const PlayerSearch = memo(function PlayerSearch({ ladderType = "1v1" }: PlayerSearchProps) {
  const router = useRouter();
  const { selectedRegion } = useRegion();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleDirectSearch();
    }
  };

  const handleDirectSearch = () => {
    if (searchQuery.trim()) {
      const playerName = searchQuery.trim();
      router.push(`/player/${selectedRegion.id}/${ladderType}/${encodeURIComponent(playerName)}`);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Search Player
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr auto" },
          gap: 2,
          alignItems: "center",
        }}
      >
        <TextField
          placeholder="Enter player name..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyPress={handleSearchKeyPress}
        />
        <RA2Button
          variant="contained"
          startIcon={<Search />}
          onClick={handleDirectSearch}
          sx={{ minWidth: "fit-content" }}
        >
          Search
        </RA2Button>
      </Box>
    </Box>
  );
});

export default PlayerSearch;
