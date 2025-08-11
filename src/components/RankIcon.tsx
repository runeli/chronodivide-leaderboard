"use client";

import { Box, Tooltip } from "@mui/material";
import { formatRankType } from "@/lib/api";
import { RANK_ICONS, hasRankIcon } from "@/lib/rankIcons";

interface RankIconProps {
  rankType: string | number;
  size?: number;
  showTooltip?: boolean;
  showText?: boolean;
}

export default function RankIcon({ rankType, size = 16, showTooltip = true, showText = false }: RankIconProps) {
  const numericRank = typeof rankType === "number" ? rankType : parseInt(rankType, 10);
  const rankName = formatRankType(rankType);
  const iconData = RANK_ICONS[numericRank];

  // If no icon data or unranked, show text or nothing
  if (!hasRankIcon(rankType)) {
    return showText ? <span style={{ fontSize: `${size}px`, color: "#ffff00" }}>{rankName}</span> : null;
  }

  const iconElement = (
    <Box
      component="img"
      src={`data:image/png;base64,${iconData}`}
      alt={rankName}
      sx={{
        width: size,
        height: size,
        display: "inline-block",
        verticalAlign: "middle",
        imageRendering: "pixelated", // For crisp pixel art
      }}
    />
  );

  if (showTooltip) {
    return (
      <Tooltip title={rankName} placement="top">
        {iconElement}
      </Tooltip>
    );
  }

  return iconElement;
}
