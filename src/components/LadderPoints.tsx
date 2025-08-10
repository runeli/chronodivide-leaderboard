import { Box, Typography, Tooltip, IconButton } from '@mui/material';
import InfoOutlined from '@mui/icons-material/InfoOutlined';

interface LadderPointsProps {
  points?: number | null;
}

export default function LadderPoints({ points }: LadderPointsProps) {
  // Only render if points exist and are not null
  if (points === undefined || points === null) {
    return null;
  }

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
      <Typography variant="body2" color="text.secondary">
        {points} Ladder Points
      </Typography>
      <Tooltip
        title={`Ladder Points (LP) move you within your division. You earn LP for wins and may lose LP for defeats. Bonus Points (BP) accumulate over time (~1 per 100 minutes) and are spent when you play: they double LP gained on a win and negate LP loss on a defeat.`}
        placement="top"
        enterTouchDelay={0}
      >
        <IconButton
          size="small"
          aria-label="Ladder Points info"
          sx={{ p: 0.25 }}
        >
          <InfoOutlined fontSize="inherit" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
