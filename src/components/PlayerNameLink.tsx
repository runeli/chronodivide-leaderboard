'use client';

import { Link, Typography, TypographyProps } from '@mui/material';
import NextLink from 'next/link';

interface PlayerNameLinkProps {
  playerName: string;
  variant?: TypographyProps['variant'];
  color?: TypographyProps['color'];
  fontWeight?: TypographyProps['fontWeight'];
  underline?: 'none' | 'hover' | 'always';
  sx?: TypographyProps['sx'];
}

export default function PlayerNameLink({
  playerName,
  variant = 'body2',
  color = 'primary',
  fontWeight = 'medium',
  underline = 'hover',
  sx,
}: PlayerNameLinkProps) {
  return (
    <Link
      component={NextLink}
      href={`/player/${encodeURIComponent(playerName)}`}
      underline={underline}
      sx={{ cursor: 'pointer' }}
    >
      <Typography
        variant={variant}
        fontWeight={fontWeight}
        color={color}
        sx={sx}
      >
        {playerName}
      </Typography>
    </Link>
  );
}
