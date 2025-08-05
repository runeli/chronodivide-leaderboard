'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { setApiBaseUrl, clearApiCache } from '@/lib/api';
import {
  fetchServersConfig,
  getDefaultServersConfig,
  getDefaultServer,
  type ServerConfig,
} from '@/lib/serversConfig';

export type Region = ServerConfig;

interface RegionContextType {
  selectedRegion: Region;
  setSelectedRegion: (region: Region) => void;
  regions: Region[];
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

export function RegionProvider({ children }: { children: React.ReactNode }) {
  // Start with default configuration immediately
  const defaultRegions = getDefaultServersConfig();
  const [regions, setRegions] = useState<Region[]>(defaultRegions);
  const [selectedRegion, setSelectedRegionState] = useState<Region>(() => {
    // Initialize with saved region or default (client-side only)
    if (typeof window !== 'undefined') {
      const savedRegionId = localStorage.getItem(
        'chronodivide-selected-region'
      );
      if (savedRegionId) {
        const savedRegion = defaultRegions.find((r) => r.id === savedRegionId);
        if (savedRegion) {
          return savedRegion;
        }
      }
    }
    return getDefaultServer(defaultRegions);
  });

  // Set initial API base URL
  useEffect(() => {
    setApiBaseUrl(selectedRegion.baseUrl);
  }, [selectedRegion.baseUrl]);

  // Fetch updated regions in background (no loading state)
  useEffect(() => {
    const fetchUpdatedServers = async () => {
      try {
        const fetchedRegions = await fetchServersConfig();

        // Only update if the fetched regions are different
        if (JSON.stringify(fetchedRegions) !== JSON.stringify(regions)) {
          setRegions(fetchedRegions);

          // Update selected region if it still exists in the new list
          const currentRegionId = selectedRegion.id;
          const updatedRegion = fetchedRegions.find(
            (r) => r.id === currentRegionId
          );
          if (updatedRegion) {
            setSelectedRegionState(updatedRegion);
            setApiBaseUrl(updatedRegion.baseUrl);
          } else {
            // Selected region no longer exists, use default
            const newDefaultRegion = getDefaultServer(fetchedRegions);
            setSelectedRegionState(newDefaultRegion);
            setApiBaseUrl(newDefaultRegion.baseUrl);
            // Clear cache since we're switching to a different region
            clearApiCache();
          }
        }
      } catch (err) {
        console.warn('Failed to fetch updated server configuration:', err);
        // Continue with default/current configuration
      }
    };

    fetchUpdatedServers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Save region to localStorage when changed
  const setSelectedRegion = (region: Region) => {
    setSelectedRegionState(region);
    if (typeof window !== 'undefined') {
      localStorage.setItem('chronodivide-selected-region', region.id);
    }
    setApiBaseUrl(region.baseUrl);
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
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
}
