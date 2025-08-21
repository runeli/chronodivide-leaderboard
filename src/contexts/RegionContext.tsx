"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();

  // Start with default configuration immediately
  const defaultRegions = getDefaultServersConfig();
  const [regions, setRegions] = useState<Region[]>(defaultRegions);
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
        const params = new URLSearchParams(searchParams.toString());
        params.set("region", regionId);
        const newURL = `${window.location.pathname}?${params.toString()}`;
        router.replace(newURL, { scroll: false });
      }
    },
    [searchParams, router]
  );

  // Set initial API base URL
  useEffect(() => {
    setApiBaseUrl(selectedRegion.baseUrl);
  }, [selectedRegion.baseUrl]);

  useEffect(() => {
    const urlRegionId = searchParams.get("region");
    if (urlRegionId) {
      const urlRegion = regions.find((r) => r.id === urlRegionId);
      if (urlRegion && urlRegion.id !== selectedRegion.id) {
        setSelectedRegionState(urlRegion);
        setApiBaseUrl(urlRegion.baseUrl);
        if (typeof window !== "undefined") {
          localStorage.setItem("chronodivide-selected-region", urlRegion.id);
        }
        clearApiCache();
      }
    }
  }, [searchParams, regions, selectedRegion.id]);

  //init load if user has no region in url
  useEffect(() => {
    if (typeof window !== "undefined" && !searchParams.get("region")) {
      updateURLWithRegion(selectedRegion.id);
    }
  }, [selectedRegion.id, searchParams, updateURLWithRegion]);

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
      }
    };

    fetchUpdatedServers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setSelectedRegion = (region: Region, updateURL: boolean = true) => {
    setSelectedRegionState(region);
    if (typeof window !== "undefined") {
      localStorage.setItem("chronodivide-selected-region", region.id);
    }
    setApiBaseUrl(region.baseUrl);
    if (updateURL) {
      updateURLWithRegion(region.id);
    }
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
