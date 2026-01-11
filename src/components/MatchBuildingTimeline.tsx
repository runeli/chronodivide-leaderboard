"use client";

import { Box, Paper, Typography, Grid, Chip } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { MatchDetails, BuildingEvent, BuildingCategory, formatGameTime, getBuildingCategoryColor } from "@/lib/matchData";
import { useTheme, alpha } from "@mui/material/styles";

interface MatchBuildingTimelineProps {
  match: MatchDetails;
}

interface BuildingComparisonData {
  building: string;
  category: BuildingCategory;
  player1Time: number;
  player2Time: number;
  player1Formatted: string;
  player2Formatted: string;
  timeDiff: number;
}

function getFirstBuildings(timeline: BuildingEvent[]): Map<BuildingCategory, BuildingEvent> {
  const firsts = new Map<BuildingCategory, BuildingEvent>();
  
  for (const event of timeline) {
    if (event.isFirst && !firsts.has(event.buildingType)) {
      firsts.set(event.buildingType, event);
    }
  }
  
  return firsts;
}

function prepareComparisonData(match: MatchDetails): BuildingComparisonData[] {
  const categories: { key: BuildingCategory; label: string }[] = [
    { key: "power", label: "Power Plant" },
    { key: "refinery", label: "Refinery" },
    { key: "barracks", label: "Barracks" },
    { key: "warFactory", label: "War Factory" },
    { key: "airforce", label: "Air Force" },
    { key: "tech", label: "Battle Lab" },
    { key: "superweapon", label: "Superweapon" },
  ];

  const player1Firsts = getFirstBuildings(match.players[0]?.buildingTimeline ?? []);
  const player2Firsts = getFirstBuildings(match.players[1]?.buildingTimeline ?? []);

  return categories
    .map(({ key, label }) => {
      const p1Event = player1Firsts.get(key);
      const p2Event = player2Firsts.get(key);
      
      if (!p1Event && !p2Event) return null;

      const p1Time = p1Event?.completedAt ?? 0;
      const p2Time = p2Event?.completedAt ?? 0;

      return {
        building: label,
        category: key,
        player1Time: p1Time,
        player2Time: p2Time,
        player1Formatted: p1Event ? formatGameTime(p1Time) : "N/A",
        player2Formatted: p2Event ? formatGameTime(p2Time) : "N/A",
        timeDiff: p1Time && p2Time ? p1Time - p2Time : 0,
      };
    })
    .filter((d): d is BuildingComparisonData => d !== null);
}

interface TimelineTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    payload: BuildingComparisonData;
  }>;
  label?: string;
}

function TimelineTooltip({ active, payload, label }: TimelineTooltipProps) {
  if (active && payload && payload.length && payload[0].payload) {
    const data = payload[0].payload;
    const faster = data.timeDiff < 0 ? "player1" : data.timeDiff > 0 ? "player2" : null;
    
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
        <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Typography
            key={index}
            variant="body2"
            sx={{ 
              color: entry.color, 
              display: "flex", 
              justifyContent: "space-between", 
              gap: 2 
            }}
          >
            <span>{entry.name}:</span>
            <strong>{formatGameTime(entry.value)}</strong>
          </Typography>
        ))}
        {data.timeDiff !== 0 && (
          <Typography 
            variant="caption" 
            color={faster === "player1" ? "success.main" : "error.main"}
            sx={{ mt: 1, display: "block" }}
          >
            {faster === "player1" 
              ? `${Math.abs(data.timeDiff)}s faster` 
              : `${Math.abs(data.timeDiff)}s slower`}
          </Typography>
        )}
      </Box>
    );
  }
  return null;
}

interface TimelineCardProps {
  player: { name: string; buildingTimeline: BuildingEvent[] };
  isWinner: boolean;
}

function TimelineCard({ player, isWinner }: TimelineCardProps) {
  const firsts = getFirstBuildings(player.buildingTimeline);
  const sortedBuildings = Array.from(firsts.entries())
    .sort((a, b) => a[1].completedAt - b[1].completedAt);

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Typography variant="subtitle1">
          {player.name}
        </Typography>
      </Box>
      
      <Box sx={{ position: "relative", pl: 3 }}>
        {/* Timeline line */}
        <Box
          sx={{
            position: "absolute",
            left: 8,
            top: 0,
            bottom: 0,
            width: 2,
            backgroundColor: "primary.main",
            opacity: 0.5,
          }}
        />
        
        {sortedBuildings.map(([category, event]) => (
          <Box
            key={category}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 1.5,
              position: "relative",
            }}
          >
            {/* Timeline dot */}
            <Box
              sx={{
                position: "absolute",
                left: -19,
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: getBuildingCategoryColor(category),
                border: "2px solid",
                borderColor: "background.paper",
              }}
            />
            
            {/* Time */}
            <Typography
              variant="body2"
              sx={{
                minWidth: 50,
                fontFamily: "monospace",
                color: "text.secondary",
              }}
            >
              {formatGameTime(event.completedAt)}
            </Typography>
            
            {/* Building name */}
            <Typography variant="body2">
              {event.buildingName}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

export default function MatchBuildingTimeline({ match }: MatchBuildingTimelineProps) {
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  const successColor = theme.palette.success.main;
  const textPrimary = theme.palette.text.primary;
  const gridColor = alpha(primaryColor, 0.2);

  const player1Name = match.players[0]?.name ?? "Player 1";
  const player2Name = match.players[1]?.name ?? "Player 2";

  const comparisonData = prepareComparisonData(match);

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Building Timeline
      </Typography>

      <Grid container spacing={3}>
        {/* Comparison Bar Chart */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              First Building Comparison
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
              Time to complete key buildings (earlier is better)
            </Typography>
            <Box sx={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart
                  data={comparisonData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis
                    type="number"
                    stroke={textPrimary}
                    tick={{ fill: textPrimary, fontSize: 11 }}
                    tickFormatter={(value) => formatGameTime(value)}
                    domain={[0, "auto"]}
                  />
                  <YAxis
                    type="category"
                    dataKey="building"
                    stroke={textPrimary}
                    tick={{ fill: textPrimary, fontSize: 12 }}
                    width={75}
                  />
                  <Tooltip content={<TimelineTooltip />} />
                  <Legend />
                  <Bar dataKey="player1Time" name={player1Name} fill={successColor} barSize={12} />
                  <Bar dataKey="player2Time" name={player2Name} fill={primaryColor} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Individual Player Timelines */}
        {match.players.slice(0, 2).map((player) => (
          <Grid key={player.name} size={{ xs: 12, md: 6 }}>
            <TimelineCard
              player={player}
              isWinner={player.result === "win"}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
