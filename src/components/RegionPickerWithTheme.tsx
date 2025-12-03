"use client";

import React from "react";
import RegionPicker from "./RegionPicker";
import { usePathname } from "next/navigation";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { alliedTheme, neutralTheme, sovietTheme } from "@/theme/themes";
import { useRegion } from "@/contexts/RegionContext";
import { LadderType, getPreferredSide, usePlayerMatchHistory } from "@/lib/api";

export default function RegionPickerWithTheme() {
  const pathname = usePathname();
  const { selectedRegion } = useRegion();

  const isRegionPage = pathname === "/am-eu" || pathname === "/sea";
  const isPlayerPage = pathname.startsWith("/player/");

  // Extract region and ladder type from pathname for player pages
  const getRegionFromPath = () => {
    if (isPlayerPage) {
      const pathSegments = pathname.split("/");
      const regionIndex = pathSegments.findIndex((segment) => segment === "player") + 1;
      const regionFromPath = pathSegments[regionIndex];
      return regionFromPath || selectedRegion.id;
    }
    return selectedRegion.id;
  };

  // Determine player name and ladder type if on player page; pass empty otherwise to keep hook order stable
  const pathSegments = isPlayerPage ? pathname.split("/").filter(Boolean) : [];
  const playerNameEncoded = isPlayerPage && pathSegments.length >= 4 ? pathSegments[3] : "";
  const playerName = playerNameEncoded ? decodeURIComponent(playerNameEncoded) : "";
  const regionParam = getRegionFromPath();
  const ladderTypeFromPath = isPlayerPage && pathSegments.length >= 3 ? pathSegments[2] : "1v1";
  const ladderType: LadderType = ladderTypeFromPath === "2v2-random" ? "2v2-random" : "1v1";
  const { data: matchHistory } = usePlayerMatchHistory(regionParam, ladderType, playerName);

  let themeToUse = isRegionPage ? sovietTheme : neutralTheme;
  if (isPlayerPage) {
    const side = getPreferredSide(matchHistory);
    themeToUse = side === "allies" ? alliedTheme : side === undefined ? neutralTheme : sovietTheme;
  }

  return (
    <ThemeProvider theme={themeToUse}>
      <CssBaseline />
      <RegionPicker />
    </ThemeProvider>
  );
}
