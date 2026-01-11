"use client";

import { Box, Paper, Typography, Grid } from "@mui/material";
import { MatchPlayer } from "@/lib/matchData";

interface MatchStatsOverviewProps {
  players: MatchPlayer[];
}

interface StatRowProps {
  label: string;
  values: number[];
  higherIsBetter?: boolean;
  formatValue?: (value: number) => string;
}

function StatRow({ label, values, higherIsBetter = true, formatValue }: StatRowProps) {
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const hasSignificantDifference = maxValue > 0 && (maxValue - minValue) / maxValue > 0.1;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        py: 1,
        borderBottom: "1px solid",
        borderColor: "divider",
        "&:last-child": { borderBottom: "none" },
      }}
    >
      {/* Player 1 Value */}
      <Box sx={{ flex: 1, textAlign: "right", pr: 2 }}>
        <Typography
          variant="body1"
          fontWeight="bold"
          sx={{
            color:
              hasSignificantDifference &&
              ((higherIsBetter && values[0] === maxValue) || (!higherIsBetter && values[0] === minValue))
                ? "success.main"
                : hasSignificantDifference &&
                  ((higherIsBetter && values[0] === minValue) || (!higherIsBetter && values[0] === maxValue))
                ? "error.main"
                : "text.primary",
          }}
        >
          {formatValue ? formatValue(values[0]) : values[0].toLocaleString()}
        </Typography>
      </Box>

      {/* Stat Label */}
      <Box sx={{ width: 150, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Box>

      {/* Player 2 Value */}
      <Box sx={{ flex: 1, textAlign: "left", pl: 2 }}>
        <Typography
          variant="body1"
          fontWeight="bold"
          sx={{
            color:
              hasSignificantDifference &&
              ((higherIsBetter && values[1] === maxValue) || (!higherIsBetter && values[1] === minValue))
                ? "success.main"
                : hasSignificantDifference &&
                  ((higherIsBetter && values[1] === minValue) || (!higherIsBetter && values[1] === maxValue))
                ? "error.main"
                : "text.primary",
          }}
        >
          {formatValue ? formatValue(values[1]) : values[1].toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
}

interface StatCategoryProps {
  title: string;
  players: MatchPlayer[];
  children: React.ReactNode;
}

function StatCategory({ title, players, children }: StatCategoryProps) {
  return (
    <Paper sx={{ p: 2, height: "100%" }}>
      <Typography variant="h6" gutterBottom sx={{ textAlign: "center", mb: 2 }}>
        {title}
      </Typography>

      {/* Player Names Header */}
      <Box sx={{ display: "flex", mb: 2, pb: 1, borderBottom: "2px solid", borderColor: "primary.main" }}>
        <Box sx={{ flex: 1, textAlign: "right", pr: 2 }}>
          <Typography variant="body2" fontWeight="bold">
            {players[0]?.name}
          </Typography>
        </Box>
        <Box sx={{ width: 150 }} />
        <Box sx={{ flex: 1, textAlign: "left", pl: 2 }}>
          <Typography variant="body2" fontWeight="bold">
            {players[1]?.name}
          </Typography>
        </Box>
      </Box>

      {children}
    </Paper>
  );
}

export default function MatchStatsOverview({ players }: MatchStatsOverviewProps) {
  if (players.length < 2) {
    return null;
  }

  const [p1, p2] = players;

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Match Statistics
      </Typography>

      <Grid container spacing={3}>
        {/* Unit Stats */}
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCategory title="Units" players={players}>
            <StatRow label="Built" values={[p1.stats.units.built, p2.stats.units.built]} />
            <StatRow label="Killed" values={[p1.stats.units.killed, p2.stats.units.killed]} />
            <StatRow
              label="Lost"
              values={[p1.stats.units.lost, p2.stats.units.lost]}
              higherIsBetter={false}
            />
            <StatRow
              label="Captured"
              values={[p1.stats.units.captured, p2.stats.units.captured]}
            />
            <StatRow label="Sold" values={[p1.stats.units.sold, p2.stats.units.sold]} />
          </StatCategory>
        </Grid>

        {/* Building Stats */}
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCategory title="Buildings" players={players}>
            <StatRow
              label="Built"
              values={[p1.stats.buildings.built, p2.stats.buildings.built]}
            />
            <StatRow
              label="Lost"
              values={[p1.stats.buildings.lost, p2.stats.buildings.lost]}
              higherIsBetter={false}
            />
            <StatRow
              label="Captured"
              values={[p1.stats.buildings.captured, p2.stats.buildings.captured]}
            />
            <StatRow
              label="Sold"
              values={[p1.stats.buildings.sold, p2.stats.buildings.sold]}
            />
          </StatCategory>
        </Grid>

        {/* Economy Stats */}
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCategory title="Economy" players={players}>
            <StatRow
              label="Total Collected"
              values={[p1.stats.economy.totalCreditsCollected, p2.stats.economy.totalCreditsCollected]}
              formatValue={(v) => `$${v.toLocaleString()}`}
            />
            <StatRow
              label="From Ore"
              values={[p1.stats.economy.creditsFromOre, p2.stats.economy.creditsFromOre]}
              formatValue={(v) => `$${v.toLocaleString()}`}
            />
            <StatRow
              label="From Oil"
              values={[p1.stats.economy.creditsFromOilDerricks, p2.stats.economy.creditsFromOilDerricks]}
              formatValue={(v) => `$${v.toLocaleString()}`}
            />
            <StatRow
              label="Total Spent"
              values={[p1.stats.economy.creditsSpent, p2.stats.economy.creditsSpent]}
              formatValue={(v) => `$${v.toLocaleString()}`}
            />
            <StatRow
              label="Peak Credits"
              values={[p1.stats.economy.peakCredits, p2.stats.economy.peakCredits]}
              formatValue={(v) => `$${v.toLocaleString()}`}
            />
          </StatCategory>
        </Grid>

        {/* Unit Breakdown */}
        <Grid size={{ xs: 12, md: 6 }}>
          <StatCategory title="Units Built by Type" players={players}>
            <StatRow
              label="Infantry"
              values={[p1.stats.units.infantryBuilt, p2.stats.units.infantryBuilt]}
            />
            <StatRow
              label="Vehicles"
              values={[p1.stats.units.vehiclesBuilt, p2.stats.units.vehiclesBuilt]}
            />
            <StatRow
              label="Aircraft"
              values={[p1.stats.units.aircraftBuilt, p2.stats.units.aircraftBuilt]}
            />
            <StatRow
              label="Naval"
              values={[p1.stats.units.navalBuilt, p2.stats.units.navalBuilt]}
            />
          </StatCategory>
        </Grid>

        {/* Kill Breakdown */}
        <Grid size={{ xs: 12, md: 6 }}>
          <StatCategory title="Kills by Type" players={players}>
            <StatRow
              label="Infantry Kills"
              values={[p1.stats.combat.infantryKills, p2.stats.combat.infantryKills]}
            />
            <StatRow
              label="Vehicle Kills"
              values={[p1.stats.combat.vehicleKills, p2.stats.combat.vehicleKills]}
            />
            <StatRow
              label="Aircraft Kills"
              values={[p1.stats.combat.aircraftKills, p2.stats.combat.aircraftKills]}
            />
            <StatRow
              label="Building Kills"
              values={[p1.stats.combat.buildingKills, p2.stats.combat.buildingKills]}
            />
          </StatCategory>
        </Grid>
      </Grid>
    </Box>
  );
}
