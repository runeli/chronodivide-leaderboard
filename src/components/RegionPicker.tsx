"use client";

import React from "react";
import { Box, FormControl, Select, MenuItem, Typography, SelectChangeEvent } from "@mui/material";
import { useRegion } from "@/contexts/RegionContext";
import { useSearchParams } from "next/navigation";

export default function RegionPicker() {
  const { selectedRegion, setSelectedRegion, regions } = useRegion();

  const handleRegionChange = (event: SelectChangeEvent<string>) => {
    const regionId = event.target.value;
    const region = regions.find((r) => r.id === regionId);
    if (region) {
      setSelectedRegion(region);
    }
  };

  const searchParams = useSearchParams();
  const regionParam = searchParams.get("region") ?? selectedRegion.id;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography variant="body2" color="text.secondary">
        Region:
      </Typography>
      <FormControl sx={{ minWidth: 180 }}>
        <Select
          value={regionParam}
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
