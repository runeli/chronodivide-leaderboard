import { Typography } from '@mui/material';

interface LadderPointsProps {
  points?: number | null;
}

export default function LadderPoints({ points }: LadderPointsProps) {
  // Only render if points exist and are not null
  if (points === undefined || points === null) {
    return null;
  }

  return (
    <Typography variant="body2" color="text.secondary">
      {points} Ladder Points
    </Typography>
  );
}
