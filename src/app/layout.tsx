import type { Metadata } from "next";
import { Suspense } from "react";
import { Fira_Sans_Condensed } from "next/font/google";
import ThemeRegistry from "@/components/ThemeRegistry";
import { Container, Box, CircularProgress } from "@mui/material";
import { RegionProvider } from "@/contexts/RegionContext";
import { PreferredSideProvider } from "@/contexts/PreferredSideContext";
import RegionPickerWithTheme from "@/components/RegionPickerWithTheme";

const firaSansCondensed = Fira_Sans_Condensed({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fira-sans-condensed",
});

export const metadata: Metadata = {
  title: "Chrono Divide Ladder",
  description: "Statistics and leaderboard for Chrono Divide",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={firaSansCondensed.variable}>
      <body>
        <ThemeRegistry>
          <Suspense
            fallback={
              <Container component="main" sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Container>
            }
          >
            <RegionProvider>
              <PreferredSideProvider>
                <Container component="main" sx={{ mt: 2 }}>
                  <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end", mr: 1 }}>
                    <RegionPickerWithTheme />
                  </Box>
                  {children}
                </Container>
              </PreferredSideProvider>
            </RegionProvider>
          </Suspense>
        </ThemeRegistry>
      </body>
    </html>
  );
}
