"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { setApiBaseUrl, clearApiCache } from "@/lib/api";
import { fetchServersConfig, getDefaultServersConfig, getDefaultServer, type ServerConfig } from "@/lib/serversConfig";

export type Region = ServerConfig;

interface RegionContextType {
  selectedRegion: Region;
  setSelectedRegion: (region: Region, updateURL?: boolean) => void;
  regions: Region[];
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // Start with default configuration immediately
  const defaultRegions = getDefaultServersConfig();
  const [regions, setRegions] = useState<Region[]>(defaultRegions);
  const [selectedRegion, setSelectedRegionState] = useState<Region>(() => {
    // Priority: URL parameter > localStorage > default
    if (typeof window !== "undefined") {
      // Check URL parameter first (get it directly from window.location to avoid searchParams dependency)
      const urlParams = new URLSearchParams(window.location.search);
      const urlRegionId = urlParams.get("region");
      if (urlRegionId) {
        const urlRegion = defaultRegions.find((r) => r.id === urlRegionId);
        if (urlRegion) {
          return urlRegion;
        }
      }

      // Fallback to localStorage
      const savedRegionId = localStorage.getItem("chronodivide-selected-region");
      if (savedRegionId) {
        const savedRegion = defaultRegions.find((r) => r.id === savedRegionId);
        if (savedRegion) {
          return savedRegion;
        }
      }
    }
    return getDefaultServer(defaultRegions);
  });

  // Helper function to update URL with region parameter
  const updateURLWithRegion = useCallback(
    (regionId: string) => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        params.set("region", regionId);
        const newURL = `${window.location.pathname}?${params.toString()}`;
        router.replace(newURL, { scroll: false });
      }
    },
    [router]
  );

  // Set initial API base URL
  useEffect(() => {
    setApiBaseUrl(selectedRegion.baseUrl);
  }, [selectedRegion.baseUrl]);

  // Only update URL when user explicitly changes region (not on every searchParams change)
  // This prevents infinite loops when the page loads with existing region parameters

  // Fetch updated regions in background (no loading state)
  useEffect(() => {
    const fetchUpdatedServers = async () => {
      try {
        const fetchedRegions = await fetchServersConfig();

        if (JSON.stringify(fetchedRegions) !== JSON.stringify(regions)) {
          setRegions(fetchedRegions);

          const currentRegionId = selectedRegion.id;
          const updatedRegion = fetchedRegions.find((r) => r.id === currentRegionId);
          if (updatedRegion) {
            setSelectedRegionState(updatedRegion);
            setApiBaseUrl(updatedRegion.baseUrl);
          } else {
            const newDefaultRegion = getDefaultServer(fetchedRegions);
            setSelectedRegionState(newDefaultRegion);
            setApiBaseUrl(newDefaultRegion.baseUrl);
            clearApiCache();
          }
        }
      } catch (err) {
        console.warn("Failed to fetch updated server configuration:", err);
        // Continue with default/current configuration
      }
    };

    fetchUpdatedServers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Save region to localStorage when changed
  const setSelectedRegion = (region: Region, updateURL: boolean = true) => {
    setSelectedRegionState(region);
    if (typeof window !== "undefined") {
      localStorage.setItem("chronodivide-selected-region", region.id);
    }
    setApiBaseUrl(region.baseUrl);
    // Only update URL parameter if explicitly requested (user-initiated changes)
    if (updateURL) {
      updateURLWithRegion(region.id);
    }
    // Clear cached data to force refetch from new region
    clearApiCache();
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
