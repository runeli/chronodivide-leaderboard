import { Box, Card, CardContent, Typography, Link } from '@mui/material';
import {
  PlayerRankedProfile,
  PlayerUnrankedProfile,
  formatRankType,
} from '@/lib/api';
import RankIcon from '@/components/RankIcon';
import LadderPoints from '@/components/LadderPoints';
import PromotionProgress from '@/components/PromotionProgress';
import NextLink from 'next/link';

interface PlayerProfileCardProps {
  player: PlayerRankedProfile | PlayerUnrankedProfile;
}

export default function PlayerProfileCard({ player }: PlayerProfileCardProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Card>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 1,
              mb: 2,
            }}
          >
            <Typography variant="h4" gutterBottom>
              {player.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
              backgroundColor: '#ff0000',
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
                    <Box sx={{ display: 'flex' }}>
                      <Link
                        component={NextLink}
                        href={`/?gameMode=${player.ladder.type}&division=${player.ladder.id}`}
                        underline="hover"
                        sx={{
                          cursor: 'pointer',
                          mt: 0.5,
                          display: 'inline-block',
                        }}
                      >
                        <Typography variant="body2" color="primary.main">
                          {player.ladder.name}
                          {player.ladder.divisionName &&
                            ` - ${player.ladder.divisionName}`}
                        </Typography>
                      </Link>
                    </Box>
                  )}
                </Box>
                <Box sx={{ mt: 1 }}>
                  <PromotionProgress
                    currentMmr={player.mmr}
                    promotionProgress={
                      'promotionProgress' in player
                        ? player.promotionProgress
                        : undefined
                    }
                    size="regular"
                  />
                </Box>
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
                    {player.draws}
                  </Typography>
                  <Typography variant="caption">Draws</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="error.main">
                    {player.losses}
                  </Typography>
                  <Typography variant="caption">Losses</Typography>
                </Box>
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
