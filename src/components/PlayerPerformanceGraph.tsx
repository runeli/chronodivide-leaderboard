'use client';

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Match {
  gameId: string;
  result: string;
  mmrGain: number;
  timestamp: number;
  map: string;
  opponents: string[];
  duration: number;
}

interface PlayerPerformanceGraphProps {
  matchHistory: Match[];
  currentMMR?: number;
}

interface DataPoint {
  match: number;
  mmr: number;
  date: string;
  result: string;
  mmrChange: number;
}

const PlayerPerformanceGraph: React.FC<PlayerPerformanceGraphProps> = ({
  matchHistory,
  currentMMR,
}) => {
  // Process match history to create cumulative MMR data
  const processMatchData = (): DataPoint[] => {
    if (!matchHistory || matchHistory.length === 0) return [];

    // Start with current MMR and work backwards
    let runningMMR = currentMMR || 0;
    const data: DataPoint[] = [];

    // Sort matches by timestamp (oldest first)
    const sortedMatches = [...matchHistory].sort(
      (a, b) => a.timestamp - b.timestamp
    );

    // Calculate starting MMR by working backwards from current
    for (let i = sortedMatches.length - 1; i >= 0; i--) {
      runningMMR -= sortedMatches[i].mmrGain;
    }

    // Now build the graph data points
    sortedMatches.forEach((match, index) => {
      runningMMR += match.mmrGain;

      data.push({
        match: index + 1,
        mmr: runningMMR,
        date: new Date(match.timestamp).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        result: match.result,
        mmrChange: match.mmrGain,
      });
    });

    return data;
  };

  const data = processMatchData();

  if (data.length === 0) {
    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Performance Graph
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No match history available for graph
        </Typography>
      </Paper>
    );
  }

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{
      payload: DataPoint;
      value: number;
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box
          sx={{
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            p: 1,
            borderRadius: 1,
          }}
        >
          <Typography variant="body2">Match #{label}</Typography>
          <Typography variant="body2">MMR: {payload[0].value}</Typography>
          <Typography
            variant="body2"
            color={data.mmrChange > 0 ? 'success.main' : 'error.main'}
          >
            Change: {data.mmrChange > 0 ? '+' : ''}
            {data.mmrChange}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {data.date} - {data.result.toUpperCase()}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  const minMMR = Math.min(...data.map((d) => d.mmr));
  const maxMMR = Math.max(...data.map((d) => d.mmr));
  const padding = (maxMMR - minMMR) * 0.1;

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        MMR Performance
      </Typography>
      <Box sx={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 0, 0, 0.2)"
            />
            <XAxis
              dataKey="match"
              stroke="#ffff00"
              tick={{ fill: '#ffff00', fontSize: 12 }}
            />
            <YAxis
              domain={[minMMR - padding, maxMMR + padding]}
              stroke="#ffff00"
              tick={{ fill: '#ffff00', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="mmr"
              stroke="#ff0000"
              strokeWidth={2}
              dot={{ fill: '#ff0000', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, fill: '#ffff00', stroke: '#ff0000' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 1, display: 'block' }}
      >
        Shows MMR progression over last {data.length} matches
      </Typography>
    </Paper>
  );
};

export default PlayerPerformanceGraph;
