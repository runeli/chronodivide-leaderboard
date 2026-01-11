"use client";

import { Box, Paper, Typography, Grid, LinearProgress } from "@mui/material";
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
import { MatchDetails, MatchPlayer } from "@/lib/matchData";
import { useTheme, alpha } from "@mui/material/styles";

interface MatchCombatAnalyticsProps {
  match: MatchDetails;
}

interface KillsByTypeData {
  type: string;
  player1: number;
  player2: number;
}

function prepareKillsData(players: MatchPlayer[]): KillsByTypeData[] {
  if (players.length < 2) return [];
  
  const [p1, p2] = players;
  
  return [
    {
      type: "Infantry",
      player1: p1.stats.combat.infantryKills,
      player2: p2.stats.combat.infantryKills,
    },
    {
      type: "Vehicles",
      player1: p1.stats.combat.vehicleKills,
      player2: p2.stats.combat.vehicleKills,
    },
    {
      type: "Aircraft",
      player1: p1.stats.combat.aircraftKills,
      player2: p2.stats.combat.aircraftKills,
    },
    {
      type: "Buildings",
      player1: p1.stats.combat.buildingKills,
      player2: p2.stats.combat.buildingKills,
    },
  ];
}

interface DamageComparisonProps {
  player1: MatchPlayer;
  player2: MatchPlayer;
}

function DamageComparison({ player1, player2 }: DamageComparisonProps) {
  const theme = useTheme();
  const successColor = theme.palette.success.main;

  const totalDamage = Math.max(
    player1.stats.combat.damageDealt + player1.stats.combat.damageReceived,
    player2.stats.combat.damageDealt + player2.stats.combat.damageReceived
  );

  const p1DamageDealtPercent = (player1.stats.combat.damageDealt / totalDamage) * 100;
  const p2DamageDealtPercent = (player2.stats.combat.damageDealt / totalDamage) * 100;
  const p1DamageReceivedPercent = (player1.stats.combat.damageReceived / totalDamage) * 100;
  const p2DamageReceivedPercent = (player2.stats.combat.damageReceived / totalDamage) * 100;

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Damage Overview
      </Typography>
      
      <Grid container spacing={3}>
        {/* Player 1 */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              {player1.name}
            </Typography>
            
            {/* Damage Dealt */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  Damage Dealt
                </Typography>
                <Typography variant="body2" fontWeight="bold" color="success.main">
                  {player1.stats.combat.damageDealt.toLocaleString()}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={p1DamageDealtPercent}
                sx={{
                  height: 8,
                  borderRadius: 0,
                  backgroundColor: alpha(successColor, 0.2),
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: successColor,
                    borderRadius: 0,
                  },
                }}
              />
            </Box>

            {/* Damage Received */}
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  Damage Received
                </Typography>
                <Typography variant="body2" fontWeight="bold" color="error.main">
                  {player1.stats.combat.damageReceived.toLocaleString()}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={p1DamageReceivedPercent}
                sx={{
                  height: 8,
                  borderRadius: 0,
                  backgroundColor: alpha(theme.palette.error.main, 0.2),
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: theme.palette.error.main,
                    borderRadius: 0,
                  },
                }}
              />
            </Box>
          </Box>
        </Grid>

        {/* Player 2 */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              {player2.name}
            </Typography>
            
            {/* Damage Dealt */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  Damage Dealt
                </Typography>
                <Typography variant="body2" fontWeight="bold" color="success.main">
                  {player2.stats.combat.damageDealt.toLocaleString()}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={p2DamageDealtPercent}
                sx={{
                  height: 8,
                  borderRadius: 0,
                  backgroundColor: alpha(successColor, 0.2),
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: successColor,
                    borderRadius: 0,
                  },
                }}
              />
            </Box>

            {/* Damage Received */}
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  Damage Received
                </Typography>
                <Typography variant="body2" fontWeight="bold" color="error.main">
                  {player2.stats.combat.damageReceived.toLocaleString()}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={p2DamageReceivedPercent}
                sx={{
                  height: 8,
                  borderRadius: 0,
                  backgroundColor: alpha(theme.palette.error.main, 0.2),
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: theme.palette.error.main,
                    borderRadius: 0,
                  },
                }}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

interface EfficiencyCardProps {
  player: MatchPlayer;
}

function EfficiencyCard({ player }: EfficiencyCardProps) {
  
  const efficiency = player.stats.units.built > 0 
    ? (player.stats.units.killed / player.stats.units.built * 100).toFixed(1)
    : "0.0";
  
  const survivalRate = player.stats.units.built > 0
    ? ((1 - player.stats.units.lost / player.stats.units.built) * 100).toFixed(1)
    : "0.0";

  return (
    <Paper sx={{ p: 2, textAlign: "center" }}>
      <Typography variant="subtitle2" gutterBottom>
        {player.name}
      </Typography>
      
      <Grid container spacing={2}>
        <Grid size={{ xs: 4 }}>
          <Typography 
            variant="h4" 
            color={player.stats.combat.killDeathRatio >= 1 ? "success.main" : "error.main"}
          >
            {player.stats.combat.killDeathRatio.toFixed(2)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            K/D Ratio
          </Typography>
        </Grid>
        
        <Grid size={{ xs: 4 }}>
          <Typography variant="h4" color="info.main">
            {efficiency}%
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Kill Efficiency
          </Typography>
        </Grid>
        
        <Grid size={{ xs: 4 }}>
          <Typography variant="h4" color="warning.main">
            {survivalRate}%
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Survival Rate
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default function MatchCombatAnalytics({ match }: MatchCombatAnalyticsProps) {
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  const successColor = theme.palette.success.main;
  const textPrimary = theme.palette.text.primary;
  const gridColor = alpha(primaryColor, 0.2);

  const player1Name = match.players[0]?.name ?? "Player 1";
  const player2Name = match.players[1]?.name ?? "Player 2";

  const killsData = prepareKillsData(match.players);

  if (match.players.length < 2) {
    return null;
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Combat Analytics
      </Typography>

      <Grid container spacing={3}>
        {/* Efficiency Cards */}
        {match.players.slice(0, 2).map((player) => (
          <Grid key={player.name} size={{ xs: 12, md: 6 }}>
            <EfficiencyCard player={player} />
          </Grid>
        ))}

        {/* Kills by Type Bar Chart */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Kills by Unit Type
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
              Breakdown of kills by target type
            </Typography>
            <Box sx={{ width: "100%", height: 280 }}>
              <ResponsiveContainer>
                <BarChart data={killsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis
                    dataKey="type"
                    stroke={textPrimary}
                    tick={{ fill: textPrimary, fontSize: 12 }}
                  />
                  <YAxis stroke={textPrimary} tick={{ fill: textPrimary, fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.9)",
                      border: "1px solid #ff0000",
                      borderRadius: 0,
                    }}
                  />
                  <Legend />
                  <Bar dataKey="player1" name={player1Name} fill={successColor} />
                  <Bar dataKey="player2" name={player2Name} fill={primaryColor} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Damage Comparison */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <DamageComparison player1={match.players[0]} player2={match.players[1]} />
        </Grid>

        {/* Total Combat Summary */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Combat Summary
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h4" color="success.main">
                    {match.players.reduce((sum, p) => sum + p.stats.units.killed, 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Units Destroyed
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h4" color="error.main">
                    {match.players.reduce((sum, p) => sum + p.stats.buildings.lost, 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Buildings Destroyed
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h4" color="info.main">
                    {match.players.reduce((sum, p) => sum + p.stats.units.captured, 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Units Captured
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h4" color="warning.main">
                    {(match.players.reduce((sum, p) => sum + p.stats.combat.damageDealt, 0) / 1000).toFixed(0)}k
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Damage Dealt
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
