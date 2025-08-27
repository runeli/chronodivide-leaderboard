"use client";

import { Link, Typography, TypographyProps } from "@mui/material";
import NextLink from "next/link";
import { useRegion } from "@/contexts/RegionContext";

interface PlayerNameLinkProps {
  playerName: string;
  variant?: TypographyProps["variant"];
  color?: TypographyProps["color"];
  fontWeight?: TypographyProps["fontWeight"];
  underline?: "none" | "hover" | "always";
  sx?: TypographyProps["sx"];
}

export default function PlayerNameLink({
  playerName,
  variant = "body2",
  color = "primary",
  fontWeight = "medium",
  underline = "hover",
  sx,
}: PlayerNameLinkProps) {
  const { selectedRegion } = useRegion();

  return (
    <Link
      component={NextLink}
      href={`/player/${selectedRegion.id}/${encodeURIComponent(playerName)}`}
      underline={underline}
      sx={{ cursor: "pointer" }}
      prefetch={false}
    >
      <Typography component="span" display="inline" variant={variant} fontWeight={fontWeight} color={color} sx={sx}>
        {playerName}
      </Typography>
    </Link>
  );
}
