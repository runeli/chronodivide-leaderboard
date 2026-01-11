"use client";

import { Box, Paper, Typography, Chip } from "@mui/material";
import {
  AccessTime,
  CalendarToday,
  Map as MapIcon,
} from "@mui/icons-material";
import { MatchDetails, MatchPlayer } from "@/lib/matchData";
import PlayerCountry from "./PlayerCountry";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import RA2Button from "./RA2Button";

interface MatchHeaderProps {
  match: MatchDetails;
  region: string;
  ladderType: string;
}

interface PlayerCardProps {
  player: MatchPlayer;
  region: string;
  ladderType: string;
  isLeftSide: boolean;
}

const OpenReplayInGameButton = ({ gameId }: { gameId: string }) => {
  const handleReplayClick = (replayUrl: string) => {
    const encodedReplayUrl = `https://game.chronodivide.com/#/replay/${encodeURIComponent(replayUrl)}`;
    if (encodedReplayUrl) {
      window.open(encodedReplayUrl, "_blank");
    }
  };
  return (
    <RA2Button onClick={() => handleReplayClick(gameId)}>
      Open replay in game
    </RA2Button>
  );
};

function PlayerCard({ player, region, ladderType, isLeftSide }: PlayerCardProps) {
  const searchParams = useSearchParams();
  const regionParam = searchParams.get("region") ?? region;
  
  const resultColor = player.result === "win" 
    ? "success.main" 
    : player.result === "loss" 
    ? "error.main" 
    : "warning.main";

  const resultText = player.result === "win" ? "VICTORY" : player.result === "loss" ? "DEFEAT" : "DRAW";

  // Determine splash image based on country (Allied = 0-4, Soviet = 5-8)
  const isAllied = player.countryId !== undefined && player.countryId <= 4;
  const splashImage = isAllied ? "/bg-splash/america-bg-splash.jpg" : "/bg-splash/iraq-bg-splash.jpg";
  
  // Winner's splash on right, loser's splash on left
  const splashOnRight = player.result === "win";

  return (
    <Paper
      sx={{
        p: 2,
        flex: 1,
        minWidth: 200,
        display: "flex",
        flexDirection: "column",
        alignItems: isLeftSide ? "flex-start" : "flex-end",
        textAlign: isLeftSide ? "left" : "right",
        position: "relative",
        overflow: "hidden",
        border: "1px solid",
        borderColor: resultColor,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          bottom: 0,
          [splashOnRight ? "right" : "left"]: 0,
          width: "100%",
          backgroundImage: `url(${splashImage})`,
          backgroundSize: "contain",
          backgroundPosition: splashOnRight ? "right center" : "left center",
          backgroundRepeat: "no-repeat",
          opacity: 0.7,
          zIndex: 0,
          
        },
      }}
    >
      {/* Result Badge */}
      <Chip
        label={resultText}
        size="small"
        sx={{
          backgroundColor: resultColor,
          color: player.result === "win" ? "#000" : "#fff",
          fontWeight: "bold",
          mb: 1,
          borderRadius: 0,
          borderColor: resultColor,
          position: "relative",
          zIndex: 1,
        }}
      />

      {/* Player Name */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, position: "relative", zIndex: 1 }}>
        {isLeftSide && player.countryId !== undefined && (
          <PlayerCountry countryId={player.countryId} />
        )}
        <Link
          href={`/player/${regionParam}/${ladderType}/${encodeURIComponent(player.name)}`}
          style={{ textDecoration: "none" }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "text.primary",
              "&:hover": {
                color: "primary.main",
                textDecoration: "underline",
              },
            }}
          >
            {player.name}
          </Typography>
        </Link>
        {!isLeftSide && player.countryId !== undefined && (
          <PlayerCountry countryId={player.countryId} />
        )}
      </Box>

      {/* Quick Stats */}
      <Box sx={{ display: "flex", gap: 2, mt: 1, position: "relative", zIndex: 1 }}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Units Built
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {player.stats.units.built}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Units Killed
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {player.stats.units.killed}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Units Lost
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {player.stats.units.lost}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

export default function MatchHeader({ match, region, ladderType }: MatchHeaderProps) {
  const matchDate = new Date(match.timestamp);
  const formattedDate = matchDate.toLocaleDateString("fi-FI", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = matchDate.toLocaleTimeString("fi-FI", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Split players by team for 2v2, or just show 1v1
  const team1 = match.players.filter((p) => p.team === 1);
  const team2 = match.players.filter((p) => p.team === 2);

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      {/* Match Info Row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        {/* Date & Time */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarToday sx={{ fontSize: 18, color: "primary.main" }} />
            <Typography variant="body1">{formattedDate}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AccessTime sx={{ fontSize: 18, color: "primary.main" }} />
            <Typography variant="body1">{formattedTime}</Typography>
          </Box>
        </Box>

        {/* Duration */}
        <Chip
          icon={<AccessTime sx={{ fontSize: 16 }} />}
          label={`${match.duration} minutes`}
          variant="outlined"
          sx={{ borderRadius: 0 }}
        />

        <OpenReplayInGameButton gameId={match.gameId} />
      </Box>

      {/* Map Info */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          mb: 3,
          p: 2,
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        {match.mapImageUrl ? (
          <Box
            component="img"
            src={match.mapImageUrl}
            alt={match.map}
            sx={{
              width: 120,
              height: 120,
              objectFit: "cover",
              border: "2px solid",
              borderColor: "primary.main",
            }}
          />
        ) : (
          <Box
            sx={{
              width: 120,
              height: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              border: "2px solid",
              borderColor: "primary.main",
            }}
          >
            <MapIcon sx={{ fontSize: 48, color: "primary.main", opacity: 0.5 }} />
          </Box>
        )}
        <Box>
          <Typography variant="caption" color="text.secondary">
            Map
          </Typography>
          <Typography variant="h5">
            {match.map}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {match.ladderType.toUpperCase()} Ranked Match
          </Typography>
        </Box>
      </Box>

      {/* Players */}
      <Box
        sx={{
          display: "flex",
          gap: 3,
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "stretch",
        }}
      >
        {/* Team 1 / Player 1 */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, minWidth: 250 }}>
          {team1.map((player) => (
            <PlayerCard
              key={player.name}
              player={player}
              region={region}
              ladderType={ladderType}
              isLeftSide={true}
            />
          ))}
        </Box>

        {/* VS Divider */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 2,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: "primary.main",
              fontWeight: "bold",
              textShadow: "0 0 10px currentColor",
            }}
          >
            VS
          </Typography>
        </Box>

        {/* Team 2 / Player 2 */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, minWidth: 250 }}>
          {team2.map((player) => (
            <PlayerCard
              key={player.name}
              player={player}
              region={region}
              ladderType={ladderType}
              isLeftSide={false}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
}
