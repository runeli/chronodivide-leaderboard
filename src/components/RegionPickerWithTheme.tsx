"use client";

import React from "react";
import RegionPicker from "./RegionPicker";
import { usePathname, useSearchParams } from "next/navigation";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { alliedTheme, neutralTheme, sovietTheme } from "@/theme/themes";
import { useRegion } from "@/contexts/RegionContext";
import { LadderType, getPreferredSide, usePlayerMatchHistory } from "@/lib/api";

export default function RegionPickerWithTheme() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { selectedRegion } = useRegion();

  const isSearchPage = pathname === "/";
  const isPlayerPage = pathname.startsWith("/player/");

  // Determine player name if on player page; pass empty otherwise to keep hook order stable
  const playerNameEncoded = isPlayerPage ? (pathname.split("/player/")[1]?.split("/")[0] ?? "") : "";
  const playerName = playerNameEncoded ? decodeURIComponent(playerNameEncoded) : "";
  const regionParam = searchParams.get("region") ?? selectedRegion.id;
  const ladderType: LadderType = "1v1";
  const { data: matchHistory } = usePlayerMatchHistory(regionParam, ladderType, playerName);

  // Default: neutral on search page, otherwise soviet; override on player page by side
  let themeToUse = isSearchPage ? sovietTheme : neutralTheme;
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
