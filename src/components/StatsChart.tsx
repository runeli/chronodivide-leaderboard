"use client";

import React, { useMemo } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { alpha, useTheme } from "@mui/material/styles";
import { useRegion } from "@/contexts/RegionContext";
import { useStats, StatsResponse, StatsTimeSeries, XwolUsersLabels, XwolGamesLabels } from "@/lib/api";
import { alliedTheme } from "@/theme/themes";

interface SeriesConfig {
  key: string;
  label: string;
  color: string;
  extract: (data: StatsResponse) => StatsTimeSeries<XwolUsersLabels | XwolGamesLabels> | undefined;
}

type ChartPoint = { tsMs: number } & Record<string, number | undefined>;

export default function StatsChart() {
  const theme = useTheme();
  const { selectedRegion } = useRegion();
  const { data, error, isLoading } = useStats(selectedRegion.id);

  const primaryColor = theme.palette.primary.main;
  const textPrimary = theme.palette.text.primary;
  const gridColor = alpha(primaryColor, 0.2);

  const seriesConfigs: SeriesConfig[] = useMemo(
    () => [
      {
        key: "players",
        label: "Playing users",
        color: theme.palette.primary.main,
        extract: (d) => d.xwol_users?.series.find((s) => s.labels.type === "playing"),
      },
      {
        key: "games1v1",
        label: "1v1 games",
        color: alliedTheme.palette.primary.main,
        extract: (d) =>
          d.xwol_games?.series.find(
            (s) => s.labels.type === "ladder" && s.labels.ladderType === "1v1"
          ),
      },
      {
        key: "games2v2",
        label: "2v2 games",
        color: "#ff9800",
        extract: (d) =>
          d.xwol_games?.series.find(
            (s) => s.labels.type === "ladder" && s.labels.ladderType === "2v2"
          ),
      },
    ],
    [theme.palette.primary.main]
  );

  const formatHHMM = (tsMs: number) =>
    new Date(tsMs).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });

  const chartData: ChartPoint[] = useMemo(() => {
    if (!data) return [];

    const byTs = new Map<number, ChartPoint>();

    for (const { key, extract } of seriesConfigs) {
      const series = extract(data);
      if (!series) continue;
      for (const [ts, value] of series.values) {
        const tsMs = ts * 1000;
        const entry = byTs.get(tsMs) || { tsMs };
        entry[key] = Math.round(value);
        byTs.set(tsMs, entry);
      }
    }

    return Array.from(byTs.values()).sort((a, b) => a.tsMs - b.tsMs);
  }, [data, seriesConfigs]);

  const ticks = useMemo(() => {
    if (!chartData.length) return [] as number[];
    const oneHour = 3600 * 1000;
    const start = Math.floor(chartData[0].tsMs / oneHour) * oneHour;
    const end = Math.ceil(chartData[chartData.length - 1].tsMs / oneHour) * oneHour;
    const result: number[] = [];
    for (let t = start; t <= end; t += oneHour) {
      result.push(t);
    }
    return result;
  }, [chartData]);

  if (error) {
    return (
      <Paper sx={{ p: 2, m: 1 }}>
        <Typography variant="h6" gutterBottom>
          Players Playing
        </Typography>
        <Typography variant="body2" color="error">
          Failed to load stats
        </Typography>
      </Paper>
    );
  }

  if (isLoading) {
    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Players Playing
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Loading...
        </Typography>
      </Paper>
    );
  }

  if (!chartData.length) {
    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Players Playing
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No data available
        </Typography>
      </Paper>
    );
  }

  const values = chartData.flatMap((d) =>
    seriesConfigs.map(({ key }) => d[key]).filter((v): v is number => typeof v === "number")
  );
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const padding = Math.max(1, Math.round((maxVal - minVal) * 0.1));

  // Y axis: align to multiples of 20 with integer ticks only
  const yStep = 20;
  const yMin = Math.max(0, Math.floor((minVal - padding) / yStep) * yStep);
  const yMax = Math.ceil((maxVal + padding) / yStep) * yStep;
  const yTicks: number[] = [];
  for (let v = yMin; v <= yMax; v += yStep) yTicks.push(v);

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ dataKey: string; payload: ChartPoint; value: number }>;
  }) => {
    if (active && payload && payload.length) {
      const d: ChartPoint = payload[0].payload;
      return (
        <Box sx={{ backgroundColor: "background.paper", border: "1px solid", borderColor: "divider", p: 1 }}>
          <Typography variant="body2">{formatHHMM(d.tsMs)}</Typography>
          {seriesConfigs.map(
            ({ key, label, color }) =>
              typeof d[key] === "number" && (
                <Typography key={key} variant="body2" sx={{ color }}>
                  {label}: {d[key]}
                </Typography>
              )
          )}
        </Box>
      );
    }
    return null;
  };

  return (
    <Paper sx={{ p: 2, m: 1 }}>
      <Typography variant="h6" gutterBottom>
        Activity (last {data?.xwol_users?.rangeSeconds ? Math.round(data.xwol_users.rangeSeconds / 3600) : ""}h)
      </Typography>
      <Box sx={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="tsMs"
              type="number"
              domain={[chartData[0].tsMs, chartData[chartData.length - 1].tsMs]}
              ticks={ticks}
              stroke={textPrimary}
              tick={{ fill: textPrimary, fontSize: 12 }}
              tickFormatter={(ts: number) => formatHHMM(ts)}
            />
            <YAxis
              domain={[yMin, yMax]}
              ticks={yTicks}
              allowDecimals={false}
              stroke={textPrimary}
              tick={{ fill: textPrimary, fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            {seriesConfigs.map(({ key, color }) => (
              <Line
                key={key}
                type="linear"
                dataKey={key}
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                strokeLinejoin="miter"
                strokeLinecap="square"
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
        {seriesConfigs.map(({ key, label, color }, i) => (
          <React.Fragment key={key}>
            {i > 0 && (i === seriesConfigs.length - 1 ? " and " : ", ")}
            <Box component="span" sx={{ color }}>
              {label}
            </Box>
          </React.Fragment>
        ))}
      </Typography>
    </Paper>
  );
}
