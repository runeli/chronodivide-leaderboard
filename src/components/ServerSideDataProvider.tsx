import { Suspense } from "react";
import { CircularProgress, Box } from "@mui/material";

interface ServerSideDataProviderProps {
  children: React.ReactNode;
}

// This component provides server-side fetched data to reduce client-side API calls
export default function ServerSideDataProvider({ children }: ServerSideDataProviderProps) {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      }
    >
      {children}
    </Suspense>
  );
}

// Server-side data fetching functions
export async function fetchStatsData(regionId: string): Promise<StatsResponse | null> {
  try {
    const baseUrl = regionId === "am-eu" ? "https://wol-eu1.chronodivide.com" : "https://wol-sea1.chronodivide.com";

    const res = await fetch(`${baseUrl}/stats`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
      headers: {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
      },
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchSeasonData(regionId: string, seasonId: string): Promise<LadderSeason | null> {
  try {
    const baseUrl = regionId === "am-eu" ? "https://wol-eu1.chronodivide.com" : "https://wol-sea1.chronodivide.com";

    const res = await fetch(`${baseUrl}/ladder/16640/${seasonId}`, {
      next: { revalidate: 600 }, // Cache for 10 minutes
      headers: {
        "Cache-Control": "public, max-age=600, stale-while-revalidate=1200",
      },
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
