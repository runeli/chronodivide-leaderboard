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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { MatchDetails, MatchPlayer, formatGameTime } from "@/lib/matchData";
import { useTheme, alpha } from "@mui/material/styles";

interface MatchArmyGraphsProps {
  match: MatchDetails;
}

interface ChartDataPoint {
  time: string;
  timeSeconds: number;
  player1: number;
  player2: number;
}

function prepareChartData(timestamps: number[], values: number[][]): ChartDataPoint[] {
  return timestamps.map((time, index) => ({
    time: formatGameTime(time),
    timeSeconds: time,
    player1: Math.round(values[index][0]),
    player2: Math.round(values[index][1]),
  }));
}

interface ArmyTooltipProps {
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

function ArmyTooltip({ active, payload, label, valuePrefix = "", valueSuffix = "" }: ArmyTooltipProps) {
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

interface UnitCompositionProps {
  player: MatchPlayer;
  colors: string[];
}

function UnitCompositionChart({ player, colors }: UnitCompositionProps) {
  const data = [
    { name: "Infantry", value: player.stats.units.infantryBuilt, color: colors[0] },
    { name: "Vehicles", value: player.stats.units.vehiclesBuilt, color: colors[1] },
    { name: "Aircraft", value: player.stats.units.aircraftBuilt, color: colors[2] },
    { name: "Naval", value: player.stats.units.navalBuilt, color: colors[3] },
  ].filter((d) => d.value > 0);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="subtitle2" color="primary.main" sx={{ mb: 1 }}>
        {player.name}
      </Typography>
      <Box sx={{ width: "100%", height: 180 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [`${value} (${((value / total) * 100).toFixed(1)}%)`, name]}
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.9)",
                border: "1px solid #ff0000",
                borderRadius: 0,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
      <Typography variant="caption" color="text.secondary">
        Total: {total} units
      </Typography>
    </Box>
  );
}

export default function MatchArmyGraphs({ match }: MatchArmyGraphsProps) {
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  const successColor = theme.palette.success.main;
  const textPrimary = theme.palette.text.primary;
  const gridColor = alpha(primaryColor, 0.2);

  const pieColors = ["#4caf50", "#ff9800", "#00bcd4", "#3f51b5"];

  const player1Name = match.players[0]?.name ?? "Player 1";
  const player2Name = match.players[1]?.name ?? "Player 2";

  const armyValueData = prepareChartData(match.timeSeries.timestamps, match.timeSeries.armyValue);
  const unitCountData = prepareChartData(match.timeSeries.timestamps, match.timeSeries.unitCount);

  // Sample data to reduce density
  const sampleRate = Math.max(1, Math.floor(armyValueData.length / 30));
  const sampledArmyValue = armyValueData.filter((_, i) => i % sampleRate === 0);
  const sampledUnitCount = unitCountData.filter((_, i) => i % sampleRate === 0);

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Army Analytics
      </Typography>

      <Grid container spacing={3}>
        {/* Army Value Over Time */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" color="primary.main" gutterBottom>
              Army Value Over Time
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
              Total value of all military units
            </Typography>
            <Box sx={{ width: "100%", height: 280 }}>
              <ResponsiveContainer>
                <AreaChart data={sampledArmyValue}>
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
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<ArmyTooltip valuePrefix="$" />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="player1"
                    name={player1Name}
                    stroke={successColor}
                    fill={alpha(successColor, 0.3)}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
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

        {/* Unit Count Over Time */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" color="primary.main" gutterBottom>
              Unit Count Over Time
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
              Total number of active units
            </Typography>
            <Box sx={{ width: "100%", height: 280 }}>
              <ResponsiveContainer>
                <LineChart data={sampledUnitCount}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis
                    dataKey="time"
                    stroke={textPrimary}
                    tick={{ fill: textPrimary, fontSize: 11 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis stroke={textPrimary} tick={{ fill: textPrimary, fontSize: 11 }} domain={[0, "auto"]} />
                  <Tooltip content={<ArmyTooltip valueSuffix=" units" />} />
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

      </Grid>
    </Box>
  );
}
