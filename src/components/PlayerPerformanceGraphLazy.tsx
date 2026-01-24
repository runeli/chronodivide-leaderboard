"use client";

import dynamic from "next/dynamic";
import { Paper, Typography } from "@mui/material";

const PlayerPerformanceGraph = dynamic(() => import("./PlayerPerformanceGraph"), {
  ssr: false,
  loading: () => (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        MMR Performance
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Loading chart...
      </Typography>
    </Paper>
  ),
});

export default PlayerPerformanceGraph;
