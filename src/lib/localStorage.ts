"use client";

const SELECTED_REGION_KEY = "chronodivide-selected-region";

export function getSavedRegion(): string {
  if (typeof window === "undefined") {
    return "am-eu";
  }

  try {
    const savedRegionId = localStorage.getItem(SELECTED_REGION_KEY);
    return savedRegionId || "am-eu";
  } catch (error) {
    console.error("Error reading saved region from localStorage:", error);
    return "am-eu";
  }
}

export function saveRegion(regionId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(SELECTED_REGION_KEY, regionId);
  } catch (error) {
    console.error("Error saving region to localStorage:", error);
  }
}
