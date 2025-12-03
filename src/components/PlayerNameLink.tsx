"use client";

import { Link, Typography, TypographyProps } from "@mui/material";
import NextLink from "next/link";
import { useRegion } from "@/contexts/RegionContext";
import { LadderType } from "@/lib/api";

interface PlayerNameLinkProps {
  playerName: string;
  ladderType?: LadderType;
  variant?: TypographyProps["variant"];
  color?: TypographyProps["color"];
  fontWeight?: TypographyProps["fontWeight"];
  underline?: "none" | "hover" | "always";
  sx?: TypographyProps["sx"];
}

export default function PlayerNameLink({
  playerName,
  ladderType,
  variant = "body2",
  color = "primary",
  fontWeight = "medium",
  underline = "hover",
  sx,
}: PlayerNameLinkProps) {
  const { selectedRegion } = useRegion();
  // Ensure ladderType is always a valid string - handle undefined explicitly
  const validLadderType: LadderType = ladderType === "2v2-random" ? "2v2-random" : "1v1";
  const href = `/player/${selectedRegion.id}/${validLadderType}/${encodeURIComponent(playerName)}`;
  
  return (
    <Link
      component={NextLink}
      href={href}
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
