"use client";

import dynamic from "next/dynamic";
import { Paper, Typography } from "@mui/material";

const StatsChart = dynamic(() => import("./StatsChart"), {
  ssr: false,
  loading: () => (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Activity
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Loading chart...
      </Typography>
    </Paper>
  ),
});

export default function StatsChartLazy() {
  return <StatsChart />;
}
