import { Box, Card, CardContent, Typography } from '@mui/material';
import {
  PlayerRankedProfile,
  PlayerUnrankedProfile,
  formatRankType,
} from '@/lib/api';
import RankIcon from '@/components/RankIcon';
import LadderPoints from '@/components/LadderPoints';

interface PlayerProfileCardProps {
  player: PlayerRankedProfile | PlayerUnrankedProfile;
}

export default function PlayerProfileCard({ player }: PlayerProfileCardProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {player.name}
          </Typography>

          {player.rank !== -1 && (
            <>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" color="primary.main">
                  {player.mmr} MMR
                </Typography>
                <LadderPoints points={player.points} />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2,
                }}
              >
                <RankIcon rankType={player.rankType} size={18} />
                <Typography variant="body2" color="text.secondary">
                  {formatRankType(player.rankType)}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'space-around',
                  mb: 2,
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    {player.wins}
                  </Typography>
                  <Typography variant="caption">Wins</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="error.main">
                    {player.losses}
                  </Typography>
                  <Typography variant="caption">Losses</Typography>
                </Box>
                {player.draws > 0 && (
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main">
                      {player.draws}
                    </Typography>
                    <Typography variant="caption">Draws</Typography>
                  </Box>
                )}
              </Box>

              <Typography variant="body2" color="text.secondary">
                Win Rate:{' '}
                {((player.wins / (player.wins + player.losses)) * 100).toFixed(
                  1
                )}
                %
              </Typography>
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
