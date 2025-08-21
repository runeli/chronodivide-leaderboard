import { Box, Card, CardContent, Typography, Link } from "@mui/material";
import { PlayerMatchHistoryEntry, PlayerRankedProfile, PlayerUnrankedProfile, formatRankType } from "@/lib/api";
import RankIcon from "@/components/RankIcon";
import LadderPoints from "@/components/LadderPoints";
import PromotionProgress from "@/components/PromotionProgress";
import PinPlayer from "@/components/PinPlayer";
import NextLink from "next/link";
import { FC } from "react";

type PlayerProfile = PlayerRankedProfile | PlayerUnrankedProfile;

interface PlayerProfileCardProps {
  player: PlayerProfile;
  matchHistory?: PlayerMatchHistoryEntry[];
}

const Activity: FC<{ matchHistory?: PlayerMatchHistoryEntry[]; player: PlayerProfile }> = ({
  matchHistory,
  player,
}) => {
  if (!matchHistory) {
    return null;
  }
  const now = Date.now();
  const AMOUNT_OF_GAMES_FOR_GENERALS_LADDER = 20;
  const threeWeeksInMilliseconds = 3 * 7 * 86400 * 1000;
  const threshold = now - threeWeeksInMilliseconds;
  const recentGames = matchHistory
    .filter((entry) => entry.timestamp > threshold)
    .sort((a, b) => b.timestamp - a.timestamp);
  const isEligibleForGeneralsLadder = recentGames.length >= AMOUNT_OF_GAMES_FOR_GENERALS_LADDER;

  let demotionNote = "";
  if (isEligibleForGeneralsLadder && player.ladder && player.ladder.id === 0) {
    const oldestThresholdGame = recentGames.at(AMOUNT_OF_GAMES_FOR_GENERALS_LADDER - 1)!;
    const demotionDueToInactivityTimestamp = oldestThresholdGame.timestamp + threeWeeksInMilliseconds;
    const millisecondsUntilDemotion = demotionDueToInactivityTimestamp - now;
    if (millisecondsUntilDemotion >= 0) {
      const daysUntilDemotion = Math.floor(millisecondsUntilDemotion / (86400 * 1000));
      const timeUntilDemotion =
        daysUntilDemotion === 0
          ? `${(millisecondsUntilDemotion / (3600 * 1000)).toFixed(2)} hours`
          : `${daysUntilDemotion} ${daysUntilDemotion === 1 ? "day" : "days"}`;
      demotionNote = ` ${timeUntilDemotion} until demotion due to inactivity.`;
    }
  }

  return (
    <Typography variant="body2" color="text.secondary">
      <Typography component="span" variant="body1" color={isEligibleForGeneralsLadder ? "success" : "error"}>
        {recentGames.length}
      </Typography>{" "}
      {recentGames.length === 1 ? "game" : "games"} played in the last 3 weeks.{demotionNote}
    </Typography>
  );
};

export default function PlayerProfileCard({ player, matchHistory }: PlayerProfileCardProps) {
  const isPetka = player.name === "petka_pc";
  return (
    <Box sx={{ mb: 3 }}>
      <Card
        sx={{
          ...(isPetka && {
            backgroundImage: "url(/RA2Sovietlogo.webp)",
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundBlendMode: "overlay",
          }),
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 1,
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="h4" gutterBottom>
                {player.name}
              </Typography>
              <PinPlayer
                playerName={player.name}
                playerRank={player.rank}
                playerMmr={player.mmr}
                playerRankType={player.rankType}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <RankIcon rankType={player.rankType} size={18} />
              <Typography variant="body2" color="text.secondary">
                {formatRankType(player.rankType)}
              </Typography>
            </Box>
          </Box>
          <div
            style={{
              marginTop: 8,
              marginBottom: 8,
              height: 1,
              backgroundColor: "#ff0000",
              opacity: 0.9,
            }}
          />
          {player.rank !== -1 && (
            <>
              <Box sx={{ mb: 2 }}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6" color="primary.main">
                    {player.mmr} MMR
                  </Typography>
                  <LadderPoints points={player.points} />
                  {player.ladder && (
                    <Box sx={{ display: "flex" }}>
                      <Link
                        component={NextLink}
                        href={`/?gameMode=${player.ladder.type}&division=${player.ladder.id}`}
                        underline="hover"
                        sx={{
                          cursor: "pointer",
                          mt: 0.5,
                          display: "inline-block",
                        }}
                      >
                        <Typography variant="body2" color="primary.main">
                          {player.ladder.name}
                          {player.ladder.divisionName && ` - ${player.ladder.divisionName}`}
                        </Typography>
                      </Link>
                    </Box>
                  )}
                </Box>
                <Box sx={{ mt: 1 }}>
                  <PromotionProgress
                    currentMmr={player.mmr}
                    promotionProgress={"promotionProgress" in player ? player.promotionProgress : undefined}
                    size="regular"
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "space-around",
                  mb: 2,
                }}
              >
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h4" color="success.main">
                    {player.wins}
                  </Typography>
                  <Typography variant="caption">Wins</Typography>
                </Box>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h4" color="error.main">
                    {player.losses}
                  </Typography>
                  <Typography variant="caption">Losses</Typography>
                </Box>
                {player.draws > 0 && (
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h4" color="warning.main">
                      {player.draws}
                    </Typography>
                    <Typography variant="caption">Draws</Typography>
                  </Box>
                )}
              </Box>

              <Typography variant="body2" color="text.secondary">
                Win Rate: {((player.wins / (player.wins + player.losses)) * 100).toFixed(1)}%
              </Typography>
              <Activity player={player} matchHistory={matchHistory} />
            </>
          )}

          {player.rank === -1 && (
            <Typography variant="body2" color="text.secondary">
              This player is not ranked yet.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
