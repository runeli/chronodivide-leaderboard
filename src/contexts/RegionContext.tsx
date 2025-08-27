"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const [regions] = useState<Region[]>(defaultRegions);

  // Extract region from pathname
  const getRegionFromPath = useCallback(() => {
    const pathSegments = pathname.split("/");

    // Check if we're on a player page
    const playerIndex = pathSegments.findIndex((segment) => segment === "player");
    if (playerIndex !== -1 && playerIndex + 1 < pathSegments.length) {
      const regionFromPath = pathSegments[playerIndex + 1];
      if (defaultRegions.find((r) => r.id === regionFromPath)) {
        return regionFromPath;
      }
    }

    // Check if we're on a region page (like /am-eu, /sea)
    if (pathSegments.length > 1) {
      const regionFromPath = pathSegments[1];
      if (defaultRegions.find((r) => r.id === regionFromPath)) {
        return regionFromPath;
      }
    }

    // Default to am-eu if no valid region found
    return "am-eu";
  }, [pathname]);

  const [selectedRegion, setSelectedRegionState] = useState<Region>(() => {
    // Priority: URL path > localStorage > default
    if (typeof window !== "undefined") {
      // Check URL path first
      const regionFromPath = getRegionFromPath();
      const pathRegion = defaultRegions.find((r) => r.id === regionFromPath);
      if (pathRegion) {
        return pathRegion;
      }

      const savedRegionId = getSavedRegion();
      const savedRegion = defaultRegions.find((r) => r.id === savedRegionId);
      if (savedRegion) {
        return savedRegion;
      }
    }
    return defaultRegions[0]; // Default to first region (am-eu)
  });

  // Helper function to update URL path with region
  const updateURLWithRegion = useCallback(
    (regionId: string) => {
      if (typeof window !== "undefined") {
        const pathSegments = pathname.split("/");

        // Check if we're on a player page
        const playerIndex = pathSegments.findIndex((segment) => segment === "player");
        if (playerIndex !== -1 && playerIndex + 1 < pathSegments.length) {
          // Replace the region in the player path
          pathSegments[playerIndex + 1] = regionId;
          const newPath = pathSegments.join("/");
          router.replace(newPath, { scroll: false });
        } else if (pathSegments.length > 1 && defaultRegions.find((r) => r.id === pathSegments[1])) {
          // Replace the region in the main region path
          pathSegments[1] = regionId;
          const newPath = pathSegments.join("/");
          router.replace(newPath, { scroll: false });
        } else {
          // Navigate to the new region page
          router.replace(`/${regionId}`, { scroll: false });
        }
      }
    },
    [pathname, router]
  );

  // Update selected region when path changes
  useEffect(() => {
    const regionFromPath = getRegionFromPath();
    const pathRegion = defaultRegions.find((r) => r.id === regionFromPath);
    if (pathRegion && pathRegion.id !== selectedRegion.id) {
      setSelectedRegionState(pathRegion);
    }
  }, [pathname, getRegionFromPath, selectedRegion.id]);

  //init load if user has no region in path
  useEffect(() => {
    if (typeof window !== "undefined") {
      const regionFromPath = getRegionFromPath();
      if (regionFromPath === "am-eu" && pathname === "/") {
        // If we're on the root path, redirect to am-eu
        router.replace("/am-eu", { scroll: false });
      }
    }
  }, [pathname, getRegionFromPath, router]);

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
