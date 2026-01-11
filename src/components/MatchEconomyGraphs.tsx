"use client";

import { Box, Paper, Typography, Grid } from "@mui/material";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { MatchDetails, formatGameTime } from "@/lib/matchData";
import { useTheme, alpha } from "@mui/material/styles";

interface MatchEconomyGraphsProps {
  match: MatchDetails;
}

interface ChartDataPoint {
  time: string;
  timeSeconds: number;
  player1: number;
  player2: number;
  player1Name: string;
  player2Name: string;
}

function prepareChartData(
  timestamps: number[],
  values: number[][],
  player1Name: string,
  player2Name: string
): ChartDataPoint[] {
  return timestamps.map((time, index) => ({
    time: formatGameTime(time),
    timeSeconds: time,
    player1: Math.round(values[index][0]),
    player2: Math.round(values[index][1]),
    player1Name,
    player2Name,
  }));
}

interface EconomyTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    payload: ChartDataPoint;
  }>;
  label?: string;
  valuePrefix?: string;
  valueSuffix?: string;
}

function EconomyTooltip({ active, payload, label, valuePrefix = "", valueSuffix = "" }: EconomyTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: "background.paper",
          border: "1px solid",
          borderColor: "primary.main",
          p: 1.5,
          borderRadius: 0,
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Typography
            key={index}
            variant="body2"
            sx={{ color: entry.color, display: "flex", justifyContent: "space-between", gap: 2 }}
          >
            <span>{entry.name}:</span>
            <strong>
              {valuePrefix}
              {entry.value.toLocaleString()}
              {valueSuffix}
            </strong>
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
}

export default function MatchEconomyGraphs({ match }: MatchEconomyGraphsProps) {
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  const successColor = theme.palette.success.main;
  const textPrimary = theme.palette.text.primary;
  const gridColor = alpha(primaryColor, 0.2);

  const player1Name = match.players[0]?.name ?? "Player 1";
  const player2Name = match.players[1]?.name ?? "Player 2";

  const resourceRateData = prepareChartData(
    match.timeSeries.timestamps,
    match.timeSeries.resourceRate,
    player1Name,
    player2Name
  );

  const harvesterData = prepareChartData(
    match.timeSeries.timestamps,
    match.timeSeries.harvesterCount,
    player1Name,
    player2Name
  );

  const creditsData = prepareChartData(
    match.timeSeries.timestamps,
    match.timeSeries.creditsBalance,
    player1Name,
    player2Name
  );

  // Sample every nth point to reduce density
  const sampleRate = Math.max(1, Math.floor(resourceRateData.length / 30));
  const sampledResourceRate = resourceRateData.filter((_, i) => i % sampleRate === 0);
  const sampledHarvesters = harvesterData.filter((_, i) => i % sampleRate === 0);
  const sampledCredits = creditsData.filter((_, i) => i % sampleRate === 0);

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Economy Analytics
      </Typography>

      <Grid container spacing={3}>
        {/* Resource Collection Rate */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Resource Collection Rate
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
              Credits per minute over the course of the match
            </Typography>
            <Box sx={{ width: "100%", height: 250 }}>
              <ResponsiveContainer>
                <LineChart data={sampledResourceRate}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis
                    dataKey="time"
                    stroke={textPrimary}
                    tick={{ fill: textPrimary, fontSize: 11 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis stroke={textPrimary} tick={{ fill: textPrimary, fontSize: 11 }} />
                  <Tooltip content={<EconomyTooltip valuePrefix="$" valueSuffix="/min" />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="player1"
                    name={player1Name}
                    stroke={successColor}
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="player2"
                    name={player2Name}
                    stroke={primaryColor}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Harvester Count */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Harvester Count
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
              Number of active harvesters throughout the match
            </Typography>
            <Box sx={{ width: "100%", height: 250 }}>
              <ResponsiveContainer>
                <AreaChart data={sampledHarvesters}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis
                    dataKey="time"
                    stroke={textPrimary}
                    tick={{ fill: textPrimary, fontSize: 11 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis stroke={textPrimary} tick={{ fill: textPrimary, fontSize: 11 }} domain={[0, "auto"]} />
                  <Tooltip content={<EconomyTooltip valueSuffix=" harvesters" />} />
                  <Legend />
                  <Area
                    type="stepAfter"
                    dataKey="player1"
                    name={player1Name}
                    stroke={successColor}
                    fill={alpha(successColor, 0.3)}
                    strokeWidth={2}
                  />
                  <Area
                    type="stepAfter"
                    dataKey="player2"
                    name={player2Name}
                    stroke={primaryColor}
                    fill={alpha(primaryColor, 0.3)}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Credits Balance */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Credits Balance Over Time
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
              Available credits throughout the match
            </Typography>
            <Box sx={{ width: "100%", height: 280 }}>
              <ResponsiveContainer>
                <AreaChart data={sampledCredits}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis
                    dataKey="time"
                    stroke={textPrimary}
                    tick={{ fill: textPrimary, fontSize: 11 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    stroke={textPrimary}
                    tick={{ fill: textPrimary, fontSize: 11 }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<EconomyTooltip valuePrefix="$" />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="player1"
                    name={player1Name}
                    stroke={successColor}
                    fill={alpha(successColor, 0.2)}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="player2"
                    name={player2Name}
                    stroke={primaryColor}
                    fill={alpha(primaryColor, 0.2)}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
