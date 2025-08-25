import { Suspense } from "react";
import { CircularProgress, Box } from "@mui/material";
import Leaderboard from "./leaderboard";
import StatsChart from "@/components/StatsChart";

export default function Home() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      }
    >
      <Leaderboard />
      <StatsChart />
    </Suspense>
  );
}
