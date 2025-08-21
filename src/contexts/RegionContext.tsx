"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { clearApiCache } from "@/lib/api";
import { getSavedRegion, saveRegion } from "@/lib/recentPlayers";

export interface Region {
  id: string;
  baseUrl: string;
  label: string;
  available: boolean;
}

import { defaultRegions } from "@/lib/api";

interface RegionContextType {
  selectedRegion: Region;
  setSelectedRegion: (region: Region, updateURL?: boolean) => void;
  regions: Region[];
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [regions] = useState<Region[]>(defaultRegions);
  const [selectedRegion, setSelectedRegionState] = useState<Region>(() => {
    // Priority: URL parameter > localStorage > default
    if (typeof window !== "undefined") {
      // Check URL parameter first
      const urlParams = new URLSearchParams(window.location.search);
      const urlRegionId = urlParams.get("region");
      if (urlRegionId) {
        const urlRegion = defaultRegions.find((r) => r.id === urlRegionId);
        if (urlRegion) {
          return urlRegion;
        }
      }

      const savedRegionId = getSavedRegion();
      const savedRegion = defaultRegions.find((r) => r.id === savedRegionId);
      if (savedRegion) {
        return savedRegion;
      }
    }
    return defaultRegions[0]; // Default to first region (am-eu)
  });

  // Helper function to update URL with region parameter
  const updateURLWithRegion = useCallback(
    (regionId: string) => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(searchParams.toString());
        params.set("region", regionId);
        const newURL = `${window.location.pathname}?${params.toString()}`;
        router.replace(newURL, { scroll: false });
      }
    },
    [searchParams, router]
  );

  useEffect(() => {
    const urlRegionId = searchParams.get("region");
    if (urlRegionId) {
      const urlRegion = regions.find((r) => r.id === urlRegionId);
      if (urlRegion && urlRegion.id !== selectedRegion.id) {
        setSelectedRegionState(urlRegion);
        if (typeof window !== "undefined") {
          saveRegion(urlRegion.id);
        }
      }
    }
  }, [searchParams, regions, selectedRegion.id]);

  //init load if user has no region in url
  useEffect(() => {
    if (typeof window !== "undefined" && !searchParams.get("region")) {
      updateURLWithRegion(selectedRegion.id);
    }
  }, [selectedRegion.id, searchParams, updateURLWithRegion]);

  const setSelectedRegion = (region: Region, updateURL: boolean = true) => {
    setSelectedRegionState(region);
    if (typeof window !== "undefined") {
      saveRegion(region.id);
    }
    if (updateURL) {
      updateURLWithRegion(region.id);
    }
  };

  return (
    <RegionContext.Provider
      value={{
        selectedRegion,
        setSelectedRegion,
        regions,
      }}
    >
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  const context = useContext(RegionContext);
  if (context === undefined) {
    throw new Error("useRegion must be used within a RegionProvider");
  }
  return context;
}
