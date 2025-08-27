"use client";

import React from "react";
import { Box, FormControl, Select, MenuItem, Typography, SelectChangeEvent } from "@mui/material";
import { useRegion } from "@/contexts/RegionContext";
import { useRouter, usePathname } from "next/navigation";

export default function RegionPicker() {
  const { setSelectedRegion, regions } = useRegion();
  const router = useRouter();
  const pathname = usePathname();

  // Extract region from pathname
  const getRegionFromPath = () => {
    const pathSegments = pathname.split("/");

    // Check if we're on a player page
    const playerIndex = pathSegments.findIndex((segment) => segment === "player");
    if (playerIndex !== -1 && playerIndex + 1 < pathSegments.length) {
      const regionFromPath = pathSegments[playerIndex + 1];
      if (regions.find((r) => r.id === regionFromPath)) {
        return regionFromPath;
      }
    }

    // Check if we're on a region page (like /am-eu, /sea)
    if (pathSegments.length > 1) {
      const regionFromPath = pathSegments[1];
      if (regions.find((r) => r.id === regionFromPath)) {
        return regionFromPath;
      }
    }

    // Default to am-eu if no valid region found
    return "am-eu";
  };

  const currentRegion = getRegionFromPath();

  const handleRegionChange = (event: SelectChangeEvent<string>) => {
    const regionId = event.target.value;
    const region = regions.find((r) => r.id === regionId);
    if (region) {
      setSelectedRegion(region);

      // Update the URL path to reflect the new region
      const pathSegments = pathname.split("/");

      // Check if we're on a player page
      const playerIndex = pathSegments.findIndex((segment) => segment === "player");
      if (playerIndex !== -1 && playerIndex + 1 < pathSegments.length) {
        // Replace the region in the player path
        pathSegments[playerIndex + 1] = regionId;
        const newPath = pathSegments.join("/");
        router.push(newPath);
      } else if (pathSegments.length > 1 && regions.find((r) => r.id === pathSegments[1])) {
        // Replace the region in the main region path
        pathSegments[1] = regionId;
        const newPath = pathSegments.join("/");
        router.push(newPath);
      } else {
        // Navigate to the new region page
        router.push(`/${regionId}`);
      }
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography variant="body2" color="text.secondary">
        Region:
      </Typography>
      <FormControl sx={{ minWidth: 180 }}>
        <Select
          value={currentRegion}
          onChange={handleRegionChange}
          variant="outlined"
          size="small"
          sx={{ minWidth: 180 }}
        >
          {regions.map((region) => (
            <MenuItem key={region.id} value={region.id} disabled={!region.available}>
              {region.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
