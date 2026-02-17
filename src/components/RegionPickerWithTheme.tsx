"use client";

import RegionPicker from "./RegionPicker";
import { usePathname } from "next/navigation";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { alliedTheme, neutralTheme, sovietTheme } from "@/theme/themes";
import { usePreferredSide } from "@/contexts/PreferredSideContext";

export default function RegionPickerWithTheme() {
  const pathname = usePathname();
  const { preferredSide } = usePreferredSide();

  const isRegionPage = pathname === "/am-eu" || pathname === "/sea";
  const isPlayerPage = pathname.startsWith("/player/");

  let themeToUse = isRegionPage ? sovietTheme : neutralTheme;
  if (isPlayerPage) {
    themeToUse = preferredSide === "allies" ? alliedTheme : preferredSide === undefined ? neutralTheme : sovietTheme;
  }

  return (
    <ThemeProvider theme={themeToUse}>
      <CssBaseline />
      <RegionPicker />
    </ThemeProvider>
  );
}
