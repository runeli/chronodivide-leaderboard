"use client";

import RegionPicker from "./RegionPicker";
import { usePathname } from "next/navigation";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { neutralTheme, sovietTheme } from "@/theme/themes";

export default function RegionPickerWithTheme() {
  const pathname = usePathname();

  const isRegionPage = pathname === "/am-eu" || pathname === "/sea";
  const themeToUse = isRegionPage ? sovietTheme : neutralTheme;

  return (
    <ThemeProvider theme={themeToUse}>
      <CssBaseline />
      <RegionPicker />
    </ThemeProvider>
  );
}
