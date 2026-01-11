"use client";

import { Box, Typography, Alert } from "@mui/material";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { ArrowBack, PlayArrow } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { sovietTheme } from "@/theme/themes";
import { getMockMatchData, MatchDetails } from "@/lib/matchData";
import MatchHeader from "./MatchHeader";
import MatchStatsOverview from "./MatchStatsOverview";
import MatchEconomyGraphs from "./MatchEconomyGraphs";
import MatchArmyGraphs from "./MatchArmyGraphs";
import MatchBuildingTimeline from "./MatchBuildingTimeline";
import RA2Button from "./RA2Button";

interface MatchPageClientProps {
  gameId: string;
  region: string;
  ladderType: string;
}




export default function MatchPageClient({ gameId, region, ladderType }: MatchPageClientProps) {
  const router = useRouter();

  let matchData: MatchDetails | null = null;
  let error: string | null = null;

  try {
    matchData = getMockMatchData(gameId);
  } catch {
    error = "Failed to load match data";
  }



  const content = (
    <Box sx={{ maxWidth: 1400, mx: "auto", p: 2 }}>
      {/* Navigation */}
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

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Match Data */}
      {matchData && (
        <>
          {/* Match Header with basic info, map, and players */}
          <MatchHeader match={matchData} region={region} ladderType={ladderType} />

          {/* Stats Overview - Units, Buildings, Economy */}
          <MatchStatsOverview players={matchData.players} />

          {/* Economy Graphs - Resource rate, harvesters, credits */}
          <MatchEconomyGraphs match={matchData} />

          {/* Army Graphs - Army value, unit count, composition */}
          <MatchArmyGraphs match={matchData} />

          {/* Building Timeline - First building times */}
          <MatchBuildingTimeline match={matchData} />
        </>
      )}
    </Box>
  );

  return (
    <ThemeProvider theme={sovietTheme}>
      <CssBaseline />
      {content}
    </ThemeProvider>
  );
}
